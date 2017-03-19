use Mix.Releases.Config,
    # This sets the default release built by `mix release`
    default_release: :default,
    # This sets the default environment used by `mix release`
    default_environment: :dev

# For a full list of config options for both releases
# and environments, visit https://hexdocs.pm/distillery/configuration.html


# You may define one or more environments in this file,
# an environment's settings will override those of a release
# when building in that environment, this combination of release
# and environment configuration is called a profile

environment :dev do
  set dev_mode: true
  set include_erts: false
  set cookie: :"GVzquxwSQ]v}vOu8Ruz2x!$Dt4[(G|Z$Kvu8dI?^sq(fLhMz=nuv%,1a;@}Be_WP"
end

environment :prod do
  set include_erts: true
  set include_src: false
  set cookie: :"yPTK*s!pn`,0>4nTT_X1%P9/X9X5!E29dhRkwztn8rU;BXOEAvDC(%81z`6qAQ3/"
end

# You may define one or more releases in this file.
# If you have not set a default release, or selected one
# when running `mix release`, the first release in the file
# will be used by default

release :anivia do
  set version: current_version(:anivia)
end

