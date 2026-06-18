# language: es
Característica: Autenticación en Gurama Online

  Escenario: CP_RF02_IniciarSesion - Cliente inicia sesión exitosamente
    Dado el usuario abre la pagina
    Cuando el cliente inicia sesion con sus credenciales
    Entonces valida resultado "http://localhost:5173/cliente"