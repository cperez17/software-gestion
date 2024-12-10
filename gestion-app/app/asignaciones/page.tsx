"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import "./estilos.css";

interface Asignacion {
  assignment_id: number;
  course_request_id: number;
  teacher_id: number;
  teacher_name: string;
  course_name: string;
  credits: number;
  academic_year_name: string;
  assigned_date: string;
}

interface DocenteAsignaciones {
  teacher_id: number;
  teacher_name: string;
  asignaciones: Asignacion[];
}

const academicYearMapping: Record<string, number> = {
  "2024 - Primer Semestre": 1,
  "2024 - Segundo Semestre": 2,
  "2025 - Primer Semestre": 3,
  "2025 - Segundo Semestre": 4,
};

export default function AsignacionesDocentes() {
  const [docentesAsignaciones, setDocentesAsignaciones] = useState<DocenteAsignaciones[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
  const [expandedDocente, setExpandedDocente] = useState<number | null>(null);
  const [selectedAcademicYearName, setSelectedAcademicYearName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const fetchAsignaciones = async (academicYearId: number) => {
    const res = await fetch(`/api/asignaciones?academic_year_id=${academicYearId}`);
    const data: Asignacion[] = await res.json();

    const groupedByDocente: { [key: number]: DocenteAsignaciones } = {};
    data.forEach((asignacion) => {
      if (!groupedByDocente[asignacion.teacher_id]) {
        groupedByDocente[asignacion.teacher_id] = {
          teacher_id: asignacion.teacher_id,
          teacher_name: asignacion.teacher_name,
          asignaciones: [],
        };
      }
      groupedByDocente[asignacion.teacher_id].asignaciones.push(asignacion);
    });

    setDocentesAsignaciones(Object.values(groupedByDocente));
  };

  const handleAcademicYearSelect = (academicYearId: number, academicYearName: string) => {
    setSelectedAcademicYear(academicYearId);
    setSelectedAcademicYearName(academicYearName);
    fetchAsignaciones(academicYearId);
  };

  const toggleExpand = (teacherId: number) => {
    setExpandedDocente(expandedDocente === teacherId ? null : teacherId);
  };

  const handleDeleteAsignacion = async (assignment_id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta asignación?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/asignaciones`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assignment_id }),
        });

        if (response.ok) {
          alert("Asignación eliminada exitosamente");
          if (selectedAcademicYear) {
            fetchAsignaciones(selectedAcademicYear);
          }
        } else {
          alert("Error al eliminar la asignación");
        }
      } catch (error) {
        console.error("Error al eliminar la asignación:", error);
        alert("Error al eliminar la asignación");
      }
    }
  };

  const filteredDocentes = docentesAsignaciones.filter((docente) =>
    docente.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout" data-academic-year-selected={!!selectedAcademicYear}>
      <h1>Asignaciones de Docentes</h1>

      <div className="academic-year-selector">
        {!selectedAcademicYear ? (
          <>
            <h2>Selecciona un año académico:</h2>
            <ul className="academic-year-list">
              {Object.entries(academicYearMapping).map(([academicYearName, academicYearId]) => (
                <li key={academicYearId}>
                  <button
                    onClick={() => handleAcademicYearSelect(academicYearId, academicYearName)}
                    className="academic-year-button"
                  >
                    {academicYearName}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="selected-academic-year">
            Año Académico actual: {selectedAcademicYearName}
            <button className="change-academic-year-button" onClick={() => setSelectedAcademicYear(null)}>
              Cambiar año académico
            </button>
          </p>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar docente por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="docentes-list">
        {filteredDocentes.length > 0 ? (
          filteredDocentes.map((docente) => (
            <div key={docente.teacher_id} className={`docente-card ${expandedDocente === docente.teacher_id ? 'expanded' : ''}`}>
              <h2>{docente.teacher_name}</h2>
              <button onClick={() => toggleExpand(docente.teacher_id)} className="view-more-button">
                {expandedDocente === docente.teacher_id ? "Ocultar información" : "Ver más información"}
              </button>
              {expandedDocente === docente.teacher_id && (
                <div className="asignaciones-list">
                  {docente.asignaciones.map((asignacion) => (
                    <div key={asignacion.assignment_id} className="asignacion-card">
                      <p><strong>Curso:</strong> {asignacion.course_name}</p>
                      <p><strong>Créditos:</strong> {asignacion.credits}</p>
                      <p><strong>Año Académico:</strong> {asignacion.academic_year_name}</p>
                      <p><strong>Fecha de Asignación:</strong> {new Date(asignacion.assigned_date).toLocaleDateString()}</p>
                      <button onClick={() => handleDeleteAsignacion(asignacion.assignment_id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay asignaciones registradas para el año académico seleccionado o la búsqueda actual.</p>
        )}
      </div>
      {/* Botón de redirección a /informesSolicitud */}
      <div className="button-container">
        <button onClick={() => router.push('/informesSolicitud')} className="redirect-button">
          Ver Informe Completo
        </button>
      </div>
    </div>
  );
}


