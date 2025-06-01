package com.jankovic.fastfood.controller;

import com.jankovic.fastfood.entity.MenuItem;
import com.jankovic.fastfood.service.MenuItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItem> addMenuItem(
            @RequestParam("naziv") String naziv,
            @RequestParam("opis") String opis,
            @RequestParam("kategorija") String kategorija,
            @RequestParam("cena") BigDecimal cena,
            @RequestParam("dostupno") boolean dostupno,
            @RequestParam(value = "slika", required = false) MultipartFile slika
    ) {
        try {
            String slikaPath = saveImage(slika);
            MenuItem menuItem = new MenuItem();
            menuItem.setNaziv(naziv);
            menuItem.setOpis(opis);
            menuItem.setKategorija(kategorija);
            menuItem.setCena(cena);
            menuItem.setDostupno(dostupno);
            menuItem.setSlikaPath(slikaPath);
            return new ResponseEntity<>(menuItemService.save(menuItem), HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id,
            @RequestParam("naziv") String naziv,
            @RequestParam("opis") String opis,
            @RequestParam("kategorija") String kategorija,
            @RequestParam("cena") BigDecimal cena,
            @RequestParam("dostupno") boolean dostupno,
            @RequestParam(value = "slika", required = false) MultipartFile slika
    ) {
        try {
            MenuItem existing = menuItemService.findById(id);
            if (existing == null) return ResponseEntity.notFound().build();
            String slikaPath = existing.getSlikaPath();
            if (slika != null && !slika.isEmpty()) {
                slikaPath = saveImage(slika);
            }
            existing.setNaziv(naziv);
            existing.setOpis(opis);
            existing.setKategorija(kategorija);
            existing.setCena(cena);
            existing.setDostupno(dostupno);
            existing.setSlikaPath(slikaPath);
            return ResponseEntity.ok(menuItemService.save(existing));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        return menuItemService.deleteById(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private String saveImage(MultipartFile slika) throws IOException {
        if (slika == null || slika.isEmpty()) return null;
        String fileName = UUID.randomUUID() + "_" + slika.getOriginalFilename().replaceAll("\\s+", "_");
        Path uploadDir = Paths.get("uploads/images").toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(fileName);
        slika.transferTo(filePath.toFile());
        return "/uploads/images/" + fileName;
    }
}
