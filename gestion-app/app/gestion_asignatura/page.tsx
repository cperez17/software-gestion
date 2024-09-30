// app/gestion_asignatura/page.tsx

'use client';

import React, { useState } from 'react';

export default function GestionAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([
    { id: 1, nombre: 'Matemáticas', codigo: 'MAT101', profesor: 'Dr. Pérez' },
    { id: 2, nombre: 'Física', codigo: 'FIS202', profesor: 'Dra. López' },
    { id: 3, nombre: 'Programación', codigo: 'PRO303', profesor: 'Ing. García' },
  ]);

  const handleAgregarAsignatura = () => {
    // Lógica para agregar una nueva asignatura
    alert('Agregar nueva asignatura');
  };

  return (
    <div className="flex p-4">
      <div className="w-2/3 pr-4">
        <h1 className="text-3xl font-bold mb-4">Gestión de Asignaturas</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Código</th>
              <th className="border border-gray-300 px-4 py-2">Profesor</th>
            </tr>
          </thead>
          <tbody>
            {asignaturas.map((asignatura) => (
              <tr key={asignatura.id}>
                <td className="border border-gray-300 px-4 py-2">{asignatura.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{asignatura.codigo}</td>
                <td className="border border-gray-300 px-4 py-2">{asignatura.profesor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-1/3 pl-4 flex items-center justify-center">
        <button
          onClick={handleAgregarAsignatura}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
        >
          Agregar Asignatura
        </button>
      </div>
    </div>
  );
}
