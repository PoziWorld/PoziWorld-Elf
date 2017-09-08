:: /**
::  * @file Launches Elf itself to listen for commands and elf-node.exe with a script responsible for native messaging handling.
::  * @copyright 2016-2017 PoziWorld, Inc. Borrowed from https://github.com/jdiamond/chrome-native-messaging
::  */

@echo off

set LOG=%~dp0elf.log

echo %date% %time% >> %LOG%

"%~dp0elf-node.exe" "%~dp0elf.bundle.js" %* 2>> %LOG%

echo %errorlevel% >> %LOG%
