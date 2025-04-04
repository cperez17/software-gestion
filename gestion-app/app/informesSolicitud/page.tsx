'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/informeSolicitud.css';

interface Assignment {
  course_name: string;
  code: string;
  credits: number;
  semester_name: string;
  assigned_date: string;
}

interface TeacherAssignmentsData {
  teacher_id: number;
  teacher_name: string;
  assignments: Assignment[];
}

const TeacherSection: React.FC<TeacherAssignmentsData> = ({ teacher_name, assignments }) => (
  <div className="teacherSection">
    <div className="teacherRow">
      Docente: <span className="teacherName">{teacher_name}</span>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th className="header">Curso</th>
          <th className="header">Código</th>
          <th className="header">Créditos</th>
          <th className="header">Semestre</th>
          <th className="header">Fecha de Asignación</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((assignment, index) => (
          <tr key={index}>
            <td className="cell">{assignment.course_name}</td>
            <td className="cell">{assignment.code}</td>
            <td className="cell">{assignment.credits}</td>
            <td className="cell">{assignment.semester_name}</td>
            <td className="cell">{new Date(assignment.assigned_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InformeSolicitud: React.FC = () => {
  const [teachersAssignmentsData, setTeachersAssignmentsData] = useState<TeacherAssignmentsData[]>([]);
  const [teacherFilter, setTeacherFilter] = useState<string>('');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('');
  const [hideButton, setHideButton] = useState(false);

  const isPDF = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pdf') === 'true';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setHideButton(urlParams.get('hideButton') === 'true');

    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const url = `/api/getCourses?teacher=${teacherFilter}&academicYear=${academicYearFilter}`;
      const res = await fetch(url);
      const data: {
        teacher_id: number;
        teacher_name: string;
        course_name: string;
        code: string;
        credits: number;
        semester_name: string;
        assigned_date: string;
      }[] = await res.json();

      // Agrupar las asignaciones por `teacher_id`
      const groupedAssignments: Record<number, TeacherAssignmentsData> = {};
      data.forEach((assignment) => {
        const { teacher_id, teacher_name, ...assignmentData } = assignment;
        if (!groupedAssignments[teacher_id]) {
          groupedAssignments[teacher_id] = {
            teacher_id,
            teacher_name,
            assignments: [],
          };
        }
        groupedAssignments[teacher_id].assignments.push(assignmentData);
      });

      setTeachersAssignmentsData(Object.values(groupedAssignments));
    } catch (error) {
      console.error('Error al obtener asignaciones:', error);
    }
  };

  const handleTeacherFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherFilter(e.target.value);
  };

  const handleAcademicYearFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcademicYearFilter(e.target.value);
  };

  const handleGeneratePDF = async () => {
    try {
      const res = await fetch('/api/generatePDF', {
        method: 'POST',
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'informe_solicitud.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Error al generar el PDF.');
      }
    } catch (error) {
      console.error('Error en la solicitud para generar el PDF:', error);
    }
  };

  return (
    <div className="container">
      {!isPDF && (
        <div className="filter-section">
          <input
            type="text"
            placeholder="Filtrar por docente"
            value={teacherFilter}
            onChange={handleTeacherFilterChange}
          />
          <input
            type="text"
            placeholder="Filtrar por semestre"
            value={academicYearFilter}
            onChange={handleAcademicYearFilterChange}
          />
          <button onClick={fetchAssignments} className="apply-filters-button">
            Aplicar Filtros
          </button>
        </div>
      )}

      {teachersAssignmentsData.map((teacherData) => (
        <TeacherSection key={teacherData.teacher_id} {...teacherData} />
      ))}

      {!isPDF && !hideButton && (
        <button onClick={handleGeneratePDF} className={styles.button}>
          Generar PDF
        </button>
      )}
    </div>
  );
};

export default InformeSolicitud;
