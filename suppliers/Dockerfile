# Use the official Haskell Docker image based on Debian
FROM haskell:9.10.1-slim-bullseye

WORKDIR /opt/suppliers

RUN cabal update

# Add just the .cabal file to capture dependencies
COPY ./suppliers.cabal /opt/suppliers/suppliers.cabal

# Docker will cache this command as a layer, freeing us up to
# modify source code without re-installing dependencies
# (unless the .cabal file changes!)
RUN cabal build --only-dependencies -j4

# Add and Install Application Code
COPY . /opt/suppliers
RUN cabal install

CMD ["suppliers"]