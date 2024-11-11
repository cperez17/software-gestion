//gestion-app\app\solicitud\page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ExcelJS from "exceljs";
import "./estilos.css";

interface AsignaturaSolicitada {
  course_code: string;
  course_name: string;
  school_name: string;
  group: number;
}

interface Solicitud {
  request_id: number;
  course_code: string;
  course_name: string;
  school_name: string;
  credits: number;
  semester_id: number;
  group: number;
}

interface Docente {
  teacher_id: number;
  first_name: string;
  last_name: string;
}

interface School {
  school_id: number;
  school_name: string;
}

const semesterMapping: Record<string, number> = {
  "Segundo semestre de 2024": 32,
  "Primer semestre de 2025": 33,
  "Segundo semestre de 2025": 34,
};

export default function Solicitudes() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [asignaturas, setAsignaturas] = useState<AsignaturaSolicitada[]>([]);
  const [uniqueAsignaturas, setUniqueAsignaturas] = useState<AsignaturaSolicitada[]>([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState<AsignaturaSolicitada | null>(null);
  const [solicitudesInfo, setSolicitudesInfo] = useState<Solicitud[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [editCredits, setEditCredits] = useState<number | null>(null);
  const [editGroup, setEditGroup] = useState<number | null>(null);
  const [editSchool, setEditSchool] = useState<string | null>(null);

  // Fetch the teachers and schools list
  useEffect(() => {
    async function fetchDocentes() {
      const res = await fetch("/api/docentes");
      const data = await res.json();
      setDocentes(data);
    }
    fetchDocentes();

    async function fetchSchools() {
      const res = await fetch("/api/solicitudes/schools");
      const data = await res.json();
      setSchools(data);
    }
    fetchSchools();
  }, []);

  const fetchSolicitudes = async () => {
    if (!selectedSemester) return;

    try {
      const response = await fetch(`/api/solicitudes?semester_id=${selectedSemester}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) return;

      const data = await response.json();
      const fetchedAsignaturas: AsignaturaSolicitada[] = data.solicitudes.map((solicitud: Solicitud) => ({
        course_code: solicitud.course_code || "",
        course_name: solicitud.course_name,
        school_name: solicitud.school_name,
        group: solicitud.group,
      }));

      const uniqueAsignaturas: AsignaturaSolicitada[] = Array.from(
        new Map(fetchedAsignaturas.map((item: AsignaturaSolicitada) => [item.course_name, item])).values()
      );

      setAsignaturas(fetchedAsignaturas);
      setUniqueAsignaturas(uniqueAsignaturas);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = semesterMapping[e.target.value];
    setSelectedSemester(selected);
    if (selected) fetchSolicitudes();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleFileUpload = async () => {
    if (!file || !selectedSemester) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      const asignaturasSolicitadas: AsignaturaSolicitada[] = [];

      worksheet.eachRow((row) => {
        const course_code = row.getCell(1).value?.toString() || "";
        const course_name = row.getCell(2).value?.toString() || "";
        const school_name = row.getCell(3).value?.toString() || "";
        const cellValue = row.getCell(6).value;
        const group = cellValue !== null && cellValue !== undefined ? parseInt(cellValue.toString()) : 0;
        asignaturasSolicitadas.push({ course_code, course_name, school_name, group });
      });

      if (asignaturasSolicitadas.length === 0) {
        alert("El archivo no contiene asignaturas.");
        return;
      }

      setAsignaturas(asignaturasSolicitadas);

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asignaturas: asignaturasSolicitadas, semester_id: selectedSemester })
      });

      if (response.ok) {
        alert("Asignaturas cargadas correctamente.");
        fetchSolicitudes();
      } else {
        alert("Error al cargar asignaturas.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleProfessorSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setSelectedProfessors(selectedOptions);
  };

  const handleConfirmAssignments = async () => {
    const requestIds = solicitudesInfo.map(solicitud => solicitud.request_id);

    if (!selectedProfessors.length || !requestIds.length) {
      alert("Selecciona al menos un profesor y asegúrate de que haya solicitudes para aprobar.");
      return;
    }

    try {
      const response = await fetch("/api/solicitudes/asignar-profesor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_ids: requestIds,
          teacher_ids: selectedProfessors,
          semester_id: selectedSemester,
        }),
      });

      if (response.ok) {
        alert("Profesores asignados y solicitud aprobada.");

        setAsignaturas((prev) =>
          prev.filter(asignatura => asignatura.course_name !== selectedAsignatura?.course_name)
        );
        setUniqueAsignaturas((prev) =>
          prev.filter(asignatura => asignatura.course_name !== selectedAsignatura?.course_name)
        );

        setSelectedProfessors([]);
        setIsModalOpen(false);
      } else {
        alert("Error al confirmar la asignación de profesores.");
      }
    } catch (error) {
      console.error("Error al asignar profesor:", error);
    }
  };

  const handleEdit = (solicitud: Solicitud) => {
    setEditingRequestId(solicitud.request_id);
    setEditCredits(solicitud.credits);
    setEditGroup(solicitud.group);
    setEditSchool(solicitud.school_name);
  };

  const handleSaveEdit = async () => {
    if (editCredits === null || editGroup === null || !editSchool || editingRequestId === null) return;

    try {
      const response = await fetch("/api/solicitudes/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: editingRequestId,
          credits: editCredits,
          group: editGroup,
          school_name: editSchool,
        }),
      });

      if (response.ok) {
        fetchSolicitudes();
        setEditingRequestId(null);
        setEditCredits(null);
        setEditGroup(null);
        setEditSchool(null);
      } else {
        alert("Error al editar la solicitud.");
      }
    } catch (error) {
      console.error("Error al editar la solicitud:", error);
    }
  };

  const handleVerInfo = async (asignatura: AsignaturaSolicitada) => {
    try {
      const response = await fetch("/api/solicitudes/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_name: asignatura.course_name })
      });

      if (response.ok) {
        const data = await response.json();
        setSolicitudesInfo(data.solicitudes || []);
        setSelectedAsignatura(asignatura);
        setIsModalOpen(true);
      } else {
        setSolicitudesInfo([]);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setSolicitudesInfo([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsignatura(null);
    setSolicitudesInfo([]);
    setSelectedProfessors([]);
    setEditingRequestId(null);
    setEditCredits(null);
    setEditGroup(null);
    setEditSchool(null);
  };

  return (
    <div className="layout">
      <h1>Gestión de Solicitudes</h1>

      <div className="filter-section">
        <label htmlFor="semester-select">Seleccionar Semestre:</label>
        <select id="semester-select" onChange={handleSemesterChange}>
          <option value="">Selecciona un semestre</option>
          {Object.keys(semesterMapping).map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        {selectedSemester && (
          <>
            <label htmlFor="file-upload">Subir archivo de solicitudes:</label>
            <input id="file-upload" type="file" accept=".xlsx, .ods" onChange={handleFileChange} />
            <button className="upload-button" onClick={handleFileUpload}>Subir Archivo</button>
          </>
        )}
      </div>

      <button onClick={fetchSolicitudes} className="fetch-button">
        Cargar Solicitudes
      </button>

      <div className="asignaturas-grid">
        {uniqueAsignaturas.map((asignatura, index) => (
          <div key={index} className="asignatura-card">
            <h3>{asignatura.course_name}</h3>
            <button className="info-button" onClick={() => handleVerInfo(asignatura)}>Ver Información</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Solicitudes para {selectedAsignatura?.course_name}</h2>
            <ul>
              <p>Escuelas solicitantes:</p>
              {solicitudesInfo.map((solicitud) => (
                <li key={solicitud.request_id} className="info-item">
                  <p>
                    Escuela:{" "}
                    {editingRequestId === solicitud.request_id ? (
                      <select
                        value={editSchool ?? solicitud.school_name}
                        onChange={(e) => setEditSchool(e.target.value)}
                      >
                        {schools.map((school) => (
                          <option key={school.school_id} value={school.school_name}>
                            {school.school_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      solicitud.school_name
                    )}
                  </p>
                  <p>
                    Créditos:{" "}
                    {editingRequestId === solicitud.request_id ? (
                      <input
                        type="number"
                        value={editCredits ?? ""}
                        onChange={(e) => setEditCredits(parseInt(e.target.value))}
                      />
                    ) : (
                      solicitud.credits
                    )}
                  </p>
                  <p>
                    Grupo:{" "}
                    {editingRequestId === solicitud.request_id ? (
                      <input
                        type="number"
                        value={editGroup ?? ""}
                        onChange={(e) => setEditGroup(parseInt(e.target.value))}
                      />
                    ) : (
                      solicitud.group
                    )}
                  </p>
                  {editingRequestId === solicitud.request_id ? (
                    <>
                      <button onClick={handleSaveEdit}>Guardar</button>
                      <button onClick={() => setEditingRequestId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(solicitud)}>Editar</button>
                  )}
                </li>
              ))}
            </ul>
            <label>Seleccionar Profesores:</label>
            <select
              multiple
              value={selectedProfessors.map(String)}
              onChange={handleProfessorSelection}
              className="multi-select"
            >
              {docentes.map((docente) => (
                <option key={docente.teacher_id} value={docente.teacher_id}>
                  {docente.first_name} {docente.last_name}
                </option>
              ))}
            </select>
            <button className="confirm-btn" onClick={handleConfirmAssignments}>
              Confirmar Asignación
            </button>
            <button className="close-button" onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}

      <button onClick={() => router.push('/asignaciones')} className="view-assignments-button">
        Ver Asignaciones
      </button>
    </div>
  );
}
