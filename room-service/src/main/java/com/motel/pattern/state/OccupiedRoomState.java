package com.motel.pattern.state;

import com.motel.domain.Room;
import com.motel.domain.RoomStatus;

public class OccupiedRoomState implements RoomState {
    @Override
    public RoomStatus status() {
        return RoomStatus.OCCUPIED;
    }

    @Override
    public boolean canAssignTenant() {
        return true;
    }

    @Override
    public void apply(Room room) {
        room.setStatus(status());
        room.setOccupied(true);
    }
}
