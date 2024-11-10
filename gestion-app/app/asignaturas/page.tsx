"use client";

import { useState, useEffect } from 'react';

// Definir la interfaz para las asignaturas
interface Asignatura {
  course_id: number;
  course_name: string;
  code: string;
  credits: number;
  semester_id: number;
}

export default function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState<Asignatura | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAsignatura, setNewAsignatura] = useState<Asignatura>({
    course_id: 0,
    course_name: '',
    code: '',
    credits: 0,
    semester_id: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showGeneralInfo, setShowGeneralInfo] = useState<boolean>(false);

  // Obtener las asignaturas de la base de datos al cargar el componente
  useEffect(() => {
    async function fetchAsignaturas() {
      const res = await fetch('/api/asignaturas');
      const data = await res.json();
      setAsignaturas(data);
    }
    fetchAsignaturas();
  }, []);

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
    setNewAsignatura({ course_id: 0, course_name: '', code: '', credits: 0, semester_id: 0 }); // Resetear el formulario
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAsignatura.course_name && newAsignatura.code && newAsignatura.credits) {
      const response = await fetch('/api/asignaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsignatura),
      });
      const addedAsignatura = await response.json();
      setAsignaturas((prev) => [...prev, addedAsignatura]);
      handleModalClose();
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleEliminarAsignatura = async (id: number) => {
    await fetch(`/api/asignaturas/${id}`, {
      method: 'DELETE',
    });
    setAsignaturas(asignaturas.filter(asignatura => asignatura.course_id !== id));
    handleClose(); // Cierra el detalle si la asignatura eliminada era la seleccionada
  };

  const handleModificar = () => {
    setIsEditing(true); // Habilitar el modo de edición
  };

  const handleActualizar = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedAsignatura) {
          const response = await fetch(`/api/asignaturas`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(selectedAsignatura),
          });
  
          const updatedAsignatura = await response.json();
          setAsignaturas((prev) =>
              prev.map((asignatura) =>
                  asignatura.course_id === updatedAsignatura.course_id ? updatedAsignatura : asignatura
              )
          );
          setIsEditing(false); 
      }
  };
  

  const handleVerInfoGeneral = () => {
    setShowGeneralInfo(true);
  };

  const handleCloseGeneralInfo = () => {
    setShowGeneralInfo(false);
  };

  return (
    <div className="layout asignaturas-page">
      <button onClick={handleVerInfoGeneral}>Ver Info General</button>

      {showGeneralInfo && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Informe General de Asignaturas</h2>
              <button className="close-button" onClick={handleCloseGeneralInfo}>X</button>
            </div>
            <div className="modal-content">
              <div className="grid">
                {asignaturas.map((asignatura) => (
                  <div className="grid-item" key={asignatura.course_id}>
                    <h3>{asignatura.course_name}</h3>
                    <p>Código: {asignatura.code}</p>
                    <p>Créditos: {asignatura.credits}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Asignaturas */}
      <div className="sidebar">
        <h2 className="sidebar-title">Asignaturas Disponibles</h2>
        <button className="add-button" onClick={handleAgregarAsignatura}>
          Agregar Asignatura
        </button>
        <ul className="asignaturas-list">
          {asignaturas.map((asignatura) => (
            <li key={asignatura.course_id} className="asignatura-item">
              <span className="asignatura-info">
                {asignatura.course_name} - {asignatura.code} - Créditos: {asignatura.credits}
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
            <h2 className="details-title">Información de {selectedAsignatura.course_name}</h2>
            {isEditing ? (
              <form onSubmit={handleActualizar}>
                <input
                  type="text"
                  name="course_name"
                  placeholder="Nombre"
                  value={selectedAsignatura.course_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Código"
                  value={selectedAsignatura.code}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="credits"
                  placeholder="Créditos"
                  value={selectedAsignatura.credits}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">Actualizar</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
              </form>
            ) : (
              <>
                <p>Código: {selectedAsignatura.code}</p>
                <p>Créditos: {selectedAsignatura.credits}</p>
                <button className="modify-button" onClick={handleModificar}>Modificar Información</button>
                <button className="delete-button" onClick={() => handleEliminarAsignatura(selectedAsignatura.course_id)}>
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
                name="course_name"
                placeholder="Nombre"
                value={newAsignatura.course_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="code"
                placeholder="Código"
                value={newAsignatura.code}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="credits"
                placeholder="Créditos"
                value={newAsignatura.credits}
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
  );
}