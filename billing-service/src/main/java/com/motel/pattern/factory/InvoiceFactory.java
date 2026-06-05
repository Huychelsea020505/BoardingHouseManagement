package com.motel.pattern.factory;

import com.motel.domain.Invoice;
import com.motel.dto.CreateInvoiceRequest;
import com.motel.grpc.RoomResponse;
import com.motel.pattern.builder.InvoiceBuilder;
import jakarta.inject.Singleton;
import java.math.BigDecimal;

@Singleton
public class InvoiceFactory {
    public Invoice createMonthlyInvoice(CreateInvoiceRequest request, RoomResponse room) {
        return new InvoiceBuilder()
                .room(room.getId(), room.getRoomNumber(), BigDecimal.valueOf(room.getPrice()))
                .tenant(request.getTenantId(), room.getTenantName())
                .month(request.getMonth())
                .charges(request.getWaterPrice(), request.getElectricityPrice(), request.getServicePrice())
                .unpaid()
                .build();
    }
}
