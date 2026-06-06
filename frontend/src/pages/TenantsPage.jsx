import { useEffect, useState } from "react";
import { api, queryString, toNumberPayload } from "../api";

const emptyForm = { citizenId: "", fullName: "", birthDate: "", moveInDate: "", roomId: "" };

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setError("");
    try {
      const [tenantData, roomData] = await Promise.all([api(`/api/search/tenants${queryString({ keyword })}`), api("/rooms")]);
      setTenants(tenantData);
      setRooms(roomData);
    } catch (err) {
      setError("Unable to load tenants.");
    }
  }

  function editTenant(tenant) {
    setSelectedTenant(tenant);
    setEditingId(tenant.id);
    setForm({
      citizenId: tenant.citizenId,
      fullName: tenant.fullName,
      birthDate: tenant.birthDate,
      moveInDate: tenant.moveInDate,
      roomId: tenant.room?.id || "",
    });
  }

  async function saveTenant(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = toNumberPayload(form, ["roomId"]);
      if (editingId) {
        await api(`/tenants/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Tenant updated.");
      } else {
        await api("/tenants", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Tenant created.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError("Unable to save tenant. Check the citizen ID or room status.");
    }
  }

  async function deleteTenant(id) {
    if (!confirm("Are you sure you want to delete this tenant?")) return;
    try {
      await api(`/tenants/${id}`, { method: "DELETE" });
      setMessage("Tenant deleted.");
      loadData();
    } catch (err) {
      setError("Unable to delete a tenant with unpaid invoices.");
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><h2>{editingId ? "Edit tenant" : "Add tenant"}</h2></div>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        <form className="data-form" onSubmit={saveTenant}>
          <label>Citizen ID<input value={form.citizenId} maxLength="12" onChange={(event) => setForm({ ...form, citizenId: event.target.value })} required /></label>
          <label>Full name<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
          <label>Birth date<input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} required /></label>
          <label>Move-in date<input type="date" value={form.moveInDate} onChange={(event) => setForm({ ...form, moveInDate: event.target.value })} required /></label>
          <label>
            Room
            <select value={form.roomId} onChange={(event) => setForm({ ...form, roomId: event.target.value })} required>
              <option value="">Select a room</option>
              {rooms.map((room) => <option key={room.id} value={room.id}>{room.name} - {room.status}</option>)}
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-button">{editingId ? "Update" : "Add tenant"}</button>
            <button type="button" className="ghost-button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
        {selectedTenant && (
          <div className="detail-box">
            <h3>Tenant details</h3>
            <p><strong>Citizen ID:</strong> {selectedTenant.citizenId}</p>
            <p><strong>Full name:</strong> {selectedTenant.fullName}</p>
            <p><strong>Birth date:</strong> {selectedTenant.birthDate}</p>
            <p><strong>Move-in date:</strong> {selectedTenant.moveInDate}</p>
            <p><strong>Room:</strong> {selectedTenant.room?.name || "None"}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Tenant list</h2><button className="ghost-button" onClick={loadData}>Refresh</button></div>
        <div className="toolbar">
          <input placeholder="Search tenants, citizen ID, or room" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <button className="primary-button" onClick={loadData}>Search</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Citizen ID</th><th>Full name</th><th>Birth date</th><th>Move-in date</th><th>Room</th><th>Actions</th></tr></thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>{tenant.citizenId}</td>
                  <td>{tenant.fullName}</td>
                  <td>{tenant.birthDate}</td>
                  <td>{tenant.moveInDate}</td>
                  <td>{tenant.room?.name}</td>
                  <td className="actions">
                    <button className="small-button" onClick={() => setSelectedTenant(tenant)}>Details</button>
                    <button className="small-button" onClick={() => editTenant(tenant)}>Edit</button>
                    <button className="small-button danger" onClick={() => deleteTenant(tenant.id)}>Delete</button>
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
