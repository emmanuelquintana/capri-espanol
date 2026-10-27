!macro customWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Capri en español, a tu manera"
  !define MUI_WELCOMEPAGE_TEXT "Primero instalaremos Capri para tu usuario.$\r$\n$\r$\nDespués podrás elegir su tamaño, animaciones, sonidos y forma de conversar. El asistente comprobará si tu servicio de IA y tu modelo están preparados.$\r$\n$\r$\nNo necesitas abrir una terminal. Las descargas de motores o modelos se harán solo cuando las elijas."
  !insertmacro MUI_PAGE_WELCOME
!macroend

!macro customFinishPage
  Function CapriConfigure
    ${StdUtils.ExecShellAsUser} $0 "$INSTDIR\${APP_EXECUTABLE_FILENAME}" "open" "--configurar"
  FunctionEnd
  !define MUI_FINISHPAGE_TITLE "Capri está instalada. Hagámosla tuya."
  !define MUI_FINISHPAGE_TEXT "Continúa con la personalización y la comprobación de tu IA. Podrás ver qué falta, elegir un modelo y probar que responde antes de guardar la conexión.$\r$\n$\r$\nTambién puedes usar el personaje y configurar la IA después."
  !define MUI_FINISHPAGE_RUN
  !define MUI_FINISHPAGE_RUN_TEXT "Personalizar Capri y comprobar mi IA"
  !define MUI_FINISHPAGE_RUN_FUNCTION "CapriConfigure"
  !insertmacro MUI_PAGE_FINISH
!macroend
