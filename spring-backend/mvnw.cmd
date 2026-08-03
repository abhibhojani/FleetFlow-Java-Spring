@echo off
setlocal

set MAVEN_WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar
set MAVEN_WRAPPER_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties

for /F "usebackq tokens=1,2 delims==" %%A in ("%MAVEN_WRAPPER_PROPERTIES%") do (
  if "%%A"=="distributionUrl" set DISTRIBUTION_URL=%%B
)

if "%JAVA_HOME%"=="" (
  for /F "tokens=*" %%i in ('where java 2^>nul') do (
    set JAVA_EXE=%%i
    goto foundJava
  )
  echo Java not found. Please install Java 17+.
  exit /B 1
  :foundJava
) else (
  set JAVA_EXE=%JAVA_HOME%\bin\java.exe
)

if not exist "%MAVEN_WRAPPER_JAR%" (
  echo Maven wrapper JAR not found at %MAVEN_WRAPPER_JAR%
  echo Please download it manually or install Maven globally.
  exit /B 1
)

"%JAVA_EXE%" -jar "%MAVEN_WRAPPER_JAR%" %*
endlocal
