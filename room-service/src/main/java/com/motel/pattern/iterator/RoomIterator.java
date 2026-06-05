package com.motel.pattern.iterator;

import com.motel.domain.Room;
import java.util.Iterator;

public class RoomIterator implements Iterator<Room> {
    private final Iterator<Room> delegate;

    public RoomIterator(Iterator<Room> delegate) {
        this.delegate = delegate;
    }

    @Override
    public boolean hasNext() {
        return delegate.hasNext();
    }

    @Override
    public Room next() {
        return delegate.next();
    }
}
