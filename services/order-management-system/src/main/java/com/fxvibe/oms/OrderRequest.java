package com.fxvibe.oms;

import java.math.BigDecimal;

// Using a record for a concise, immutable DTO
public record OrderRequest(
        String username,
        String currencyPair,
        String direction,
        BigDecimal size,
        BigDecimal price
) {}