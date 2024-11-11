// gestion-app/app/api/solicitudes/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

// Endpoint para agregar o listar solicitudes
export async function POST(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.endsWith('/solicitudes')) {
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error("Error al parsear JSON de la solicitud:", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { asignaturas, semester_id } = requestData;

    if (!Array.isArray(asignaturas) || typeof semester_id !== "number") {
      console.error("Formato de datos inválido:", { asignaturas, semester_id });
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    try {
      for (const asignatura of asignaturas) {
        const { course_name, school_name, group } = asignatura;

        console.log(`Procesando asignatura: ${course_name}, escuela: ${school_name}, grupo: ${group}`);

        // Obtener course_id y verificar que el curso pertenece al semestre correcto
        const courseResult = await pool.query(
          `SELECT course_id FROM courses 
           WHERE unaccent(lower(trim(course_name))) = unaccent(lower(trim($1)))
           AND semester_id = $2`,
          [course_name, semester_id]
        );

        if (courseResult.rows.length === 0) {
          console.error(`Curso no encontrado o no pertenece al semestre especificado: ${course_name}`);
          continue;
        }

        const course_id = courseResult.rows[0].course_id;

        // Obtener school_id desde la tabla schools usando school_name
        const schoolResult = await pool.query(
          `SELECT school_id FROM schools WHERE unaccent(lower(trim(school_name))) = unaccent(lower(trim($1)))`,
          [school_name]
        );

        if (schoolResult.rows.length === 0) {
          console.error(`Escuela no encontrada: ${school_name}`);
          continue;
        }

        const school_id = schoolResult.rows[0].school_id;

        // Verificar si ya existe una solicitud con los mismos parámetros
        const existingRequest = await pool.query(
          `SELECT request_status FROM course_requests
           WHERE course_id = $1 AND school_id = $2 AND "group" = $3`,
          [course_id, school_id, group]
        );

        if (existingRequest.rows.length > 0) {
          // Si la solicitud ya existe, mantiene el estado actual y no lo cambia a "pending"
          const currentStatus = existingRequest.rows[0].request_status;
          await pool.query(
            `UPDATE course_requests 
             SET request_status = $1
             WHERE course_id = $2 AND school_id = $3 AND "group" = $4`,
            [currentStatus, course_id, school_id, group]
          );
          console.log(`Solicitud existente actualizada sin cambiar el estado: ${currentStatus}`);
        } else {
          // Si no existe, insertar como "pending"
          await pool.query(
            `INSERT INTO course_requests (course_id, school_id, request_status, "group", assignment_id)
             VALUES ($1, $2, 'pending', $3, NULL)`,
            [course_id, school_id, group]
          );
          console.log(`Nueva solicitud insertada como pendiente: course_id=${course_id}, school_id=${school_id}, group=${group}`);
        }
      }

      return NextResponse.json({ message: "Solicitudes procesadas correctamente" }, { status: 201 });
    } catch (error) {
      console.error("Error al agregar las solicitudes:", error);
      return NextResponse.json({ error: "Error al agregar las solicitudes" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Ruta no válida" }, { status: 404 });
}

// Endpoint para obtener solicitudes basadas en el año y semestre
export async function GET(request: Request) {
  const url = new URL(request.url);
  const semester_id = url.searchParams.get('semester_id');

  if (!semester_id) {
    return NextResponse.json({ error: "Parámetro 'semester_id' es requerido" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT cr.request_id, c.course_id, c.course_name, s.school_name, cr.group, cr.request_status, c.credits
       FROM course_requests cr
       JOIN courses c ON cr.course_id = c.course_id
       JOIN schools s ON cr.school_id = s.school_id
       WHERE c.semester_id = $1`,
      [semester_id]
    );

    return NextResponse.json({ solicitudes: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return NextResponse.json({ error: "Error al obtener las solicitudes" }, { status: 500 });
  }
}


// Endpoint para eliminar una solicitud específica
export async function DELETE(request: Request) {
  const { request_id } = await request.json();

  try {
    await pool.query(
      `DELETE FROM course_requests WHERE request_id = $1`,
      [request_id]
    );

    return NextResponse.json({ message: "Solicitud eliminada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return NextResponse.json({ error: "Error al eliminar la solicitud" }, { status: 500 });
  }
}
