package com.motel.pattern.builder;

import com.motel.domain.Invoice;
import com.motel.domain.InvoiceStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InvoiceBuilder {
    private final Invoice invoice = new Invoice();

    public InvoiceBuilder room(Long roomId, String roomName, BigDecimal roomPrice) {
        invoice.setRoomId(roomId);
        invoice.setRoomName(roomName);
        invoice.setRoomPrice(roomPrice);
        return this;
    }

    public InvoiceBuilder tenant(Long tenantId, String tenantName) {
        invoice.setTenantId(tenantId);
        invoice.setTenantName(tenantName);
        return this;
    }

    public InvoiceBuilder month(String month) {
        invoice.setMonth(month);
        return this;
    }

    public InvoiceBuilder charges(BigDecimal waterPrice, BigDecimal electricityPrice, BigDecimal servicePrice) {
        invoice.setWaterPrice(waterPrice);
        invoice.setElectricityPrice(electricityPrice);
        invoice.setServicePrice(servicePrice);
        invoice.setTotalAmount(invoice.getRoomPrice()
                .add(waterPrice)
                .add(electricityPrice)
                .add(servicePrice));
        return this;
    }

    public InvoiceBuilder unpaid() {
        invoice.setStatus(InvoiceStatus.UNPAID);
        invoice.setCreatedAt(LocalDateTime.now());
        return this;
    }

    public Invoice build() {
        return invoice;
    }
}
