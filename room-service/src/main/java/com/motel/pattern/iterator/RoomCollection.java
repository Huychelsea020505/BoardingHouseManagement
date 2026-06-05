package com.motel.pattern.iterator;

import com.motel.domain.Room;
import java.util.Iterator;

public class RoomCollection implements Iterable<Room> {
    private final Iterable<Room> rooms;

    public RoomCollection(Iterable<Room> rooms) {
        this.rooms = rooms;
    }

    @Override
    public Iterator<Room> iterator() {
        return new RoomIterator(rooms.iterator());
    }
}
