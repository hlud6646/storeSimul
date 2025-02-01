# Use the official Haskell Docker image based on Debian
FROM haskell:latest

# Update the package list and install required system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for the app
WORKDIR /usr/src/app

# Copy the cabal file and install dependencies
COPY suppliers.cabal /usr/src/app/
RUN cabal update && cabal install --only-dependencies

# Copy the rest of the application code
COPY . /usr/src/app

# Build the application
RUN cabal build

# Set the entrypoint for the container
CMD ["cabal", "run"]