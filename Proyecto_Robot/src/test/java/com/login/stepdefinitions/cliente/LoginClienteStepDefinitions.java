package com.login.stepdefinitions.cliente;

import com.login.config.EnvConfig;
import com.login.tasks.cliente.RealizarLogin;
import com.login.tasks.comunes.AbrirPagina;
import com.login.questions.*;
import io.cucumber.java.Before;
import io.cucumber.java.es.*;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.equalTo;

public class LoginClienteStepDefinitions {

    @Before
    public void prepararEscenario() {
        OnStage.setTheStage(new OnlineCast());
    }

    @Dado("el usuario abre la pagina")
    public void abrirPagina() {
        OnStage.theActorCalled("Robot").wasAbleTo(AbrirPagina.guramaOnline());
    }

    @Cuando("el cliente inicia sesion con sus credenciales")
    public void ingresarDatosCliente() {
        OnStage.theActorInTheSpotlight().attemptsTo(
                RealizarLogin.conCredenciales(
                        EnvConfig.get("CLIENTE_EMAIL"),
                        EnvConfig.get("CLIENTE_PASSWORD")
                )
        );
    }

    @Entonces("valida resultado {string}")
    public void validar(String resultadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
                seeThat(ValidarLogin.esExitoso(), equalTo(resultadoEsperado))
        );
    }
}