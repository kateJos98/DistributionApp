import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
// Aquí luego añadiremos las vistas como RegisterClient, Dashboard, etc.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Otras rutas futuras */}
      </Routes>
    </Router>
  );
}

export default App;
