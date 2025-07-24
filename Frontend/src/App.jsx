import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterCustomer from "./pages/RegisterCustomer";
import SelectRegister from "./pages/SelectRegister";
import PrivateRoute from "./router/PrivateRoute";
import ClienteDashboard from "./pages/dashboard/cliente/ClienteDashboard";
import PerfilCliente from "./pages/dashboard/cliente/views/PerfilCliente";
import EditarPerfil from "./pages/dashboard/cliente/views/EditarPerfil";
import UbicacionCliente from "./pages/dashboard/cliente/views/UbicacionCliente";
import BuscarRepartidor from "./pages/dashboard/cliente/views/BuscarRepartidor";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard"; // Asegúrate de tenerlo

function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/SelectRegister" element={<SelectRegister />} />

        {/* Protegidas por rol */}
        <Route element={<PrivateRoute expectedRole="admin" />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<PrivateRoute expectedRole="cliente" />}>
          <Route path="/dashboard/cliente" element={<ClienteDashboard />}>
            <Route index element={<PerfilCliente />} />
            <Route path="perfil" element={<PerfilCliente />} />
            <Route path="editar" element={<EditarPerfil />} />
            <Route path="ubicacion" element={<UbicacionCliente />} />
            <Route path="repartidores" element={<BuscarRepartidor />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
