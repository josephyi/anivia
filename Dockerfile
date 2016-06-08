FROM josephyi/alpine-phoenix:1.2

RUN mkdir /app
WORKDIR /app
ENV MIX_ENV=prod
ENV NODE_ENV=production
ENV PORT=4000

COPY . /app
RUN mix deps.get
RUN mix compile 
RUN npm install
RUN mix phoenix.digest
VOLUME ["/app"]
CMD ["mix", "phoenix.server"]
