import { useEffect, useState } from "react";
import { api, money } from "../api";

const statusLabel = {
  UNPAID: "Unpaid",
  PAID: "Paid",
};

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setError("");
    try {
      const data = await api("/api/reports/summary");
      setReport(data);
    } catch (err) {
      setError("Unable to load reports.");
    }
  }

  const totalRooms = report?.totalRooms || 0;
  const occupiedPercent = totalRooms ? Math.round(((report?.occupiedRooms || 0) / totalRooms) * 100) : 0;
  const availablePercent = totalRooms ? Math.round(((report?.availableRooms || 0) / totalRooms) * 100) : 0;

  return (
    <div className="page-stack">
      {error && <div className="alert error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card blue"><span>Total rooms</span><strong>{totalRooms}</strong></article>
        <article className="stat-card green"><span>Available rooms</span><strong>{report?.availableRooms || 0}</strong></article>
        <article className="stat-card amber"><span>Occupied rooms</span><strong>{report?.occupiedRooms || 0}</strong></article>
        <article className="stat-card red"><span>Revenue</span><strong>{money(report?.totalRevenue)}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Occupancy rate</h2>
          <button className="ghost-button" onClick={loadReport}>Refresh</button>
        </div>
        <div className="report-bars">
          <div>
            <div className="bar-label"><span>Occupied</span><strong>{occupiedPercent}%</strong></div>
            <div className="bar-track"><span style={{ width: `${occupiedPercent}%` }} /></div>
          </div>
          <div>
            <div className="bar-label"><span>Available</span><strong>{availablePercent}%</strong></div>
            <div className="bar-track green"><span style={{ width: `${availablePercent}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Unpaid invoices from the report API</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Room</th><th>Tenant</th><th>Total amount</th><th>Status</th></tr></thead>
            <tbody>
              {(report?.recentUnpaidInvoices || []).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.month}</td>
                  <td>{invoice.roomName}</td>
                  <td>{invoice.tenantName}</td>
                  <td>{money(invoice.totalAmount)}</td>
                  <td><span className="badge unpaid">{statusLabel[invoice.status] || invoice.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
