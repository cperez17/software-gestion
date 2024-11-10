// gestion-app\app\asignaciones\page.tsx
"use client";

import { useEffect, useState } from "react";
import "./estilos.css";

interface Asignacion {
  assignment_id: number;
  teacher_name: string;
  course_name: string;
  semester_name: string;
  assigned_date: string;
}

const semesterMapping: Record<string, number> = {
  "Segundo semestre de 2024": 32,
  "Primer semestre de 2025": 33,
  "Segundo semestre de 2025": 34,
};

export default function Asignaciones() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null);
  const [editTeacherName, setEditTeacherName] = useState<string>("");
  const [editCourseName, setEditCourseName] = useState<string>("");

  const fetchAsignaciones = async (semesterId: number) => {
    const res = await fetch(`/api/asignaciones?semester_id=${semesterId}`);
    const data = await res.json();
    setAsignaciones(data);
  };

  const handleSemesterSelect = (semesterId: number) => {
    setSelectedSemester(semesterId);
    fetchAsignaciones(semesterId);
  };

  const handleEdit = (asignacion: Asignacion) => {
    setEditingAssignmentId(asignacion.assignment_id);
    setEditTeacherName(asignacion.teacher_name);
    setEditCourseName(asignacion.course_name);
  };

  const handleSaveEdit = async () => {
    if (editingAssignmentId !== null) {
      // Update the assignment information (Assuming an API endpoint exists for editing)
      await fetch(`/api/asignaciones/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: editingAssignmentId,
          teacher_name: editTeacherName,
          course_name: editCourseName,
        }),
      });
      
      // Refresh data and reset edit state
      if (selectedSemester) fetchAsignaciones(selectedSemester);
      setEditingAssignmentId(null);
      setEditTeacherName("");
      setEditCourseName("");
    }
  };

  return (
    <div className="layout">
      <h1>Asignaciones de Profesores</h1>
      {!selectedSemester ? (
        <div className="semester-buttons-grid">
          <h2>Selecciona un semestre:</h2>
          {Object.entries(semesterMapping).map(([semesterName, semesterId]) => (
            <button
              key={semesterId}
              onClick={() => handleSemesterSelect(semesterId)}
              className="semester-button"
            >
              {semesterName}
            </button>
          ))}
        </div>
      ) : (
        <div className="asignaciones-grid">
          {asignaciones.length > 0 ? (
            asignaciones.map((asignacion) => (
              <div key={asignacion.assignment_id} className="asignacion-card">
                {editingAssignmentId === asignacion.assignment_id ? (
                  <>
                    <input
                      type="text"
                      value={editTeacherName}
                      onChange={(e) => setEditTeacherName(e.target.value)}
                      placeholder="Nombre del Profesor"
                    />
                    <input
                      type="text"
                      value={editCourseName}
                      onChange={(e) => setEditCourseName(e.target.value)}
                      placeholder="Nombre del Curso"
                    />
                    <button onClick={handleSaveEdit} className="save-button">Guardar</button>
                  </>
                ) : (
                  <>
                    <p><strong>Profesor:</strong> {asignacion.teacher_name}</p>
                    <p><strong>Curso:</strong> {asignacion.course_name}</p>
                    <p><strong>Semestre:</strong> {asignacion.semester_name}</p>
                    <p><strong>Fecha de Asignación:</strong> {new Date(asignacion.assigned_date).toLocaleDateString()}</p>
                    <button onClick={() => handleEdit(asignacion)} className="edit-button">Editar</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No hay asignaciones registradas para el semestre seleccionado.</p>
          )}
        </div>
      )}
    </div>
  );
}
