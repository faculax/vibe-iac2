package com.fxvibe.oms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaProducerService {

    public static final String ORDERS_TOPIC = "fx-orders";

    @Autowired
    private KafkaTemplate<String, TradeOrder> kafkaTemplate;

    public void sendOrder(TradeOrder order) {
        log.info("Published order {} to kafka topic {}", order.getId(), ORDERS_TOPIC);
        kafkaTemplate.send(ORDERS_TOPIC, order.getId().toString(), order);
    }
}