import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const labs = [
    { name: "DSA Lab", path: "/labs/dsa", desc: "Data Structures & Algorithms" },
    { name: "DTSP Lab", path: "/labs/dtsp", desc: "Digital Signal Processing" },
    { name: "DBMS Lab", path: "/labs/dbms", desc: "Database Management Systems" },
    { name: "DVLSI Lab", path: "/labs/dvlsi", desc: "Digital VLSI Design" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* ================= Sidebar ================= */}
      <aside className="dashboard-sidebar">
        <div>
          <h2>Virtual Lab</h2>
          <nav>
            <Link to="/dashboard" className="active">🏠 Dashboard</Link>
            <Link to="/profile">👤 Profile</Link>
            <Link to="/labs/dsa">🧠 DSA Lab</Link>
            <Link to="/labs/dtsp">🎛 DTSP Lab</Link>
            <Link to="/labs/dbms">🗄 DBMS Lab</Link>
            <Link to="/labs/dvlsi">⚙️ DVLSI Lab</Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="logout-link">
          🚪 Logout
        </button>
      </aside>

      {/* ================= Main Section ================= */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Navigation Bar */}
        <header className="dashboard-topnav">
          <h3>Welcome to Virtual Lab</h3>
          <div className="user-profile">
            <img
              src="https://randomuser.me/api/portraits/lego/5.jpg"
              alt="User Avatar"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="dashboard-content">
          {labs.map((lab, index) => (
            <div key={index} className="card">
              <h2>{lab.name}</h2>
              <p>{lab.desc}</p>
              <button
                onClick={() => navigate(lab.path)}
                style={{
                  marginTop: "12px",
                  background:
                    "linear-gradient(90deg, var(--primary), var(--secondary))",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Start Experiment
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
