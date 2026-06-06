import { useEffect, useState } from "react";
import { api, money } from "../api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setError("");
    try {
      setPayments(await api("/payments/history"));
    } catch (err) {
      setError("Unable to load payment history.");
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Payment history</h2>
        <button className="ghost-button" onClick={loadPayments}>Refresh</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Month</th><th>Room</th><th>Tenant</th><th>Amount</th><th>Paid at</th><th>Note</th></tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>#{payment.id}</td>
                <td>{payment.invoice?.month}</td>
                <td>{payment.invoice?.roomName || payment.invoice?.room?.name}</td>
                <td>{payment.invoice?.tenantName || payment.invoice?.tenant?.fullName}</td>
                <td>{money(payment.amount)}</td>
                <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleString("en-US") : ""}</td>
                <td>{payment.note || "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
