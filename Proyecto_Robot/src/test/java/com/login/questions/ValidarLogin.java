package com.login.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;

public class ValidarLogin {
    public static Question<String> esExitoso() {
        return new Question<String>() {
            @Override
            public String answeredBy(Actor actor) {
                return BrowseTheWeb.as(actor).getDriver().getCurrentUrl();
            }
        };
    }
}