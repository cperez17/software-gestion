"use client";

import { useState, useEffect } from "react";
import ExcelJS from "exceljs";

// Definir la interfaz para las asignaturas solicitadas
interface AsignaturaSolicitada {
  course_name: string;
  school_name: string;
  credits: number;
}

// Definir la interfaz para los profesores
interface Profesor {
  teacher_id: number;
  first_name: string;
  last_name: string;
}

export default function Asignar() {
  const [file, setFile] = useState<File | null>(null);
  const [asignaturas, setAsignaturas] = useState<AsignaturaSolicitada[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]); // Lista de profesores
  const [selectedAsignatura, setSelectedAsignatura] = useState<AsignaturaSolicitada | null>(null);
  const [selectedProfesor, setSelectedProfesor] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  // Procesar archivo y cargar asignaturas
  const handleFileUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      const asignaturasSolicitadas: AsignaturaSolicitada[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Saltar encabezados
          const course_name = row.getCell(2).value?.toString() || "";
          const school_name = row.getCell(3).value?.toString() || "";
          const credits = parseInt(row.getCell(4).value?.toString() || "0");

          asignaturasSolicitadas.push({ course_name, school_name, credits });
        }
      });

      setAsignaturas(asignaturasSolicitadas); // Actualizar estado con las asignaturas
    };

    reader.readAsArrayBuffer(file);
  };

  // Obtener profesores desde la base de datos (API)
  useEffect(() => {
    async function fetchProfesores() {
      const res = await fetch('/api/profesores');
      const data: Profesor[] = await res.json(); // Asignamos el tipo correcto
      setProfesores(data);
    }
    fetchProfesores();
  }, []);

  // Abrir modal para asignar profesor
  const handleAsignarProfesor = (asignatura: AsignaturaSolicitada) => {
    setSelectedAsignatura(asignatura);
    setIsModalOpen(true);
  };

  // Enviar asignación de profesor
  const handleSubmitAsignacion = async () => {
    if (!selectedProfesor || !selectedAsignatura) return;

    const response = await fetch('/api/asignar-profesor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_name: selectedAsignatura.course_name,
        school_name: selectedAsignatura.school_name,
        teacher_id: selectedProfesor,
      }),
    });

    if (response.ok) {
      alert('Profesor asignado correctamente');
      setIsModalOpen(false);
    } else {
      alert('Error al asignar el profesor');
    }
  };

  return (
    <div className="layout asignar-page">
      <h1>Asignar Profesores</h1>
      <input type="file" accept=".xlsx, .ods" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Subir Archivo</button>

      {/* Lista de asignaturas */}
      <div className="asignaturas-container">
        <h2>Asignaturas Solicitadas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre de Asignatura</th>
              <th>Escuela</th>
              <th>Créditos</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {asignaturas.map((asignatura, index) => (
              <tr key={index}>
                <td>{asignatura.course_name}</td>
                <td>{asignatura.school_name}</td>
                <td>{asignatura.credits}</td>
                <td>
                  <button onClick={() => handleAsignarProfesor(asignatura)}>Asignar Profesor</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para asignar profesor */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Asignar Profesor a {selectedAsignatura?.course_name}</h2>
            <select onChange={(e) => setSelectedProfesor(parseInt(e.target.value))}>
              <option value="">Selecciona un profesor</option>
              {profesores.map(profesor => (
                <option key={profesor.teacher_id} value={profesor.teacher_id}>
                  {profesor.first_name} {profesor.last_name}
                </option>
              ))}
            </select>
            <button onClick={handleSubmitAsignacion}>Asignar</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}