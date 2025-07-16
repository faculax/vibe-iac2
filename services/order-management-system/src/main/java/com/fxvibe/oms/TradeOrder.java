package com.fxvibe.oms;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "trade_orders")
@Data
@NoArgsConstructor
public class TradeOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String currencyPair;
    private String direction; // "BUY" or "SELL"
    private BigDecimal size;
    private BigDecimal price;
    private String status; // e.g., "NEW", "FILLED", "REJECTED"
    private Instant timestamp;
}