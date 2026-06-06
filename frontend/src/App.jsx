import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import TenantsPage from "./pages/TenantsPage.jsx";
import InvoicesPage from "./pages/InvoicesPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

const menuItems = [
  { key: "dashboard", label: "Dashboard", title: "Dashboard", roles: ["ADMIN"] },
  { key: "rooms", label: "Rooms", title: "Room Management", roles: ["ADMIN"] },
  { key: "tenants", label: "Tenants", title: "Tenant Management", roles: ["ADMIN"] },
  { key: "users", label: "Users", title: "User Management", roles: ["ADMIN"] },
  { key: "invoices", label: "Invoices", title: "Invoices", roles: ["ADMIN", "TENANT"] },
  { key: "payments", label: "Payments", title: "Payment History", roles: ["ADMIN"] },
  { key: "reports", label: "Reports", title: "Reports", roles: ["ADMIN"] },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  function handleLogin(data) {
    setUser(data);
    setActivePage(data.role === "TENANT" ? "invoices" : "dashboard");
  }

  function handleLogout() {
    setUser(null);
    setActivePage("dashboard");
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user.role || "ADMIN"));
  const effectiveActivePage = visibleMenuItems.some((item) => item.key === activePage) ? activePage : visibleMenuItems[0]?.key;
  const currentTitle = visibleMenuItems.find((item) => item.key === effectiveActivePage)?.title || visibleMenuItems[0]?.title;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>3H Motel Manager</strong>
            <span>Boarding house management</span>
          </div>
        </div>

        <nav className="nav-list">
          {visibleMenuItems.map((item) => (
            <button
              key={item.key}
              className={effectiveActivePage === item.key ? "nav-item active" : "nav-item"}
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

        {effectiveActivePage === "dashboard" && <DashboardPage />}
        {effectiveActivePage === "rooms" && <RoomsPage />}
        {effectiveActivePage === "tenants" && <TenantsPage />}
        {effectiveActivePage === "users" && <UsersPage />}
        {effectiveActivePage === "invoices" && <InvoicesPage user={user} />}
        {effectiveActivePage === "payments" && <PaymentsPage />}
        {effectiveActivePage === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}
