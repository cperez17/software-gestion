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
  const academic_year_id = url.searchParams.get('academic_year_id');

  try {
    const result = await pool.query(`
      SELECT 
        tca.assignment_id,
        tca.course_request_id,
        CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
        t.teacher_id,
        c.course_name,
        c.credits,
        ay.year_name AS academic_year_name,
        tca.assigned_date
      FROM 
        teacher_course_assignments AS tca
      JOIN 
        teachers AS t ON tca.teacher_id = t.teacher_id
      JOIN 
        course_requests AS cr ON tca.course_request_id = cr.request_id
      JOIN 
        courses AS c ON cr.course_id = c.course_id
      JOIN 
        academic_year AS ay ON tca.academic_year_id = ay.academic_year_id
      WHERE 
        ${academic_year_id ? `tca.academic_year_id = ${academic_year_id}` : "1=1"}
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las asignaciones:", error);
    return NextResponse.json({ error: "Error al obtener las asignaciones" }, { status: 500 });
  }
}




export async function POST(request: Request) {
  const { assignment_id } = await request.json();

  try {
    // Paso 1: Eliminar la referencia en `course_requests` estableciendo `assignment_id` a NULL
    await pool.query(
      `UPDATE course_requests
       SET assignment_id = NULL, request_status = 'pending'
       WHERE assignment_id = $1`,
      [assignment_id]
    );

    // Paso 2: Eliminar la asignación en `teacher_course_assignments`
    const deleteResult = await pool.query(
      `DELETE FROM teacher_course_assignments
       WHERE assignment_id = $1`,
      [assignment_id]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: "No se encontró una asignación para eliminar" }, { status: 404 });
    }

    return NextResponse.json({ message: "Asignación eliminada y estado actualizado a pending" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la asignación:", error);
    return NextResponse.json({ error: "Error al eliminar la asignación" }, { status: 500 });
  }
}

