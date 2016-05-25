defmodule Anivia.Router do
  use Anivia.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Anivia do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/:region/:summoner_name", PageController, :index
  end

  scope "/api", Anivia do
    pipe_through :api
    get "/:region/:summoner_id/detail", ApiController, :summoner_detail
    get "/:region/:summoner_name", ApiController, :summoner
  end
end
