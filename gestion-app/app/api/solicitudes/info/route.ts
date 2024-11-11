//gestion-app\app\api\solicitudes\info\route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function POST(request: Request) {
  const { course_name } = await request.json();

  console.log("Nombre del curso recibido:", course_name);

  try {
    // Consulta para obtener todas las solicitudes relacionadas con el nombre del curso, sin filtrar por grupo
    const res = await pool.query(
      `SELECT cr.request_id, s.school_name, c.credits, cr.group
       FROM course_requests cr
       JOIN schools s ON cr.school_id = s.school_id
       JOIN courses c ON cr.course_id = c.course_id
       WHERE unaccent(lower(trim(c.course_name))) = unaccent(lower(trim($1)))`,
      [course_name]
    );

    console.log("Resultados de la consulta SQL:", res.rows);

    if (res.rows.length === 0) {
      console.warn("No se encontraron registros para el curso:", course_name);
    }

    return NextResponse.json({ solicitudes: res.rows });
  } catch (error) {
    console.error("Error al obtener información de solicitudes:", error);
    return NextResponse.json({ error: "Error al obtener información de solicitudes" }, { status: 500 });
  }
}
