
echo %1
set arg1= %1
if "%1"=="kpn" (
  xcopy /y .env-kpn-ksr .env
) else if "%1"=="local" (
  xcopy /y .env-local .env
)


call npm run generate
xcopy /s /y .\dist\* ..\logistik\
cd ..
cd logistik
git add .
git commit -m "update"
git push origin main
pause

@REM if "%1"=="kpn" goto :tokpn
@REM if "%1"=="local" goto :tolocal

@REM :tokpn
@REM xcopy /y .env-kpn-ksr .env

@REM goto :next
@REM exit /b 0

@REM :tolocal
@REM xcopy /y .env-local .env
@REM goto :next
@REM exit /b 0

@REM :next
@REM exit