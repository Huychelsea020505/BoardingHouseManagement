package com.motel.pattern.state;

import com.motel.domain.Room;
import com.motel.domain.RoomStatus;

public class MaintenanceRoomState implements RoomState {
    @Override
    public RoomStatus status() {
        return RoomStatus.MAINTENANCE;
    }

    @Override
    public boolean canAssignTenant() {
        return false;
    }

    @Override
    public void apply(Room room) {
        room.setStatus(status());
        room.setOccupied(false);
    }
}
