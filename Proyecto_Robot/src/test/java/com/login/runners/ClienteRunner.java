//RF: CP_RF01,02,03,04,06,10-19
package com.login.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
    features = "src/test/resources/features/cliente.feature",
    glue = "com.login.stepdefinitions",
    snippets = CucumberOptions.SnippetType.CAMELCASE
)
public class ClienteRunner {
}