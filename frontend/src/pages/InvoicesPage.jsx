import { useEffect, useMemo, useState } from "react";
import { api, money, queryString, toNumberPayload } from "../api";

const emptyForm = {
  roomId: "",
  tenantId: "",
  month: "",
  roomPrice: "",
  waterPrice: "",
  electricityPrice: "",
  servicePrice: "",
};

export default function InvoicesPage({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [payForm, setPayForm] = useState({ invoice: null, amount: "", note: "" });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isTenant = user?.role === "TENANT";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setError("");
    try {
      const invoiceData = await api(`/api/search/invoices${queryString({
        keyword,
        status: filter,
        tenantId: isTenant ? user?.tenantId : null,
      })}`);

      setInvoices(invoiceData);

      if (!isTenant) {
        const [roomData, tenantData] = await Promise.all([api("/rooms"), api("/tenants")]);
        setRooms(roomData);
        setTenants(tenantData);
      }
    } catch (err) {
      setError("Khong the tai du lieu hoa don.");
    }
  }

  async function saveInvoice(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api("/invoices", {
        method: "POST",
        body: JSON.stringify(
          toNumberPayload(form, [
            "roomId",
            "tenantId",
            "roomPrice",
            "waterPrice",
            "electricityPrice",
            "servicePrice",
          ])
        ),
      });
      setForm(emptyForm);
      setMessage("Da tao hoa don.");
      loadData();
    } catch (err) {
      setError("Khong the tao hoa don. Phong va nguoi thue phai khop nhau.");
    }
  }

  async function payInvoice(event) {
    event.preventDefault();
    if (!payForm.invoice) return;

    try {
      await api(`/invoices/${payForm.invoice.id}/pay`, {
        method: "PUT",
        body: JSON.stringify({ amount: Number(payForm.amount), note: payForm.note }),
      });
      setPayForm({ invoice: null, amount: "", note: "" });
      setMessage("Da thanh toan hoa don.");
      loadData();
    } catch (err) {
      setError("Khong the thanh toan hoa don.");
    }
  }

  const visibleInvoices = useMemo(() => {
    if (filter === "ALL") return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  }, [invoices, filter]);

  return (
    <div className={isTenant ? "page-stack" : "content-grid"}>
      {!isTenant && (
        <section className="panel form-panel">
          <div className="panel-heading"><h2>Tao hoa don</h2></div>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}

          <form className="data-form" onSubmit={saveInvoice}>
            <label>
              Phong
              <select value={form.roomId} onChange={(event) => setForm({ ...form, roomId: event.target.value })} required>
                <option value="">Chon phong</option>
                {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
              </select>
            </label>
            <label>
              Nguoi thue
              <select value={form.tenantId} onChange={(event) => setForm({ ...form, tenantId: event.target.value })} required>
                <option value="">Chon nguoi thue</option>
                {tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.fullName} - {tenant.room?.name}</option>)}
              </select>
            </label>
            <label>Thang<input placeholder="05/2026" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} required /></label>
            <label>Tien phong<input type="number" value={form.roomPrice} onChange={(event) => setForm({ ...form, roomPrice: event.target.value })} required /></label>
            <label>Tien nuoc<input type="number" value={form.waterPrice} onChange={(event) => setForm({ ...form, waterPrice: event.target.value })} required /></label>
            <label>Tien dien<input type="number" value={form.electricityPrice} onChange={(event) => setForm({ ...form, electricityPrice: event.target.value })} required /></label>
            <label>Phi dich vu<input type="number" value={form.servicePrice} onChange={(event) => setForm({ ...form, servicePrice: event.target.value })} required /></label>
            <button className="primary-button">Tao hoa don</button>
          </form>

          {payForm.invoice && (
            <form className="pay-box" onSubmit={payInvoice}>
              <h3>Thanh toan {payForm.invoice.month}</h3>
              <label>So tien<input type="number" value={payForm.amount} onChange={(event) => setPayForm({ ...payForm, amount: event.target.value })} required /></label>
              <label>Ghi chu<input value={payForm.note} onChange={(event) => setPayForm({ ...payForm, note: event.target.value })} /></label>
              <div className="form-actions">
                <button className="primary-button">Xac nhan</button>
                <button type="button" className="ghost-button" onClick={() => setPayForm({ invoice: null, amount: "", note: "" })}>Huy</button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="panel">
        {isTenant && error && <div className="alert error">{error}</div>}
        {isTenant && message && <div className="alert success">{message}</div>}
        <div className="panel-heading">
          <h2>{isTenant ? "Hoa don cua toi" : "Danh sach hoa don"}</h2>
          <select className="compact-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="ALL">Tat ca</option>
            <option value="UNPAID">Chua thanh toan</option>
            <option value="PAID">Da thanh toan</option>
          </select>
        </div>
        <div className="toolbar">
          <input placeholder="Tim theo thang, phong, nguoi thue" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <button className="primary-button" onClick={loadData}>Tim kiem</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Thang</th><th>Phong</th><th>Nguoi thue</th><th>Tong</th><th>Trang thai</th><th>Hanh dong</th></tr></thead>
            <tbody>
              {visibleInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.month}</td>
                  <td>{invoice.roomName || invoice.room?.name}</td>
                  <td>{invoice.tenantName || invoice.tenant?.fullName}</td>
                  <td>{money(invoice.totalAmount)}</td>
                  <td><span className={`badge ${invoice.status?.toLowerCase()}`}>{invoice.status}</span></td>
                  <td className="actions">
                    <button className="small-button" onClick={() => setSelectedInvoice(invoice)}>Chi tiet</button>
                    {!isTenant && invoice.status === "UNPAID" && (
                      <button className="small-button" onClick={() => setPayForm({ invoice, amount: invoice.totalAmount, note: "" })}>Thanh toan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedInvoice && (
          <div className="detail-box wide">
            <h3>Object Information</h3>
            <p><strong>Month:</strong> {selectedInvoice.month}</p>
            <p><strong>Room:</strong> {selectedInvoice.roomName || selectedInvoice.room?.name}</p>
            <p><strong>Tenant:</strong> {selectedInvoice.tenantName || selectedInvoice.tenant?.fullName}</p>
            <p><strong>Total:</strong> {money(selectedInvoice.totalAmount)}</p>
            <p><strong>Status:</strong> {selectedInvoice.status}</p>
          </div>
        )}
      </section>
    </div>
  );
}
