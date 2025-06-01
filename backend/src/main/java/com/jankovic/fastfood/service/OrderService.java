package com.jankovic.fastfood.service;

import com.jankovic.fastfood.dto.OrderResponseDTO;
import com.jankovic.fastfood.entity.Order;
import com.jankovic.fastfood.entity.OrderItem;
import com.jankovic.fastfood.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Ostale metode...

    private OrderResponseDTO mapToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setEstimatedReady(order.getEstimatedReady());
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::mapOrderItemToDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private OrderResponseDTO.OrderItemResponseDTO mapOrderItemToDTO(OrderItem orderItem) {
        OrderResponseDTO.OrderItemResponseDTO itemDTO = new OrderResponseDTO.OrderItemResponseDTO();
        itemDTO.setId(orderItem.getId());
        itemDTO.setQuantity(orderItem.getQuantity());

        if (orderItem.getMenuItem() != null) {
            itemDTO.setNaziv(orderItem.getMenuItem().getNaziv());
            itemDTO.setCena(orderItem.getMenuItem().getCena());       // Dodaj cenu
            itemDTO.setSlikaPath(orderItem.getMenuItem().getSlikaPath()); // Dodaj putanju slike
        } else {
            itemDTO.setNaziv("Nepoznat proizvod");
            itemDTO.setCena(null);
            itemDTO.setSlikaPath(null);
        }

        return itemDTO;
    }

    public List<OrderResponseDTO> findDTOByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
