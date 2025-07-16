package com.fxvibe.apigateway;

import java.util.List;

public record Trader(String username, String name, List<String> clientUsernames) {}