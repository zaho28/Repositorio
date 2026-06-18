package com.login.userinterfaces.cliente;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class LoginPage {
  public static final Target BOTON_CERRAR_POPUP = Target.the("cerrar popup inicio")
		.located(By.xpath("//*[@id='ventana']/div/span"));

  public static final Target BOTON_INICIAR_SESION = Target.the("iniciar sesión")
		.located(By.xpath("//*[@id='root']/header/div/nav/ul/li[3]/a"));

  public static final Target INPUT_CORREO = Target.the("campo correo")
    .located(By.id("correo"));

  public static final Target INPUT_PASSWORD = Target.the("campo contraseña")
    .located(By.id("contrasena"));

  public static final Target BOTON_INGRESAR = Target.the("botón ingresar")
    .located(By.xpath("//*[@id='root']/main/form/button"));

  public static final Target BOTON_CERRAR_POPUP_LOGIN = Target.the("cerrar popup post-login")
    .located(By.xpath("//*[@id='root']/div/div/span"));
}