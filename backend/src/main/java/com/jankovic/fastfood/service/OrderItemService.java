package com.jankovic.fastfood.service;

import com.jankovic.fastfood.entity.OrderItem;
import com.jankovic.fastfood.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public List<OrderItem> findAll() {
        return orderItemRepository.findAll();
    }

    public OrderItem save(OrderItem item) {
        return orderItemRepository.save(item);
    }
}
