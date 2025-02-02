FROM store/base/elixir:latest

# USER hugo
WORKDIR /home/hugo

COPY . .

# Install everything
RUN mix local.hex --force

CMD ["mix", "run", "--no-halt"]
