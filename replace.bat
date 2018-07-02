@echo off
setlocal enabledelayedexpansion
set /p txt=<.\_posts\categories.txt
set oldstr=%txt%
set word=%1
set result=!oldstr:%word%=!
if "%result%"=="%txt%" (
echo %txt%¡¢%word%>.\_posts\categories.txt
)
endlocal