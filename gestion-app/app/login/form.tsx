//gestion-app\app\login\form.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Form() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar el error

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMessage(null); // Limpiar mensaje de error antes de intentar el login

    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    console.log({ response });

    if (!response?.error) {
      router.push('/inicio');
      router.refresh();
    } else {
      // Si hay un error, lo guardamos en el estado
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-4 w-full max-w-md p-6 bg-white bg-opacity-80 rounded-lg shadow-lg z-10"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>

        {/* Mostrar mensaje de error si existe */}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <label htmlFor="email" className="flex flex-col">
          <span className="text-sm font-medium mb-1">Email</span>
          <input
            id="email"
            name="email"
            className="border border-gray-300 rounded px-3 py-2 text-black"
            type="email"
            required
            placeholder="Ingresar email"
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
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
