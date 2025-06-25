
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterCustomer from './pages/RegisterCustomer';
import SelectRegister from "./pages/SelectRegister";
import PrivateRoute from './router/PrivateRoute';
import ClienteDashboard from "./pages/ClienteDashboard";
import { Roles } from './constants/roles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/SelectRegister" element={<SelectRegister />} />
        {/* Protegidas */}

        <Route element={<PrivateRoute allowedRoles={[Roles.CLIENTE]} />}>
          <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        </Route>
        {/* 
        <Route element={<PrivateRoute allowedRoles={[Roles.REPARTIDOR]} />}>
          <Route path="/repartidor-dashboard" element={<RepartidorDashboard />} />
        </Route> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
