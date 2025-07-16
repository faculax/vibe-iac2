package com.fxvibe.oms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private TradeOrderRepository orderRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    public TradeOrder createOrder(OrderRequest request) {
        TradeOrder order = new TradeOrder();
        order.setUsername(request.username());
        order.setCurrencyPair(request.currencyPair());
        order.setDirection(request.direction());
        order.setSize(request.size());
        order.setPrice(request.price());
        order.setStatus("NEW");
        order.setTimestamp(Instant.now());

        TradeOrder savedOrder = orderRepository.save(order);
        kafkaProducerService.sendOrder(savedOrder);
        return savedOrder;
    }

    public List<TradeOrder> getOrdersForUser(String username) {
        return orderRepository.findByUsernameOrderByTimestampDesc(username);
    }

    // Modify this method to handle filtering
    public List<TradeOrder> getAllOrders(List<String> clients) {
        if (clients == null || clients.isEmpty()) {
            return orderRepository.findAll();
        } else {
            return orderRepository.findByUsernameInOrderByTimestampDesc(clients);
        }
    }
}