package com.motel.pattern.state;

import com.motel.domain.Room;
import com.motel.domain.RoomStatus;

public class AvailableRoomState implements RoomState {
    @Override
    public RoomStatus status() {
        return RoomStatus.AVAILABLE;
    }

    @Override
    public boolean canAssignTenant() {
        return true;
    }

    @Override
    public void apply(Room room) {
        room.setStatus(status());
        room.setOccupied(false);
    }
}
