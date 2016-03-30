defmodule Anivia.PageController do
  use Anivia.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
