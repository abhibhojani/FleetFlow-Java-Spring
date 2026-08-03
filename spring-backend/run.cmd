@echo off
REM Quick launch script for FleetFlow Spring Boot backend
REM Uses Maven installed at %USERPROFILE%\tools\apache-maven-3.9.16

SET MVN=%USERPROFILE%\tools\apache-maven-3.9.16\bin\mvn.cmd

IF NOT EXIST "%MVN%" (
    echo Maven not found at %USERPROFILE%\tools\apache-maven-3.9.16
    echo Please run the setup steps in README.md first.
    exit /B 1
)

"%MVN%" spring-boot:run
