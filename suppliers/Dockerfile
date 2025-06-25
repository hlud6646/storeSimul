# Use Debian Bookworm as base
FROM debian:bookworm-slim

# Install basic build dependencies
RUN apt-get update && \
    apt-get install -y curl gcc g++ libc6-dev libffi-dev libgmp-dev make xz-utils zlib1g-dev git gnupg netbase pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install GHCup, GHC, and Cabal
ENV BOOTSTRAP_HASKELL_NONINTERACTIVE=1
ENV BOOTSTRAP_HASKELL_GHC_VERSION=9.6.4
ENV BOOTSTRAP_HASKELL_CABAL_VERSION=3.10.2.0
RUN curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
ENV PATH=/root/.ghcup/bin:$PATH

# Add PostgreSQL repository and install PostgreSQL client
RUN apt-get update && \
    apt-get install -y curl gnupg2 && \
    curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/null && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ bookworm-pgdg main" > /etc/apt/sources.list.d/postgresql.list && \
    apt-get update && \
    apt-get install -y postgresql-client-15 libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the cabal file first to cache dependencies
COPY ./suppliers.cabal ./suppliers.cabal

# Docker will cache this command as a layer, freeing us up to
# modify source code without re-installing dependencies
RUN cabal update && \
    cabal build --only-dependencies -j4

# Add and Install Application Code
COPY . .
RUN cabal install

CMD ["suppliers"]