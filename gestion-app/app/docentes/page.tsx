"use client";

import { useState } from 'react';

// Definir la interfaz para los docentes
interface Docente {
  id: number;
  nombre: string;
  departamento: string;
  email: string;
}

// Datos de ejemplo para los docentes
const initialDocentes: Docente[] = [
  { id: 1, nombre: 'Juan Pérez', departamento: 'ICOC', email: 'juan.perez@uach.cl' },
  { id: 2, nombre: 'María González', departamento: 'ICOC', email: 'maria.gonzalez@uach.cl' },
  { id: 3, nombre: 'Carlos López', departamento: 'ICOC', email: 'carlos.lopez@uach.cl' },
  { id: 4, nombre: 'Ana Torres', departamento: 'ICOC', email: 'ana.torres@uach.cl' },
];

export default function Docentes() {
  const [docentes, setDocentes] = useState<Docente[]>(initialDocentes);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newDocente, setNewDocente] = useState<Docente>({
    id: 0,
    nombre: '',
    departamento: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleVerInformacion = (docente: Docente) => {
    setSelectedDocente(docente);
    setIsEditing(false); // Resetear el estado de edición al ver información
  };

  const handleClose = () => {
    setSelectedDocente(null);
  };

  const handleAgregarDocente = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewDocente({ id: 0, nombre: '', departamento: '', email: '' }); // Resetear el formulario
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedDocente) {
      setSelectedDocente((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNewDocente((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocente.nombre && newDocente.departamento && newDocente.email) {
      const addedDocente: Docente = {
        ...newDocente,
        id: docentes.length + 1,
      };
      setDocentes((prev) => [...prev, addedDocente]);
      handleModalClose();
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleEliminarDocente = (id: number) => {
    setDocentes(docentes.filter(docente => docente.id !== id));
    handleClose(); // Cierra el detalle si el docente eliminado era el seleccionado
  };

  const handleModificar = () => {
    setIsEditing(true); // Habilitar el modo de edición
  };

  const handleActualizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocente) {
      setDocentes((prev) =>
        prev.map((docente) =>
          docente.id === selectedDocente.id ? selectedDocente : docente
        )
      );
      setIsEditing(false); // Deshabilitar el modo de edición
    }
  };

  return (
    <div className="layout asignatura-page">
      <div className="content">
        {/* Lista de Docentes */}
        <div className="sidebar">
          <h2 className="sidebar-title">Docentes Disponibles</h2>
          <button className="add-button" onClick={handleAgregarDocente}>
            Agregar Docente
          </button>
          <ul className="docentes-list">
            {docentes.map((docente) => (
              <li key={docente.id} className="asignatura-item">
                <span className="asignatura-info">
                  {docente.nombre} - {docente.departamento}
                </span>
                <button className="info-button" onClick={() => handleVerInformacion(docente)}>
                  Ver Información
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Información Detallada del Docente */}
        <div className="details">
          {selectedDocente && (
            <div className="details-card">
              <h2 className="details-title">Información de {selectedDocente.nombre}</h2>
              {isEditing ? (
                <form onSubmit={handleActualizar}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={selectedDocente.nombre}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="departamento"
                    placeholder="Departamento"
                    value={selectedDocente.departamento}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={selectedDocente.email}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit">Actualizar</button>
                  <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <p>Departamento: {selectedDocente.departamento}</p>
                  <p>Email: {selectedDocente.email}</p>
                  <button className="modify-button" onClick={handleModificar}>Modificar Información</button>
                  <button className="delete-button" onClick={() => handleEliminarDocente(selectedDocente.id)}>
                    Eliminar Docente
                  </button>
                </>
              )}
              <button className="close-button" onClick={handleClose}>Cerrar</button>
            </div>
          )}
        </div>

        {/* Modal para agregar docente */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Agregar Nuevo Docente</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={newDocente.nombre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="departamento"
                  placeholder="Departamento"
                  value={newDocente.departamento}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newDocente.email}
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
