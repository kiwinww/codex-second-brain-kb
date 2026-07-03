$ErrorActionPreference = "Stop"

if (-not $env:ALIYUN_BUCKET) {
  throw "Missing ALIYUN_BUCKET"
}

if (-not $env:ALIYUN_ENDPOINT) {
  throw "Missing ALIYUN_ENDPOINT"
}

$Root = Split-Path -Parent $PSScriptRoot
$Public = Join-Path $Root "public"
python (Join-Path $Root "tools/build_site.py")

$ossutil = Get-Command ossutil -ErrorAction SilentlyContinue
if (-not $ossutil) {
  throw "ossutil is not installed or not on PATH. Install Alibaba Cloud OSS command line tool first."
}

ossutil config -e $env:ALIYUN_ENDPOINT -i $env:ALIYUN_ACCESS_KEY_ID -k $env:ALIYUN_ACCESS_KEY_SECRET
ossutil cp -r -f $Public "oss://$env:ALIYUN_BUCKET/"

