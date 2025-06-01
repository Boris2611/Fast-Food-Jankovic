package com.jankovic.fastfood.dto;

import java.util.List;

public class OrderRequestDTO {
    private List<Item> items;

    public static class Item {
        private Long menuItemId;
        private Integer quantity;

        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
