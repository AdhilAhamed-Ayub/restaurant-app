package com.restaurant.backend.controller;

import com.restaurant.backend.dto.OrderItemRequest;
import com.restaurant.backend.dto.OrderRequest;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.Order;
import com.restaurant.backend.model.OrderItem;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Place a new order
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderType(orderRequest.getOrderType() != null ? orderRequest.getOrderType() : "DINE_IN");
        order.setTableNumber(orderRequest.getTableNumber());
        order.setStatus("PREPARING");
        
        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest reqItem : orderRequest.getItems()) {
            Optional<MenuItem> menuItemOpt = menuItemRepository.findById(reqItem.getMenuItemId());
            if (menuItemOpt.isPresent()) {
                MenuItem menuItem = menuItemOpt.get();
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setMenuItem(menuItem);
                orderItem.setQuantity(reqItem.getQuantity());
                orderItem.setPrice(menuItem.getPrice()); // Price at transaction time
                
                totalAmount += (menuItem.getPrice() * reqItem.getQuantity());
                orderItems.add(orderItem);
            }
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Get all orders (for Admin Dashboard later)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
