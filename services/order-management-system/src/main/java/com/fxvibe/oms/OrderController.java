package com.fxvibe.oms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public TradeOrder createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    // Modify this endpoint to accept a list of clients to filter by
    @GetMapping({"", "/"})
    public List<TradeOrder> getAllOrders(@RequestParam(required = false) List<String> clients) {
        return orderService.getAllOrders(clients);
    }

    @GetMapping("/user/{username}")
    public List<TradeOrder> getOrdersForUser(@PathVariable String username) {
        return orderService.getOrdersForUser(username);
    }
}