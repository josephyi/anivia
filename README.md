[![Ebert](https://ebertapp.io/github/josephyi/anivia.svg)](https://ebertapp.io/github/josephyi/anivia)

# Anivia

> "Let's soar."

Anivia is a single page application using player data from the Riot Games League of Legends API. The goal of the project is to make something useful for players and developers alike.

## Tech Stack

> "What change will this wind bring?"

  * Languages: Elixir, Javascript
  * App Server: Phoenix Framework
  * Database: NONE
  * Frontend Stack: React, Redux, Webpack

I develop and deploy Anivia from Docker, but that's optional.

Live demo here http://anivia.gosu.io

## Prerequisites

Sign up for a API Key at https://developer.riotgames.com/

## Docker Setup

### In development

```
# From project root, create image
docker build -t anivia .

# Start a container and enter shell
docker run -it -v $(pwd):/app -p 4000:4000 -p 4001:4001 -e MIX_ENV=dev -e RIOT_API_KEY=[YOUR_KEY_HERE] --rm anivia sh

# Install dependencies
npm install
mix deps.get

# Start phoenix
mix phoenix.server
```

## Mix Tasks
### Static Asset Generation
```
# Generates CSS for champion portraits
mix anivia.static_content
```

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: http://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
