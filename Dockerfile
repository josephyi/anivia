FROM josephyi/alpine-phoenix:1.2

RUN mkdir /app
WORKDIR /app
ENV MIX_ENV=prod

COPY package.json /app
COPY mix.exs /app

RUN npm install
RUN mix deps.get

COPY . /app
RUN mix compile && mix phoenix.digest
EXPOSE 4000
EXPOSE 4001
VOLUME ["/app"]
CMD ["mix", "phoenix.server"]
