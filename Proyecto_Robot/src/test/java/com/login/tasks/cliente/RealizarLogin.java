package com.login.tasks.cliente;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import static net.serenitybdd.screenplay.Tasks.instrumented;

import com.login.userinterfaces.cliente.LoginPage;

public class RealizarLogin implements Task {
    private final String correo, pass;

    public RealizarLogin(String correo, String pass) {
        this.correo = correo;
        this.pass = pass;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Click.on(LoginPage.BOTON_INICIAR_SESION),
            Enter.theValue(correo).into(LoginPage.INPUT_CORREO),
            Enter.theValue(pass).into(LoginPage.INPUT_PASSWORD),
            Click.on(LoginPage.BOTON_INGRESAR),
            Click.on(LoginPage.BOTON_CERRAR_POPUP_LOGIN)
        );
    }

    public static RealizarLogin conCredenciales(String correo, String pass) {
        return instrumented(RealizarLogin.class, correo, pass);
    }
}