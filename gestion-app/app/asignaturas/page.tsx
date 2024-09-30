"use client";

import { useState } from 'react';

// Definir la interfaz para las asignaturas
interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  semestre: string;
}

// Datos de ejemplo para las asignaturas
const initialAsignaturas: Asignatura[] = [
  { id: 1, nombre: 'MECÁNICA RACIONAL ESTÁTICA', codigo: 'IOCC109', semestre: 'IV' },
  { id: 2, nombre: 'TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS', codigo: 'IOCC119', semestre: 'IV' },
  { id: 3, nombre: 'MATERIALES DE INGENIERÍA CIVIL', codigo: 'IOCC093', semestre: 'III' },
  { id: 4, nombre: 'TALLER DE DIBUJO EN INGENIERÍA', codigo: 'IOCC104', semestre: 'III' },
];

export default function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(initialAsignaturas);
  const [selectedAsignatura, setSelectedAsignatura] = useState<Asignatura | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAsignatura, setNewAsignatura] = useState<Asignatura>({
    id: 0,
    nombre: '',
    codigo: '',
    semestre: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleVerInformacion = (asignatura: Asignatura) => {
    setSelectedAsignatura(asignatura);
    setIsEditing(false); // Resetear el estado de edición al ver información
  };

  const handleClose = () => {
    setSelectedAsignatura(null);
  };

  const handleAgregarAsignatura = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAsignatura({ id: 0, nombre: '', codigo: '', semestre: '' }); // Resetear el formulario
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedAsignatura) {
      setSelectedAsignatura((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNewAsignatura((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAsignatura.nombre && newAsignatura.codigo && newAsignatura.semestre) {
      const addedAsignatura: Asignatura = {
        ...newAsignatura,
        id: asignaturas.length + 1,
      };
      setAsignaturas((prev) => [...prev, addedAsignatura]);
      handleModalClose();
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleEliminarAsignatura = (id: number) => {
    setAsignaturas(asignaturas.filter(asignatura => asignatura.id !== id));
    handleClose(); // Cierra el detalle si la asignatura eliminada era la seleccionada
  };

  const handleModificar = () => {
    setIsEditing(true); // Habilitar el modo de edición
  };

  const handleActualizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsignatura) {
      setAsignaturas((prev) =>
        prev.map((asignatura) =>
          asignatura.id === selectedAsignatura.id ? selectedAsignatura : asignatura
        )
      );
      setIsEditing(false); // Deshabilitar el modo de edición
    }
  };

  return (
    <div className="layout asignaturas-page">
      <div className="content">
        {/* Lista de Asignaturas */}
        <div className="sidebar">
          <h2 className="sidebar-title">Asignaturas Disponibles</h2>
          <button className="add-button" onClick={handleAgregarAsignatura}>
            Agregar Asignatura
          </button>
          <ul className="asignaturas-list">
            {asignaturas.map((asignatura) => (
              <li key={asignatura.id} className="asignatura-item">
                <span className="asignatura-info">
                  {asignatura.nombre} - {asignatura.codigo} (Semestre: {asignatura.semestre})
                </span>
                <button className="info-button" onClick={() => handleVerInformacion(asignatura)}>
                  Ver Información
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Información Detallada de la Asignatura */}
        <div className="details">
          {selectedAsignatura && (
            <div className="details-card">
              <h2 className="details-title">Información de {selectedAsignatura.nombre}</h2>
              {isEditing ? (
                <form onSubmit={handleActualizar}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={selectedAsignatura.nombre}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="codigo"
                    placeholder="Código"
                    value={selectedAsignatura.codigo}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="semestre"
                    placeholder="Semestre"
                    value={selectedAsignatura.semestre}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit">Actualizar</button>
                  <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <p>Código: {selectedAsignatura.codigo}</p>
                  <p>Semestre: {selectedAsignatura.semestre}</p>
                  <button className="modify-button" onClick={handleModificar}>Modificar Información</button>
                  <button className="delete-button" onClick={() => handleEliminarAsignatura(selectedAsignatura.id)}>
                    Eliminar Asignatura
                  </button>
                </>
              )}
              <button className="close-button" onClick={handleClose}>Cerrar</button>
            </div>
          )}
        </div>

        {/* Modal para agregar asignatura */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Agregar Nueva Asignatura</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={newAsignatura.nombre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="codigo"
                  placeholder="Código"
                  value={newAsignatura.codigo}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="semestre"
                  placeholder="Semestre"
                  value={newAsignatura.semestre}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">Agregar</button>
                <button type="button" onClick={handleModalClose}>Cerrar</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
