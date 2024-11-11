// gestion-app/app/api/confirmar-asignacion/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function PUT(request: Request) {
  const { course_id, teacher_ids, semester_id, group } = await request.json();

  if (!teacher_ids || teacher_ids.length === 0) {
    return NextResponse.json({ error: "No se seleccionaron profesores" }, { status: 400 });
  }

  try {
    await pool.query('BEGIN');

    // Insertar asignaciones de profesores y obtener `assignment_id`
    for (const teacher_id of teacher_ids) {
      const result = await pool.query(
        `INSERT INTO teacher_course_assignments (teacher_id, assigned_date, semester_id)
         VALUES ($1, NOW(), $2)
         RETURNING assignment_id`,
        [teacher_id, semester_id]
      );

      const assignment_id = result.rows[0].assignment_id;

      // Actualizar el estado de todas las solicitudes relacionadas con `course_id` y `group`
      await pool.query(
        `UPDATE course_requests
         SET assignment_id = $1, request_status = 'approved'
         WHERE course_id = $2 AND "group" = $3 AND request_status = 'pending'`,
        [assignment_id, course_id, group]
      );
    }

    await pool.query('COMMIT');

    return NextResponse.json({ message: "Profesores asignados y solicitudes aprobadas" }, { status: 200 });
  } catch (error) {
    console.error("Error al confirmar la asignación:", error);
    await pool.query('ROLLBACK');
    return NextResponse.json({ error: "Error al confirmar la asignación" }, { status: 500 });
  }
}
