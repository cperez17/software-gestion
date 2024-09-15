'use client';

import { FormEvent } from 'react';

export default function Form() {
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
      }),
    });
    console.log({ response });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mx-auto max-w-md mt-10 p-6 border rounded-lg shadow-lg"
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
      <button
        type="submit"
        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
      >
        Register
      </button>
    </form>
  );
}
