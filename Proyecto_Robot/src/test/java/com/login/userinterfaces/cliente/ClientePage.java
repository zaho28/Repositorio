package com.login.userinterfaces.cliente;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class ClientePage {

    public static final Target HEADER = Target.the("header principal")
        .located(By.className("Header-container"));
}
