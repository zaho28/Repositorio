package com.login.tasks.comunes;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Open;

import static net.serenitybdd.screenplay.Tasks.instrumented;

import com.login.userinterfaces.cliente.LoginPage;

public class AbrirPagina implements Task {
    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Open.url("http://localhost:5173/"),
            Click.on(LoginPage.BOTON_CERRAR_POPUP)
        );
    }
    public static AbrirPagina guramaOnline() {
        return instrumented(AbrirPagina.class);
    }
}