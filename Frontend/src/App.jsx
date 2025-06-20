
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/*<Route path="/admin-dashboard" element={<AdminDashboard />} />
        //<Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/repartidor-dashboard" element={<RepartidorDashboard />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
