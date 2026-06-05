import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import TenantsPage from "./pages/TenantsPage.jsx";
import InvoicesPage from "./pages/InvoicesPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

const menuItems = [
  { key: "dashboard", label: "Dashboard", title: "Tong quan" },
  { key: "rooms", label: "Rooms", title: "Quan ly phong tro" },
  { key: "tenants", label: "Tenants", title: "Quan ly nguoi thue" },
  { key: "invoices", label: "Invoices", title: "Quan ly hoa don" },
  { key: "payments", label: "Payments", title: "Lich su thanh toan" },
  { key: "reports", label: "Reports", title: "Bao cao thong ke" },
];

export default function App() {
  const storedUser = localStorage.getItem("motel_user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [activePage, setActivePage] = useState("dashboard");

  function handleLogin(data) {
    localStorage.setItem("motel_user", JSON.stringify(data));
    setUser(data);
  }

  function handleLogout() {
    localStorage.removeItem("motel_user");
    setUser(null);
    setActivePage("dashboard");
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentTitle = menuItems.find((item) => item.key === activePage)?.title;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>3H Motel Manager</strong>
            <span>Boarding house</span>
          </div>
        </div>

        <nav className="nav-list">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={activePage === item.key ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="kicker">Motel Management System</span>
            <h1>{currentTitle}</h1>
          </div>
          <div className="account">
            <span>{user.fullName || user.username}</span>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "rooms" && <RoomsPage />}
        {activePage === "tenants" && <TenantsPage />}
        {activePage === "invoices" && <InvoicesPage />}
        {activePage === "payments" && <PaymentsPage />}
        {activePage === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}
