'use client';
import { useState, useEffect } from 'react';
import "./estilos.css";

// Definir la interfaz para las asignaturas
interface Asignatura {
  course_id: number;
  course_name: string;
  code: string;
  credits: number;
  semester_id: number;
}

interface Semestre {
  semester_id: number;
  semester_num: number; // Número de semestre
  semester_name: string;
}

export default function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [filteredAsignaturas, setFilteredAsignaturas] = useState<Asignatura[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]); // Nuevo estado para los semestres
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
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null); // Nuevo estado para el filtro de semestre

  // Obtener las asignaturas y los semestres de la base de datos
  useEffect(() => {
    async function fetchData() {
      // Obtener las asignaturas
      const asignaturasRes = await fetch('/api/asignaturas');
      const asignaturasData = await asignaturasRes.json();
      setAsignaturas(asignaturasData);
      setFilteredAsignaturas(asignaturasData); // Inicialmente mostrar todas las asignaturas

      // Obtener los semestres
      const semestresRes = await fetch('/api/semestres');
      const semestresData = await semestresRes.json();
      setSemestres(semestresData); // Asignar los semestres a su estado
    }
    fetchData();
  }, []);

  const handleVerInformacion = (asignatura: Asignatura) => {
    setSelectedAsignatura(asignatura);
    setIsEditing(false); // Resetear el estado de edición al ver información
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = parseInt(e.target.value);
    setSelectedSemester(semester);
    if (semester) {
      // Filtrar las asignaturas por semester_num
      setFilteredAsignaturas(asignaturas.filter(asignatura => {
        const semestre = semestres.find(s => s.semester_id === asignatura.semester_id);
        return semestre ? semestre.semester_num === semester : false;
      }));
    } else {
      setFilteredAsignaturas(asignaturas); // Mostrar todas si no hay un semestre seleccionado
    }
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
      try {
        const response = await fetch('/api/asignaturas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAsignatura),
        });
        if (!response.ok) {
          throw new Error('Error al agregar la asignatura');
        }
        const addedAsignatura = await response.json();
        setAsignaturas((prev) => [...prev, addedAsignatura]);
        handleModalClose();
      } catch (error) {
        console.error(error);
        alert('Hubo un problema al agregar la asignatura.');
      }
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
      try {
        const response = await fetch(`/api/asignaturas`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedAsignatura),
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la asignatura');
        }
        const updatedAsignatura = await response.json();
        setAsignaturas((prev) =>
          prev.map((asignatura) =>
            asignatura.course_id === updatedAsignatura.course_id ? updatedAsignatura : asignatura
          )
        );
        setIsEditing(false);
      } catch (error) {
        console.error(error);
        alert('Hubo un problema al actualizar la asignatura.');
      }
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
      {/* Filtro por semestre */}
      <label htmlFor="semester-filter">Filtrar por Semestre:</label>
      <select id="semester-filter" className="filter-select" onChange={handleFilterChange}>
        <option value="">Todos</option>
        {semestres.map(semester => (
          <option key={semester.semester_id} value={semester.semester_num}>
            {semester.semester_num}
          </option>
        ))}
      </select>

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
                {filteredAsignaturas.map((asignatura) => (
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

      <div className="sidebar">
        <h2 className="sidebar-title">Asignaturas Disponibles</h2>
        <button className="add-button" onClick={handleAgregarAsignatura}>
          Agregar Asignatura
        </button>
        <ul className="asignaturas-list">
          {filteredAsignaturas.map((asignatura) => (
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
            <p>Código: {selectedAsignatura.code}</p>
            <p>Créditos: {selectedAsignatura.credits}</p>
            <p>Semestre: {semestres.find(semester => semester.semester_id === selectedAsignatura.semester_id)?.semester_name}</p>
            {isEditing ? (
              <div>
                <button className="edit-button" onClick={handleActualizar}>Actualizar</button>
              </div>
            ) : (
              <button className="edit-button" onClick={handleModificar}>Modificar</button>
            )}
            <button className="delete-button" onClick={() => handleEliminarAsignatura(selectedAsignatura.course_id)}>
              Eliminar
            </button>
            <button className="close-button" onClick={handleClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}
