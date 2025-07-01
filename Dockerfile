# Unified Dockerfile for all services.
# You take complexity from the docker-compose.unified.yml file, and put it here.
# This exercise has taught me that building a complicated docker image is a pain.
# I've also learned the value of a proper multi-stage build. In this case, the haskell
# installation is infuriatingly slow and so happens first in an isolated stage.  That way, 
# small changes to other parts of the base stage don't trigger a full rebuild of the haskell
# part.  Multi-stage also helps with debugging things that don't work.  

# ----------------------------------------------------------------------------------------------------
# --- Haskell Base Stage (Minimal - for fast Haskell builds) ---
# This stage comes first and only contains what's needed for Haskell compilation
# This way, changes to the main base stage won't invalidate the Haskell build cache
FROM debian:bookworm-slim AS haskell-base
ENV DEBIAN_FRONTEND=noninteractive

# Install only Haskell dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    # Haskell (for suppliers)
    ghc cabal-install \
    # Dependencies for Haskell compilation
    libpq-dev \
    libstdc++-12-dev \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Health check for Haskell
RUN ghc --version
# ----------------------------------------------------------------------------------------------------

# ----------------------------------------------------------------------------------------------------
# --- Suppliers Builder (Haskell) ---
# This now depends only on the minimal haskell-base, not the full base stage
FROM haskell-base AS suppliers-builder
WORKDIR /app/suppliers
COPY suppliers/suppliers.cabal .
RUN cabal update && \
    cabal build --only-dependencies
COPY suppliers .
RUN cabal install --install-method=copy --overwrite-policy=always
# ----------------------------------------------------------------------------------------------------

# ----------------------------------------------------------------------------------------------------
# --- Base Stage ---
# Use Debian Bookworm as base, as it's the most versatile for our needs.
FROM debian:bookworm-slim AS base
ENV DEBIAN_FRONTEND=noninteractive

# Set timezone
ENV TZ=Australia/Sydney

# Install dependencies for all services (except Haskell which is handled separately)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    # General dependencies
    curl unzip git gnupg netbase pkg-config supervisor tzdata \
    # Python (for customers)
    python3 python3-pip pipx \
    # Java (for products)
    openjdk-17-jre-headless \
    # Elixir (for orders)
    elixir \
    # Postgres client (for all services)
    postgresql-client \
    # Postgres server (for database)
    postgresql postgresql-contrib \
    # Nginx (for reverse proxy)
    nginx && \
    rm -rf /var/lib/apt/lists/*

# Install bun - needed for dashboard
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# --- Health Checks ---
RUN python3 --version && \
    java -version && \
    elixir --version && \
    psql --version && \
    supervisord --version && \
    bun --version
# ----------------------------------------------------------------------------------------------------



# ----------------------------------------------------------------------------------------------------
# --- Orders Builder ---
FROM base AS orders-builder
WORKDIR /app/orders
COPY orders/mix.exs orders/mix.lock ./
RUN mix local.rebar --force && \
    mix local.hex --force && \
    mix deps.get && \
    mix compile
# ----------------------------------------------------------------------------------------------------



# ----------------------------------------------------------------------------------------------------
# --- Customers Builder ---
FROM base AS customers-builder
WORKDIR /app/customers
RUN pipx install poetry
COPY customers/pyproject.toml customers/poetry.lock* ./
RUN /root/.local/bin/poetry config virtualenvs.in-project true && \
    /root/.local/bin/poetry install --no-interaction --no-ansi --no-root
COPY customers/ .
# ----------------------------------------------------------------------------------------------------



# ----------------------------------------------------------------------------------------------------
# --- Dashboard API Builder ---
FROM base AS dashboard-api-builder
WORKDIR /app/dashboard-api
RUN python3 -m venv .venv
COPY dashboard-api/requirements.txt .
RUN .venv/bin/pip install -r requirements.txt
COPY dashboard-api/ .
# ----------------------------------------------------------------------------------------------------



# ----------------------------------------------------------------------------------------------------
# --- Dashboard Builder ---
# This stage builds the React dashboard application.
FROM base AS dashboard-builder
WORKDIR /app/dashboard
# Copy package manifests and install dependencies
COPY dashboard/package.json dashboard/bun.lock* ./
RUN bun install --frozen-lockfile   
# Copy the rest of the application source
COPY dashboard/ .
# Build the application. Note the API URL is hardcoded in the build script now.
RUN bun run build.ts
# ----------------------------------------------------------------------------------------------------



# ----------------------------------------------------------------------------------------------------
# --- Final Stage ---
# Start from the base image to create the final image.
FROM base

# --- Database Setup ---
# This is placed early in the final stage. It will only be rebuilt if these files change.
COPY ./database/postgres-init /docker-entrypoint-initdb.d/
COPY ./database/setup-db.sh /usr/local/bin/setup-db.sh
RUN chmod +x /usr/local/bin/setup-db.sh

# Create app directory
WORKDIR /app

# --- Customers ---
COPY --from=customers-builder /app/customers /app/customers

# --- Dashboard API ---
COPY --from=dashboard-api-builder /app/dashboard-api /app/dashboard-api

# --- Dashboard ---
COPY --from=dashboard-builder /app/dashboard /app/dashboard

# --- Products ---
# Copying a prebuilt jar is not the way to do things, but after the experience of creating a 
# build stage for a haskell project, I'm not keen to do the same for a JVM one.
# This is actually useful in another way though, since it makes you think about the portability
# of java bytecode.
COPY ./products/target/scala-3.6.2/products-assembly-0.1.0-SNAPSHOT.jar /app/products/app.jar

# --- Orders ---
COPY --from=orders-builder /app/orders/_build /app/orders/_build
COPY --from=orders-builder /app/orders/deps /app/orders/deps
COPY --from=orders-builder /app/orders/mix.exs /app/orders/mix.lock /app/orders/
COPY ./orders /app/orders

# --- Suppliers ---
COPY --from=suppliers-builder /root/.cabal/bin/suppliers /app/suppliers/
COPY --from=suppliers-builder /root/.cabal/store /root/.cabal/store

# --- Supervisor ---
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# --- Nginx Configuration ---
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 

# ----------------------------------------------------------------------------------------------------
