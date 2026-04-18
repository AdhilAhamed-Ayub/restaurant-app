package com.restaurant.backend.dto;

import java.util.List;

public class OrderRequest {
    private String orderType; // "DINE_IN" or "TAKEAWAY"
    private String tableNumber; // Optional, for DINE_IN
    private List<OrderItemRequest> items;

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
