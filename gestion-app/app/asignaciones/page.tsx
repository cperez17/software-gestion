"use client";

import { useState, useEffect } from "react";
import "./estilos.css";

interface Asignacion {
  assignment_id: number;
  course_request_id: number;
  teacher_id: number;
  teacher_name: string;
  course_name: string;
  credits: number;
  semester_name: string;
  assigned_date: string;
}

interface DocenteAsignaciones {
  teacher_id: number;
  teacher_name: string;
  asignaciones: Asignacion[];
}

const semesterMapping: Record<string, number> = {
  "Segundo semestre de 2024": 32,
  "Primer semestre de 2025": 33,
  "Segundo semestre de 2025": 34,
};

export default function AsignacionesDocentes() {
  const [docentesAsignaciones, setDocentesAsignaciones] = useState<DocenteAsignaciones[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [expandedDocente, setExpandedDocente] = useState<number | null>(null);
  const [selectedSemesterName, setSelectedSemesterName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchAsignaciones = async (semesterId: number) => {
    const res = await fetch(`/api/asignaciones?semester_id=${semesterId}`);
    const data: Asignacion[] = await res.json();

    // Agrupar las asignaciones exclusivamente por `teacher_id`
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

    console.log("Asignaciones agrupadas por docente:", groupedByDocente);
    setDocentesAsignaciones(Object.values(groupedByDocente));
  };

  const handleSemesterSelect = (semesterId: number, semesterName: string) => {
    setSelectedSemester(semesterId);
    setSelectedSemesterName(semesterName);
    fetchAsignaciones(semesterId);
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
          if (selectedSemester) {
            fetchAsignaciones(selectedSemester);
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
    <div className="layout" data-semester-selected={!!selectedSemester}>
      <h1>Asignaciones de Docentes</h1>

      <div className="semester-selector">
        {!selectedSemester ? (
          <>
            <h2>Selecciona un semestre:</h2>
            <ul className="semester-list">
              {Object.entries(semesterMapping).map(([semesterName, semesterId]) => (
                <li key={semesterId}>
                  <button
                    onClick={() => handleSemesterSelect(semesterId, semesterName)}
                    className="semester-button"
                  >
                    {semesterName}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="selected-semester">
            Semestre actual: {selectedSemesterName}
            <button className="change-semester-button" onClick={() => setSelectedSemester(null)}>
              Cambiar semestre
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
                      <p><strong>Semestre:</strong> {asignacion.semester_name}</p>
                      <p><strong>Fecha de Asignación:</strong> {new Date(asignacion.assigned_date).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteAsignacion(asignacion.assignment_id)}
                        className="delete-button"
                      >
                        Eliminar asignación
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay asignaciones registradas para el semestre seleccionado o la búsqueda actual.</p>
        )}
      </div>
    </div>
  );
}
