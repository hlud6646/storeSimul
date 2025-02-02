# Use the official Haskell Docker image based on Debian
FROM store/base/haskell

USER hugo
WORKDIR /home/hugo

COPY ./suppliers.cabal /home/hugo/suppliers.cabal

# Docker will cache this command as a layer, freeing us up to
# modify source code without re-installing dependencies
# (unless the .cabal file changes!)
RUN cabal update && cabal build --only-dependencies -j4

# Add and Install Application Code
COPY ./app /home/hugo/app
RUN cabal install

# CMD ["suppliers"]