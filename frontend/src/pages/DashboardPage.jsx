import { useEffect, useState } from "react";
import { api, money } from "../api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setError("");
    try {
      setDashboard(await api("/dashboard"));
    } catch (err) {
      setError("Unable to load dashboard data.");
    }
  }

  return (
    <div className="page-stack">
      {error && <div className="alert error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card blue"><span>Total rooms</span><strong>{dashboard?.totalRooms || 0}</strong></article>
        <article className="stat-card green"><span>Available rooms</span><strong>{dashboard?.availableRooms || 0}</strong></article>
        <article className="stat-card amber"><span>Occupied rooms</span><strong>{dashboard?.occupiedRooms || 0}</strong></article>
        <article className="stat-card red"><span>Revenue</span><strong>{money(dashboard?.totalRevenue)}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Unpaid invoices</h2>
          <button className="ghost-button" onClick={loadDashboard}>Refresh</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Month</th><th>Room</th><th>Tenant</th><th>Total amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {(dashboard?.unpaidInvoices || []).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.month}</td>
                  <td>{invoice.roomName || invoice.room?.name}</td>
                  <td>{invoice.tenantName || invoice.tenant?.fullName}</td>
                  <td>{money(invoice.totalAmount)}</td>
                  <td><span className="badge unpaid">Unpaid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
