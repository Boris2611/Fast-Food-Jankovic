package com.jankovic.fastfood.controller;

import com.jankovic.fastfood.dto.OrderRequestDTO;
import com.jankovic.fastfood.dto.OrderResponseDTO;
import com.jankovic.fastfood.entity.Order;
import com.jankovic.fastfood.entity.OrderItem;
import com.jankovic.fastfood.entity.OrderStatus;
import com.jankovic.fastfood.entity.User;
import com.jankovic.fastfood.repository.MenuItemRepository;
import com.jankovic.fastfood.repository.OrderRepository;
import com.jankovic.fastfood.repository.UserRepository;
import com.jankovic.fastfood.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.8.139:3000"}, allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MenuItemRepository menuItemRepo;
    @Autowired
    private OrderService orderService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Korisnik ne postoji");

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setStatus(OrderStatus.POSLATA);
        // createdAt se postavlja automatski (@CreationTimestamp)

        order.setEstimatedReady(null);

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderRequestDTO.Item item : dto.getItems()) {
            menuItemRepo.findById(item.getMenuItemId()).ifPresent(menuItem -> {
                OrderItem orderItem = new OrderItem();
                orderItem.setMenuItem(menuItem);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setOrder(order);
                orderItems.add(orderItem);
            });
        }
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepo.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<?> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Korisnik ne postoji");

        Long userId = userOpt.get().getId();
        List<OrderResponseDTO> ordersDTO = orderService.findDTOByUserId(userId);

        return ResponseEntity.ok(ordersDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> all = orderRepo.findAll();
        return ResponseEntity.ok(all);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> payload) {
        Optional<Order> orderOpt = orderRepo.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        String status = payload.get("status");
        String minutesStr = payload.get("minutes");

        if (status != null) {
            try {
                OrderStatus newStatus = OrderStatus.valueOf(status);
                order.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Nepoznat status.");
            }
        }

        if (minutesStr != null && !minutesStr.isBlank()) {
            try {
                int minutes = Integer.parseInt(minutesStr);
                if (minutes > 0) {
                    order.setEstimatedReady(LocalDateTime.now().plusMinutes(minutes));
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Nevalidan broj minuta.");
            }
        }

        return ResponseEntity.ok(orderRepo.save(order));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepo.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        if (order.getStatus() != OrderStatus.ISPORUCENA && order.getStatus() != OrderStatus.OTKAZANA) {
            return ResponseEntity.status(403).body("Narudžbina nije u stanju za brisanje");
        }

        orderRepo.delete(order);
        return ResponseEntity.ok().build();
    }
}
