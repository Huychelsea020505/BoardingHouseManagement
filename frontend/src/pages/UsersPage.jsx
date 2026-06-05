import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = { username: "", password: "123456", fullName: "", role: "TENANT", tenantId: "" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setError("");
    try {
      setUsers(await api("/api/users"));
    } catch (err) {
      setError("Khong the tai danh sach user.");
    }
  }

  function editUser(user) {
    setEditingUser(user);
    setSelectedUser(user);
    setForm({
      username: user.username,
      password: "",
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId || "",
    });
  }

  async function saveUser(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      tenantId: form.role === "TENANT" && form.tenantId ? Number(form.tenantId) : null,
    };

    try {
      if (editingUser) {
        await api(`/api/users/${editingUser.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Da cap nhat user.");
      } else {
        await api("/api/users", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Da tao user moi.");
      }
      setForm(emptyForm);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError("Khong the luu user. Username co the da ton tai.");
    }
  }

  async function setEnabled(user, enabled) {
    setError("");
    try {
      await api(`/api/users/${user.id}/enabled?enabled=${enabled}`, { method: "PUT" });
      setMessage(enabled ? "Da mo khoa user." : "Da khoa user.");
      loadUsers();
    } catch (err) {
      setError("Khong the cap nhat trang thai user.");
    }
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><h2>{editingUser ? "Sua user" : "Them user"}</h2></div>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        <form className="data-form" onSubmit={saveUser}>
          <label>Username<input value={form.username} disabled={!!editingUser} onChange={(event) => setForm({ ...form, username: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} placeholder={editingUser ? "De trong neu khong doi" : ""} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <label>Full name<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
          <label>
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="ADMIN">ADMIN</option>
              <option value="TENANT">TENANT</option>
            </select>
          </label>
          {form.role === "TENANT" && (
            <label>Tenant ID<input type="number" value={form.tenantId} onChange={(event) => setForm({ ...form, tenantId: event.target.value })} /></label>
          )}
          <div className="form-actions">
            <button className="primary-button">{editingUser ? "Cap nhat" : "Them user"}</button>
            <button type="button" className="ghost-button" onClick={() => { setForm(emptyForm); setEditingUser(null); }}>Huy</button>
          </div>
        </form>

        {selectedUser && (
          <div className="detail-box">
            <h3>User Information</h3>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Full name:</strong> {selectedUser.fullName}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Tenant ID:</strong> {selectedUser.tenantId || "N/A"}</p>
            <p><strong>Status:</strong> {selectedUser.enabled ? "Enabled" : "Locked"}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Danh sach user</h2><button className="ghost-button" onClick={loadUsers}>Tai lai</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Username</th><th>Full name</th><th>Role</th><th>Tenant ID</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td>{user.tenantId || "-"}</td>
                  <td>{user.enabled ? "Enabled" : "Locked"}</td>
                  <td className="actions">
                    <button className="small-button" onClick={() => setSelectedUser(user)}>Chi tiet</button>
                    <button className="small-button" onClick={() => editUser(user)}>Sua</button>
                    <button className="small-button danger" onClick={() => setEnabled(user, !user.enabled)}>
                      {user.enabled ? "Khoa" : "Mo khoa"}
                    </button>
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
