import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-lg font-bold">Cliente Dashboard</h1>
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="focus:outline-none">
          ☰ Menú
        </button>
        {open && (
          <ul className="absolute right-0 mt-2 bg-white text-black w-48 rounded shadow z-50">
            <li className="border-b">
              <Link to="/cliente/perfil" className="block px-4 py-2 hover:bg-gray-100">Ver Perfil</Link>
            </li>
            <li className="border-b">
              <Link to="/cliente/editar" className="block px-4 py-2 hover:bg-gray-100">Editar Perfil</Link>
            </li>
            <li className="border-b">
              <Link to="/cliente/ubicacion" className="block px-4 py-2 hover:bg-gray-100">Ubicación</Link>
            </li>
            <li className="border-b">
              <Link to="/cliente/repartidores" className="block px-4 py-2 hover:bg-gray-100">Buscar Repartidor</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
