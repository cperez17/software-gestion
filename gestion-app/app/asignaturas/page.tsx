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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'credits') {
      setNewAsignatura((prev) => ({
        ...prev,
        [name]: Number(value), // Convert to number for credits
      }));
    } else if (name === 'semester_id') {
      setNewAsignatura((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0, // Ensure semester_id is a number
      }));
    } else {
      setNewAsignatura((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si los campos tienen valores válidos
    if (
      newAsignatura.course_name.trim() !== "" &&
      newAsignatura.code.trim() !== "" &&
      newAsignatura.credits != 0 && 
      newAsignatura.semester_id !==0
    ) {
      try {
        // Hacer una solicitud POST para agregar la nueva asignatura
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
  
  
  
// En tu componente de asignaturas
const handleDelete = async (id: number) => {
  // Confirmación antes de eliminar
  const confirmation = window.confirm('¿Estás seguro de que quieres eliminar esta asignatura?');
  
  if (confirmation) {
    try {
      // Realizar la solicitud DELETE al backend
      const response = await fetch(`/api/asignaturas?course_id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la asignatura');
      }

      setAsignaturas((prevAsignaturas) =>
        prevAsignaturas.filter((asignatura) => asignatura.course_id !== id)
      );
      
      alert('Asignatura eliminada con éxito');
      
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al eliminar la asignatura.');
    }
  }
}


  

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
        <button
          className="info-button"
          onClick={() => handleVerInformacion(asignatura)}
        >
          Ver Información
        </button>
      </li>
    ))}
  </ul>
</div>
{isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Agregar Nueva Asignatura</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="course_name">Nombre de la Asignatura:</label>
        <input
          type="text"
          id="course_name"
          name="course_name"
          value={newAsignatura.course_name}
          onChange={handleInputChange}
        />
        <label htmlFor="code">Código:</label>
        <input
            type="text"
            id="code"
            name="code"
            value={newAsignatura.code}
            onChange={handleInputChange}
/>

        <label htmlFor="credits">Créditos:</label>
        <input
          type="number"
          id="credits"
          name="credits"
          value={newAsignatura.credits}
          onChange={handleInputChange}
          min="1" 
          required
        />
        
        <label htmlFor="semester_id">Semestre:</label>
        <select
          id="semester_id"
          name="semester_id"
          value={newAsignatura.semester_id}
          onChange={handleInputChange}
        >
          <option value="">Seleccionar Semestre</option>
          {semestres.map(semester => (
            <option key={semester.semester_id} value={semester.semester_id}>
              {semester.semester_num}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleModalClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}


{/* Información Detallada de la Asignatura */}
<div className="details">
  {selectedAsignatura && (
    <div className="details-card">
      <h2 className="details-title">Información de {selectedAsignatura.course_name}</h2>
      <p>Código: {selectedAsignatura.code}</p>
      <p>Créditos: {selectedAsignatura.credits}</p>
      <p>Semestre: {semestres.find(semester => semester.semester_id === selectedAsignatura.semester_id)?.semester_name}</p>
      <div className="details-menu">
        <button
          className="details-button"
          onClick={() => handleDelete(selectedAsignatura.course_id)}
        >
          Eliminar 
        </button>
        
        <button className="details-button" onClick={handleClose}>
          Cerrar
        </button>
      </div>
    </div>
  )}
</div>

    </div>
  );
}