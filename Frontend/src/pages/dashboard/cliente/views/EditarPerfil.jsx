import React, { useState } from "react";
import axios from "axios";

const EditarPerfil = () => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8010/update-customer", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Datos actualizados correctamente");
    } catch (err) {
      alert("Error al actualizar: " + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
      {["full_name", "phone", "city", "address"].map((field) => (
        <div key={field} className="mb-3">
          <label className="block capitalize">{field}</label>
          <input
            name={field}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      ))}
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Cambios
      </button>
    </form>
  );
};

export default EditarPerfil;
