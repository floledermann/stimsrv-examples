@echo off

rem Use this script in conjunction with launch.bat to debug experiments
rem Execution of stimsrv will halt at the start, and you can use Chrome 
rem developer tools to debug your experiment server. 

setlocal

set STIMSRV_DEBUG="DEBUG"

launch.bat %1
