@echo off

REM http://joseoncode.com/2011/11/27/solving-utf-problem-with-jekyll-on-windows/
chcp 65001

cd /d "%~dp0"
git add --all
git commit -m "autogen: update site"
git push -f

pause
