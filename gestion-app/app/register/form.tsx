'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter

export default function Form() {
  const router = useRouter(); // Inicializar el enrutador

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'), // Agregar el rol al cuerpo de la solicitud
      }),
    });

    if (response.ok) {
      // Si el registro fue exitoso, redirigir a la página de inicio de sesión
      router.push('/login'); // Asegúrate de que esta ruta corresponda a tu página de login
    } else {
      // Manejar errores de registro si es necesario
      console.error('Error al registrar:', response.statusText);
    }
  };

  return (
    <div className="login-page flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-4 w-full max-w-md p-6 bg-white bg-opacity-80 rounded-lg shadow-lg z-10"
      >
        <h1 className="text-2xl font-bold mb-4">Registrarse</h1>

        <label htmlFor="email" className="flex flex-col">
          <span className="text-sm font-medium mb-1">Email</span>
          <input
            id="email"
            name="email"
            className="border border-gray-300 rounded px-3 py-2 text-black"
            type="email"
            required
            placeholder="Ingresar Email"
          />
        </label>

        <label htmlFor="password" className="flex flex-col">
          <span className="text-sm font-medium mb-1">Contraseña</span>
          <input
            id="password"
            name="password"
            className="border border-gray-300 rounded px-3 py-2 text-black"
            type="password"
            required
            placeholder="Ingresar contraseña"
          />
        </label>

        <label htmlFor="role" className="flex flex-col">
          <span className="text-sm font-medium mb-1">Rol</span>
          <select
            id="role"
            name="role"
            className="border border-gray-300 rounded px-3 py-2 text-black"
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="admin">Admin</option>
            <option value="general">General</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
