"use client";

import { useState, useEffect } from 'react';

interface Docente {
  teacher_id?: number; 
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  max_credits: number;
  rut_login?: string;
  password?: string;
  contract?: string;
}

export default function Docentes() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [newDocente, setNewDocente] = useState<Docente>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    max_credits: 0,
    rut_login: '',
    password: '',
    contract: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');  // Estado para el buscador
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDocentes() {
      const res = await fetch('/api/docentes');
      const data = await res.json();
      setDocentes(data);
    }
    fetchDocentes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocente.first_name && newDocente.last_name && newDocente.email && newDocente.max_credits) {
      const response = await fetch('/api/docentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocente),
      });
      const addedDocente = await response.json();
      setDocentes((prev) => [...prev, addedDocente]);
      setIsModalOpen(false);
      setNewDocente({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        max_credits: 0,
        rut_login: '',
        password: '',
        contract: '',
      });
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  const handleAgregarDocente = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewDocente({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      max_credits: 0,
      rut_login: '',
      password: '',
      contract: '',
    });
  };

  const handleVerInfo = (docente: Docente) => {
    setSelectedDocente(docente);
    setIsInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
    setSelectedDocente(null);
  };

  // Eliminar docente
  const handleDeleteDocente = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este docente?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/docentes?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setDocentes((prevDocentes) => prevDocentes.filter(docente => docente.teacher_id !== id));
          setIsInfoModalOpen(false); // Cierra el modal
          alert('Docente eliminado exitosamente');
        } else {
          alert('Error al eliminar el docente');
        }
      } catch (error) {
        console.error('Error al eliminar el docente:', error);
        alert('Error al eliminar el docente');
      }
    }
  };

  // Filtro de búsqueda
  const filteredDocentes = docentes.filter((docente) =>
    `${docente.first_name} ${docente.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout docentes-page">
      <button className="add-docente-btn" onClick={handleAgregarDocente}>Agregar Docente</button>

      {/* Input de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar docente por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de Docentes */}
      <div className="sidebar">
        <h2 className="sidebar-title">Docentes Disponibles</h2>
        <ul className="docentes-list">
          {filteredDocentes.map((docente, index) => (
            <li key={index} className="docente-item">
              <span className="docente-info">
                {docente.first_name} {docente.last_name}
              </span>
              <button onClick={() => handleVerInfo(docente)}>Ver Información</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para agregar docente */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar Nuevo Docente</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                placeholder="Nombre"
                value={newDocente.first_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Apellido"
                value={newDocente.last_name}
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
              <input
                type="text"
                name="phone_number"
                placeholder="Número de Celular"
                value={newDocente.phone_number}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="max_credits"
                placeholder="Créditos Máximos"
                value={newDocente.max_credits}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="rut_login"
                placeholder="RUT"
                value={newDocente.rut_login}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newDocente.password}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="contract"
                placeholder="Contrato"
                value={newDocente.contract}
                onChange={handleInputChange}
              />
              <button type="submit">Agregar</button>
              <button type="button" onClick={handleModalClose}>Cerrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver información de docente con el botón de eliminar */}
      {isInfoModalOpen && selectedDocente && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Información del Docente</h2>
            <p><strong>Nombre:</strong> {selectedDocente.first_name} {selectedDocente.last_name}</p>
            <p><strong>Email:</strong> {selectedDocente.email}</p>
            <p><strong>Número de Celular:</strong> {selectedDocente.phone_number}</p>
            <p><strong>Créditos Máximos:</strong> {selectedDocente.max_credits}</p>
            <p><strong>RUT:</strong> {selectedDocente.rut_login}</p>
            <p><strong>Contraseña:</strong> {selectedDocente.password}</p>
            <p><strong>Contrato:</strong> {selectedDocente.contract}</p>
            <button onClick={() => handleDeleteDocente(selectedDocente.teacher_id!)}>Eliminar Docente</button>
            <button onClick={handleInfoModalClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
