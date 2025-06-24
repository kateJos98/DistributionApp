import React, { useState } from 'react';
import { registerCustomer } from '../services/customerService';
import { useNavigate } from 'react-router-dom';

const RegisterCustomer = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = 'El nombre de usuario es requerido.';
    if (!form.email.includes('@')) newErrors.email = 'Email no válido.';
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres.';
    if (!form.full_name.trim()) newErrors.full_name = 'Nombre completo requerido.';
    if (!/^\d{7,}$/.test(form.phone)) newErrors.phone = 'Teléfono inválido.';
    if (!form.city.trim()) newErrors.city = 'Ciudad requerida.';
    if (!form.address.trim()) newErrors.address = 'Dirección requerida.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); //clean writing error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await registerCustomer(form);
      setMessage(res.message || 'Cliente registrado correctamente');
    } catch (err) {
      setMessage(err.error || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-200 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Registro de Cliente</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['username', 'email', 'password', 'full_name', 'phone', 'city', 'address'].map((field) => (
            <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                placeholder={getPlaceholder(field)}
                value={form[field]}
                onChange={handleChange}
                className="input w-full p-2 border rounded"
              />
              {errors[field] && (
                <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Registrar
        </button>

        {message && (
            <p className="mt-4 text-center text-sm text-green-700 font-semibold">
            {message}
            </p>
        )}
        <div className="mt-6 w-full max-w-xl flex justify-end">
            <button
                onClick={() => navigate('/')}
                className="text-sm text-blue-600 hover:text-blue-800 underline transition"
            >
                ¿Ya tienes cuenta? Ir al login
            </button>
        </div>

      </form>
    </div>
  );
};

const getPlaceholder = (field) => {
  const labels = {
    username: 'Usuario',
    email: 'Correo',
    password: 'Contraseña',
    full_name: 'Nombre completo',
    phone: 'Teléfono',
    city: 'Ciudad',
    address: 'Dirección',
  };
  return labels[field];
};

export default RegisterCustomer;