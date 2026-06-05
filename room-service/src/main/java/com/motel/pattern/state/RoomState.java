package com.motel.pattern.state;

import com.motel.domain.Room;
import com.motel.domain.RoomStatus;

public interface RoomState {
    RoomStatus status();

    boolean canAssignTenant();

    void apply(Room room);
}
