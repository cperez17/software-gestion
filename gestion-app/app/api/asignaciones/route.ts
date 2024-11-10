// gestion-app/app/api/asignaciones/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const semester_id = url.searchParams.get("semester_id");

  if (!semester_id) {
    return NextResponse.json({ error: "Parámetro 'semester_id' es requerido" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT
         a.assignment_id,
         CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
         c.course_name,
         s.semester_name,
         a.assigned_date
       FROM teacher_course_assignments a
       JOIN teachers t ON a.teacher_id = t.teacher_id
       JOIN course_requests cr ON cr.assignment_id = a.assignment_id
       JOIN courses c ON cr.course_id = c.course_id
       JOIN semesters s ON a.semester_id = s.semester_id
       WHERE cr.request_status = 'approved' AND a.semester_id = $1`,
      [semester_id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las asignaciones:", error);
    return NextResponse.json({ error: "Error al obtener las asignaciones" }, { status: 500 });
  }
}
