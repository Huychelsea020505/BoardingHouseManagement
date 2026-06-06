import { useEffect, useState } from "react";
import { api, money, queryString, toNumberPayload } from "../api";

const emptyForm = { name: "", price: "", area: "", waterPrice: "", status: "AVAILABLE" };

const statusLabel = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    setError("");
    try {
      setRooms(await api(`/api/search/rooms${queryString({ keyword, status: statusFilter })}`));
    } catch (err) {
      setError("Unable to load rooms.");
    }
  }

  function editRoom(room) {
    setSelectedRoom(room);
    setEditingId(room.id);
    setForm({
      name: room.name,
      price: room.price,
      area: room.area,
      waterPrice: room.waterPrice,
      status: room.status,
    });
  }

  async function saveRoom(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = toNumberPayload(form, ["price", "area", "waterPrice"]);
      if (editingId) {
        await api(`/rooms/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Room updated.");
      } else {
        await api("/rooms", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Room created.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadRooms();
    } catch (err) {
      setError("Unable to save room. The room name may already exist.");
    }
  }

  async function deleteRoom(id) {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await api(`/rooms/${id}`, { method: "DELETE" });
      setMessage("Room deleted.");
      loadRooms();
    } catch (err) {
      setError("Unable to delete a room that has tenants.");
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><h2>{editingId ? "Edit room" : "Add room"}</h2></div>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        <form className="data-form" onSubmit={saveRoom}>
          <label>Room name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label>Room price<input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
          <label>Area<input type="number" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} required /></label>
          <label>Water price<input type="number" value={form.waterPrice} onChange={(event) => setForm({ ...form, waterPrice: event.target.value })} required /></label>
          <label>
            Status
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-button">{editingId ? "Update" : "Add room"}</button>
            <button type="button" className="ghost-button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
        {selectedRoom && (
          <div className="detail-box">
            <h3>Room details</h3>
            <p><strong>Room:</strong> {selectedRoom.name}</p>
            <p><strong>Area:</strong> {selectedRoom.area} m2</p>
            <p><strong>Room price:</strong> {money(selectedRoom.price)}</p>
            <p><strong>Water price:</strong> {money(selectedRoom.waterPrice)}</p>
            <p><strong>Status:</strong> {statusLabel[selectedRoom.status] || selectedRoom.status}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Room list</h2><button className="ghost-button" onClick={loadRooms}>Refresh</button></div>
        <div className="toolbar">
          <input placeholder="Search rooms" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
          <button className="primary-button" onClick={loadRooms}>Search</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Room name</th><th>Area</th><th>Room price</th><th>Water price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.area} m2</td>
                  <td>{money(room.price)}</td>
                  <td>{money(room.waterPrice)}</td>
                  <td><span className={`badge ${room.status?.toLowerCase()}`}>{statusLabel[room.status] || room.status}</span></td>
                  <td className="actions">
                    <button className="small-button" onClick={() => setSelectedRoom(room)}>Details</button>
                    <button className="small-button" onClick={() => editRoom(room)}>Edit</button>
                    <button className="small-button danger" onClick={() => deleteRoom(room.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
