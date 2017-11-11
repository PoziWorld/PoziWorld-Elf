!macro customInstall
  WriteRegStr HKCU "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.poziworld.elf" '' '$INSTDIR\com.poziworld.elf-win.json'
!macroend
