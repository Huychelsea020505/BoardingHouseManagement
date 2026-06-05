package com.motel.pattern.state;

import com.motel.domain.RoomStatus;
import jakarta.inject.Singleton;

@Singleton
public class RoomStateFactory {
    private final RoomState available = new AvailableRoomState();
    private final RoomState occupied = new OccupiedRoomState();
    private final RoomState maintenance = new MaintenanceRoomState();

    public RoomState forStatus(RoomStatus status) {
        if (status == RoomStatus.OCCUPIED) {
            return occupied;
        }
        if (status == RoomStatus.MAINTENANCE) {
            return maintenance;
        }
        return available;
    }
}
