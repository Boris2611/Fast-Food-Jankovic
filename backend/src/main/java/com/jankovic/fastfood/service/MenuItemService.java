package com.jankovic.fastfood.service;

import com.jankovic.fastfood.entity.MenuItem;
import com.jankovic.fastfood.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    public MenuItem save(MenuItem item) {
        return menuItemRepository.save(item);
    }

    public MenuItem findById(Long id) {
        return menuItemRepository.findById(id).orElse(null);
    }

    public boolean deleteById(Long id) {
        if (menuItemRepository.existsById(id)) {
            menuItemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
