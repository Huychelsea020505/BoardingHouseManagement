import { useEffect, useState } from "react";
import { api, money } from "../api";

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
      setError("Không thể tải báo cáo.");
    }
  }

  const totalRooms = report?.totalRooms || 0;
  const occupiedPercent = totalRooms ? Math.round(((report?.occupiedRooms || 0) / totalRooms) * 100) : 0;
  const availablePercent = totalRooms ? Math.round(((report?.availableRooms || 0) / totalRooms) * 100) : 0;

  return (
    <div className="page-stack">
      {error && <div className="alert error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card blue"><span>Tong phong</span><strong>{totalRooms}</strong></article>
        <article className="stat-card green"><span>Phong trong</span><strong>{report?.availableRooms || 0}</strong></article>
        <article className="stat-card amber"><span>Dang thue</span><strong>{report?.occupiedRooms || 0}</strong></article>
        <article className="stat-card red"><span>Doanh thu</span><strong>{money(report?.totalRevenue)}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Ti le lap day</h2>
          <button className="ghost-button" onClick={loadReport}>Tai lai</button>
        </div>
        <div className="report-bars">
          <div>
            <div className="bar-label"><span>Dang thue</span><strong>{occupiedPercent}%</strong></div>
            <div className="bar-track"><span style={{ width: `${occupiedPercent}%` }} /></div>
          </div>
          <div>
            <div className="bar-label"><span>Phong trong</span><strong>{availablePercent}%</strong></div>
            <div className="bar-track green"><span style={{ width: `${availablePercent}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Hoa don chua thanh toan tu C# Report API</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Thang</th><th>Phong</th><th>Nguoi thue</th><th>Tong tien</th><th>Trang thai</th></tr></thead>
            <tbody>
              {(report?.recentUnpaidInvoices || []).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.month}</td>
                  <td>{invoice.roomName}</td>
                  <td>{invoice.tenantName}</td>
                  <td>{money(invoice.totalAmount)}</td>
                  <td><span className="badge unpaid">{invoice.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
