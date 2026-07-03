@echo off
setlocal
cd /d "%~dp0.."
python tools\build_site.py
start "" "%cd%\public\index.html"

