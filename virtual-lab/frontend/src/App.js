import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import ProtectedRoute from "./components/Protectedroute.js";

// Lab Pages
import Labs from "./pages/Labs";
import DSALab from "./pages/DSALab.jsx";
import DTSPLab from "./pages/DTSPLab.jsx";
import DBMSLab from "./pages/DBMSLab.jsx";
import DVLSILab from "./pages/DVLSILab.jsx";
import ExperimentRunner from "./pages/ExperimentRunner";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} /> {/* Home page loads first */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/labs" element={<Labs />} />

        {/* 🧪 Lab Routes */}
        <Route path="/dsa" element={<DSALab />} />
        <Route path="/dtsp" element={<DTSPLab />} />
        <Route path="/dbms" element={<DBMSLab />} />
        <Route path="/dvlsi" element={<DVLSILab />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🧩 Lab Pages (Protected) */}
        <Route
          path="/labs/dsa"
          element={
            <ProtectedRoute>
              <DSALab />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labs/dtsp"
          element={
            <ProtectedRoute>
              <DTSPLab />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labs/dbms"
          element={
            <ProtectedRoute>
              <DBMSLab />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labs/dvlsi"
          element={
            <ProtectedRoute>
              <DVLSILab />
            </ProtectedRoute>
          }
        />

        {/* 🧪 Individual experiment runner (e.g. /dsa/1) */}
        <Route path="/:lab/:id" element={<ExperimentRunner />} />

        {/* 🚫 Fallback Route (optional) */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
