rem *******************************************************************
rem ** Helper script to launch stimsrv experiments on Windows        **
rem **                                                               **
rem ** Experiment files dropped onto this .bat file will be started. **
rem **                                                               **
rem ** Double-clicking this file will start the first file           **
rem **   with "experiment" in its name.                              **
rem *******************************************************************

@echo off
echo. 

setlocal

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

set command=npx stimsrv --open %filename%
echo %command%
call %command%

pause
