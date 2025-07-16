package com.fxvibe.apigateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;



@RestController
public class MockUserController {

    @Value("#{'${app.config.tradable-currency-pairs}'.split(',')}")
    private List<String> tradableCurrencyPairs;

    // Updated client list with a third client
    private final List<User> clients = List.of(
            new User("acme_corp", "ACME Corporation"),
            new User("oceanic_air", "Oceanic Airlines"),
            new User("cyberdyne", "Cyberdyne Systems")
    );

    // Updated trader list with the new Trader record and client mappings
    private final List<Trader> traders = List.of(
            new Trader("trader_john", "John Smith", List.of("acme_corp", "oceanic_air")),
            new Trader("trader_jane", "Jane Doe", List.of("cyberdyne"))
    );

    @GetMapping("/api/users/clients")
    public List<User> getClients() {
        return clients;
    }

    // This endpoint now returns the richer Trader object
    @GetMapping("/api/users/traders")
    public List<Trader> getTraders() {
        return traders;
    }

    @GetMapping("/api/config/currency-pairs")
    public List<String> getCurrencyPairs() {
        return tradableCurrencyPairs;
    }
}