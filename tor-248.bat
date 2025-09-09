@echo off
echo %1
SETLOCAL ENABLEDELAYEDEXPANSION

SET pabrik=%1

IF "%1"=="" (
    echo "Do Nothing"
) ELSE (
    xcopy /y .env-prod .env

    SET HOUR=%time:~0,2%
    SET dtStamp9=%date:~-4%%date:~4,2%%date:~7,2%_0%time:~1,1%%time:~3,2%%time:~6,2% 
    SET dtStamp24=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%

    IF "%HOUR:~0,1%" == " " (
        SET dtStamp=!dtStamp9!
    ) ELSE (
        SET dtStamp=!dtStamp24!
    )

    SET ip_is=PUBLIC

    IF "!ip_is!"=="PUBLIC" (
        SET url=27.131.248.29
    ) ELSE (
        SET url=192.168.120.163
    )

    IF /I "!pabrik!"=="arp" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9001
        ) ELSE (
            SET dport=8001
        )
    ) ELSE IF /I "!pabrik!"=="kas" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9003
        ) ELSE (
            SET dport=8003
        )
    ) ELSE IF /I "!pabrik!"=="kus" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9005
        ) ELSE (
            SET dport=8005
        )
    ) ELSE IF /I "!pabrik!"=="kap" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9002
        ) ELSE (
            SET dport=8002
        )
    ) ELSE IF /I "!pabrik!"=="smp" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9006
        ) ELSE (
            SET dport=8006
        )
    ) ELSE IF /I "!pabrik!"=="kpn" (
        IF "!ip_is!"=="PUBLIC" (
            SET dport=9004
        ) ELSE (
            SET dport=8004
        )
    )

    call SET ROUTER_BASE=/%pabrik%/logistik
    call SET MY_API_ADDR=http://!url!:!dport!/

    call npm run generate
    @REM xcopy /s /y .\dist\* ..\%pabrik%\logistik\
    xcopy /s /y .\dist\* \\192.168.99.246\htdocs\%pabrik%\logistik\
    @REM xcopy /s /y .\dist\* \\192.168.120.247\htdocs\%pabrik%\logistik\

)




    @REM smp
    @REM call SET MY_API_ADDR=http://192.168.120.163:/
    @REM kas
    @REM call SET MY_API_ADDR=http://192.168.120.163:/
    @REM kus
    @REM call SET MY_API_ADDR=http://192.168.120.163:/
@REM arp
@REM     call SET MY_API_ADDR=http://192.168.120.163:/
@REM kap
    @REM call SET MY_API_ADDR=http://192.168.120.163:/
    @REM kpn
@REM call SET MY_API_ADDR=http://192.168.120.163:/



    @REM smp
@REM    call SET MY_API_ADDR=http://27.131.248.29:/
    @REM kas
    @REM call SET MY_API_ADDR=http://27.131.248.29:/
    @REM kus
    @REM call SET MY_API_ADDR=http://27.131.248.29:/
@REM arp
    @REM call SET MY_API_ADDR=http://27.131.248.29:/
@REM kap
    @REM call SET MY_API_ADDR=http://27.131.248.29:/
    @REM kpn
@REM call SET MY_API_ADDR=http://27.131.248.29:/

    @REM call npm run generate
    @REM @REM xcopy /s /y .\dist\* ..\%pabrik%\logistik\
    @REM xcopy /s /y .\dist\* \\192.168.120.246\htdocs\%pabrik%\logistik\



