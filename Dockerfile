FROM josephyi/alpine-phoenix

COPY mix.exs /tmp
COPY mix.lock /tmp
WORKDIR /tmp

RUN yes | mix local.hex && mix deps.get



ADD ./ /app
WORKDIR /app

RUN mix deps.compile

EXPOSE 4000

ENTRYPOINT ["mix", "phoenix.server"]
