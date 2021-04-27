@echo off

rem *******************************************************************
rem ** Helper script to launch stimsrv experiments on Windows        **
rem **                                                               **
rem ** Experiment files dropped onto this .bat file will be started. **
rem **                                                               **
rem ** Double-clicking this file will start the first file           **
rem **   with "experiment" in its name.                              **
rem *******************************************************************

echo. 

setlocal

set command=npx stimsrv --open

rem monitor mode
if defined STIMSRV_MONITOR (
  set command=npx nodemon --watch *.js --watch ../../node_modules/stimsrv/src --exec "npx" stimsrv
)

rem debugging mode
rem npx doesn't support passing params to node on Windows, so we have to find stimsrv manually
if defined STIMSRV_DEBUG (
  if exist node_modules\stimsrv\ (
    set command=node --inspect-brk node_modules\stimsrv
  ) else (
    if exist ..\node_modules\stimsrv\ (
      set command=node --inspect-brk ..\node_modules\stimsrv
    ) else (
      if exist ..\..\node_modules\stimsrv\ (
        set command=node --inspect-brk ..\..\node_modules\stimsrv
      ) else (
        echo "stimsrv module not found!"
        exit /b 1
      )
    )
  )
)

set filename=%1

set EXPERIMENT_PATTERN=*experiment*.js

if NOT "%filename%"=="" goto ok
REM default filename: first js file with "experiment" in name
FOR %%F IN (%EXPERIMENT_PATTERN%) DO (
  echo Experiment matching pattern found: %%F
  set filename=%%F
  goto ok
)
echo No experiment (matching pattern %EXPERIMENT_PATTERN%) found in current directory!
echo.
pause
exit /b 1
:ok


echo Launching %filename% ...
echo.

echo %command% %filename%
call %command% %filename%

pause
