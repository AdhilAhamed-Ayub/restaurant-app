package com.restaurant.backend.controller;

import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // Allow React frontend to connect
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Get all menu items
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get only available menu items
    @GetMapping("/available")
    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    // Get a specific menu item by ID
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new menu item
    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // Update an existing menu item
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItemDetails) {
        return menuItemRepository.findById(id)
                .map(existingItem -> {
                    existingItem.setName(menuItemDetails.getName());
                    existingItem.setDescription(menuItemDetails.getDescription());
                    existingItem.setPrice(menuItemDetails.getPrice());
                    existingItem.setCategory(menuItemDetails.getCategory());
                    existingItem.setAvailable(menuItemDetails.getAvailable());
                    existingItem.setImageUrl(menuItemDetails.getImageUrl());
                    return ResponseEntity.ok(menuItemRepository.save(existingItem));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMenuItem(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(existingItem -> {
                    menuItemRepository.delete(existingItem);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
