import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const emptyForm = { username: "", password: "", fullName: "", role: "TENANT", tenantId: "" };

const roleLabel = {
  ADMIN: "Administrator",
  TENANT: "Tenant",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const tenantById = useMemo(() => {
    return tenants.reduce((result, tenant) => {
      result[String(tenant.id)] = tenant;
      return result;
    }, {});
  }, [tenants]);

  async function loadData() {
    setError("");
    try {
      const [userData, tenantData] = await Promise.all([api("/api/users"), api("/tenants")]);
      setUsers(userData);
      setTenants(tenantData);
    } catch (err) {
      setError("Unable to load users.");
    }
  }

  function getTenantName(user) {
    if (!user?.tenantId) return "-";
    return user.tenantName || tenantById[String(user.tenantId)]?.fullName || "Tenant not found";
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

    if (form.role === "TENANT" && !form.tenantId) {
      setError("Please select a tenant for tenant accounts.");
      return;
    }

    const payload = {
      ...form,
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      tenantId: form.role === "TENANT" ? Number(form.tenantId) : null,
    };

    try {
      if (editingUser) {
        await api(`/api/users/${editingUser.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("User updated.");
      } else {
        await api("/api/users", { method: "POST", body: JSON.stringify(payload) });
        setMessage("User created.");
      }
      setForm(emptyForm);
      setEditingUser(null);
      loadData();
    } catch (err) {
      setError("Unable to save user. The username may already exist.");
    }
  }

  async function setEnabled(user, enabled) {
    setError("");
    try {
      await api(`/api/users/${user.id}/enabled?enabled=${enabled}`, { method: "PUT" });
      setMessage(enabled ? "User unlocked." : "User locked.");
      loadData();
    } catch (err) {
      setError("Unable to update user status.");
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingUser(null);
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><h2>{editingUser ? "Edit user" : "Add user"}</h2></div>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        <form className="data-form" onSubmit={saveUser}>
          <label>
            Username
            <input value={form.username} disabled={!!editingUser} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              placeholder={editingUser ? "Leave blank to keep the current password" : ""}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required={!editingUser}
            />
          </label>
          <label>
            Full name
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value, tenantId: event.target.value === "TENANT" ? form.tenantId : "" })}>
              <option value="ADMIN">Administrator</option>
              <option value="TENANT">Tenant</option>
            </select>
          </label>
          {form.role === "TENANT" && (
            <label>
              Tenant name
              <select value={form.tenantId} onChange={(event) => setForm({ ...form, tenantId: event.target.value })} required>
                <option value="">Select a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.fullName}{tenant.room?.name ? ` - ${tenant.room.name}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="form-actions">
            <button className="primary-button">{editingUser ? "Update" : "Add user"}</button>
            <button type="button" className="ghost-button" onClick={resetForm}>Cancel</button>
          </div>
        </form>

        {selectedUser && (
          <div className="detail-box">
            <h3>User details</h3>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Full name:</strong> {selectedUser.fullName}</p>
            <p><strong>Role:</strong> {roleLabel[selectedUser.role] || selectedUser.role}</p>
            <p><strong>Tenant name:</strong> {getTenantName(selectedUser)}</p>
            <p><strong>Status:</strong> {selectedUser.enabled ? "Active" : "Locked"}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>User list</h2><button className="ghost-button" onClick={loadData}>Refresh</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Username</th><th>Full name</th><th>Role</th><th>Tenant name</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td><span className="badge">{roleLabel[user.role] || user.role}</span></td>
                  <td>{getTenantName(user)}</td>
                  <td>{user.enabled ? "Active" : "Locked"}</td>
                  <td className="actions">
                    <button className="small-button" onClick={() => setSelectedUser(user)}>Details</button>
                    <button className="small-button" onClick={() => editUser(user)}>Edit</button>
                    <button className="small-button danger" onClick={() => setEnabled(user, !user.enabled)}>
                      {user.enabled ? "Lock" : "Unlock"}
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
