@echo off
setlocal

set filename=%1
set EXPERIMENT_PATTERN=experiment*.js

if NOT "%filename%"=="" goto ok
FOR %%F IN (%EXPERIMENT_PATTERN%) DO (
  set filename=%%F
  goto ok
)
echo No experiment (matching pattern %EXPERIMENT_PATTERN%) found in current directory!
pause
exit /b 1
:ok

echo Launching %filename% ...
call npx nodemon -e js --watch . --exec "npx" stimsrv %filename%
pause