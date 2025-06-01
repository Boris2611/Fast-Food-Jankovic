package com.jankovic.fastfood.repository;

import com.jankovic.fastfood.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
