@echo off

rem Use this script in conjunction with launch.bat to restart experiments upon changes

setlocal
set STIMSRV_MONITOR="MONITOR"

launch.bat %1
