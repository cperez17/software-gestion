"use client"

import React, { useState, useEffect } from 'react';
import styles from './estilos.module.css';

interface Docente {
  teacher_id?: number; 
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  max_credits: number;
  rut_login?: string;
  password?: string;
  contract?: 'ADJ' | 'HON' | 'ACA' | 'PAD';
  status?: boolean | null;
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
    contract: 'ADJ',
    status: true,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDocentes() {
      const res = await fetch('/api/docentes');
      const data = await res.json();
      setDocentes(data);
    }
    fetchDocentes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkedValue = (e.target as HTMLInputElement).checked;
      setNewDocente((prev) => ({
        ...prev,
        [name]: checkedValue,
      }));
    } else {
      setNewDocente((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isRutValid = (rut: string) => {
    const rutRegex = /^[0-9]{8}-[0-9kK]{1}$/;
    return rutRegex.test(rut);
  };

  const isFormValid = () => {
    return newDocente.first_name.trim() !== '' &&
           newDocente.last_name.trim() !== '' &&
           newDocente.email.trim() !== '' &&
           newDocente.max_credits > 0 &&
           newDocente.phone_number?.trim() !== '' &&
           isRutValid(newDocente.rut_login || '') &&
           newDocente.password?.trim() !== '' &&
           ['ADJ', 'HON', 'ACA', 'PAD'].includes(newDocente.contract || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      const url = isEditing ? `/api/docentes?id=${newDocente.teacher_id}` : '/api/docentes';
      const method = isEditing ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocente),
      });
  
      const result = await response.json();
      if (response.ok) {
        if (isEditing) {
          setDocentes((prev) =>
            prev.map((docente) => (docente.teacher_id === result.teacher_id ? result : docente))
          );
          alert('Docente actualizado exitosamente');
        } else {
          setDocentes((prev) => [...prev, result]);
          alert('Docente agregado exitosamente');
        }
        setIsModalOpen(false);
        setIsEditing(false);
        setNewDocente({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          max_credits: 0,
          rut_login: '',
          password: '',
          contract: 'ADJ',
          status: true,
        });
      } else {
        alert(result.error || 'Error al guardar el docente');
      }
    } else {
      alert("Por favor, completa todos los campos obligatorios sin espacios en blanco y asegúrate de que el RUT tenga el formato correcto (8 dígitos, guión y un dígito o 'k').");
    }
  };

  const handleAgregarDocente = () => {
    setIsModalOpen(true);
    setIsEditing(false);
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
      contract: 'ADJ',
      status: true,
    });
    setIsEditing(false);
  };

  const handleVerInfo = (docente: Docente) => {
    setSelectedDocente(docente);
    setIsInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
    setSelectedDocente(null);
  };

  const handleEditDocente = (docente: Docente) => {
    setNewDocente(docente);
    setIsEditing(true);
    setIsModalOpen(true);
    setIsInfoModalOpen(false);
  };

  const handleDeleteDocente = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este docente?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/docentes?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setDocentes((prevDocentes) => prevDocentes.filter(docente => docente.teacher_id !== id));
          setIsInfoModalOpen(false);
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

  const filteredDocentes = docentes.filter((docente) =>
    `${docente.first_name} ${docente.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <button className={styles.addDocenteBtn} onClick={handleAgregarDocente}>Agregar Docente</button>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar docente por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.docentesContainer}>
        <div className={styles.docentesColumn}>
          <h2>Docentes Activos</h2>
          <ul className={styles.docentesList}>
            {filteredDocentes
              .filter((docente) => docente.status === true)
              .map((docente) => (
                <li key={docente.teacher_id} className={styles.docenteItem}>
                  {docente.first_name} {docente.last_name}
                  <button onClick={() => handleVerInfo(docente)}>Ver Información</button>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.docentesColumn}>
          <h2>Docentes Inactivos</h2>
          <ul className={styles.docentesList}>
            {filteredDocentes
              .filter((docente) => docente.status === false)
              .map((docente) => (
                <li key={docente.teacher_id} className={styles.docenteItem}>
                  {docente.first_name} {docente.last_name}
                  <button onClick={() => handleVerInfo(docente)}>Ver Información</button>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{isEditing ? 'Editar Docente' : 'Agregar Docente'}</h2>
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
                placeholder="Teléfono"
                value={newDocente.phone_number}
                onChange={handleInputChange}
                required
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
                placeholder="RUT (formato: 12345678-9)"
                value={newDocente.rut_login}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newDocente.password}
                onChange={handleInputChange}
                required
              />
              <div className={styles['contract-dropdown']}>
                <label htmlFor="contract">Tipo de Contrato:</label>
                <select
                  id="contract"
                  name="contract"
                  value={newDocente.contract}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ADJ">ADJ</option>
                  <option value="HON">HON</option>
                  <option value="ACA">ACA</option>
                  <option value="PAD">PAD</option>
                </select>
              </div>
              <label>
                Estado:
                <input
                  type="checkbox"
                  name="status"
                  checked={newDocente.status || false}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">{isEditing ? 'Guardar Cambios' : 'Agregar'}</button>
              <button type="button" onClick={handleModalClose}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {isInfoModalOpen && selectedDocente && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Información del Docente</h2>
            <p><strong>Nombre:</strong> {selectedDocente.first_name} {selectedDocente.last_name}</p>
            <p><strong>Email:</strong> {selectedDocente.email}</p>
            <p><strong>Teléfono:</strong> {selectedDocente.phone_number}</p>
            <p><strong>Créditos Máximos:</strong> {selectedDocente.max_credits}</p>
            <p><strong>RUT:</strong> {selectedDocente.rut_login}</p>
            <p><strong>Contrato:</strong> {selectedDocente.contract}</p>
            <p><strong>Estado:</strong> {selectedDocente.status ? 'Activo' : 'Inactivo'}</p>
            <button onClick={() => handleEditDocente(selectedDocente)}>Modificar</button>
            <button className={styles.deleteBtn} onClick={() => handleDeleteDocente(selectedDocente.teacher_id!)}>Eliminar</button>
            <button onClick={handleInfoModalClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}