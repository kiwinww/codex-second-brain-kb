$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
python (Join-Path $Root "tools/build_site.py")
python -m http.server 8000 -d (Join-Path $Root "public")

