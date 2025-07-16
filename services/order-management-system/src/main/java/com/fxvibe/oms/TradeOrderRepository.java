package com.fxvibe.oms;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeOrderRepository extends JpaRepository<TradeOrder, Long> {
    List<TradeOrder> findByUsernameOrderByTimestampDesc(String username);

    List<TradeOrder> findByUsernameInOrderByTimestampDesc(List<String> usernames);
}