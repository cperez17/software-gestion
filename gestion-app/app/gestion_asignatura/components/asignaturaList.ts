import React from 'react';

export default function AsignaturaList() {
  const [asignaturas, setAsignaturas] = useState([]);

  // Llamada a la API para obtener las asignaturas
  useEffect(() => {
    fetch('/api/asignaturas')
      .then((response) => response.json())
      .then((data) => setAsignaturas(data));
  }, []);

  return (
    <div>
      <h2>Lista de Asignaturas</h2>
      <ul>
        {asignaturas.map((asignatura) => (
          <li key={asignatura.course_id}>
            {asignatura.course_name} - {asignatura.credits} créditos
          </li>
        ))}
      </ul>
    </div>
  );
}
