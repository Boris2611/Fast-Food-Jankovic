package com.jankovic.fastfood.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime estimatedReady;
    private List<OrderItemResponseDTO> orderItems;

    // Getteri i setteri

    public static class OrderItemResponseDTO {
        private Long id;
        private String naziv;
        private Integer quantity;
        private java.math.BigDecimal cena;   // Dodato polje cena
        private String slikaPath;            // Dodato polje slikaPath

        // Getteri i setteri
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNaziv() { return naziv; }
        public void setNaziv(String naziv) { this.naziv = naziv; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public java.math.BigDecimal getCena() { return cena; }
        public void setCena(java.math.BigDecimal cena) { this.cena = cena; }

        public String getSlikaPath() { return slikaPath; }
        public void setSlikaPath(String slikaPath) { this.slikaPath = slikaPath; }
    }

    // Ostali getteri i setteri za OrderResponseDTO
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getEstimatedReady() { return estimatedReady; }
    public void setEstimatedReady(LocalDateTime estimatedReady) { this.estimatedReady = estimatedReady; }

    public List<OrderItemResponseDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemResponseDTO> orderItems) { this.orderItems = orderItems; }
}
