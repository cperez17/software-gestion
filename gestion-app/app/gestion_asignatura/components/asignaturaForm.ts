'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Asignatura {
  id: number;
  nombre: string;
  creditos: number;
}

export default function GestionAsignaturas() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [nombre, setNombre] = useState('');
  const [creditos, setCreditos] = useState<number>(0);

  // Obtener asignaturas de la base de datos (mock de ejemplo)
  useEffect(() => {
    async function fetchAsignaturas() {
      const response = await fetch('/api/asignaturas'); // Reemplaza por tu API real
      const data = await response.json();
      setAsignaturas(data);
    }
    fetchAsignaturas();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nuevaAsignatura = { id: Date.now(), nombre, creditos };
    
    // Aquí podrías hacer una llamada a la API para guardar la asignatura en la BD
    setAsignaturas([...asignaturas, nuevaAsignatura]);
    
    // Limpiar campos
    setNombre('');
    setCreditos(0);
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asignaturas</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="nombre" className="flex flex-col">
          <span className="text-sm font-medium">Nombre de la Asignatura</span>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-black"
            type="text"
            required
            placeholder="Nombre de la asignatura"
          />
        </label>

        <label htmlFor="creditos" className="flex flex-col">
          <span className="text-sm font-medium">Créditos</span>
          <input
            id="creditos"
            value={creditos}
            onChange={(e) => setCreditos(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 text-black"
            type="number"
            required
            placeholder="Número de créditos"
          />
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
        >
          Agregar Asignatura
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Lista de Asignaturas</h2>
      <ul className="mt-4">
        {asignaturas.map((asignatura) => (
          <li key={asignatura.id} className="border p-2 my-2 rounded">
            {asignatura.nombre} - {asignatura.creditos} créditos
          </li>
        ))}
      </ul>
    </div>
  );
}
