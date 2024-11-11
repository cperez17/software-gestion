// gestion-app/app/api/solicitudes/asignar-profesor/route.ts

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
  const { request_ids, teacher_ids, semester_id } = await request.json();

  if (!teacher_ids || teacher_ids.length === 0 || !request_ids || request_ids.length === 0) {
    return NextResponse.json({ error: "No se seleccionaron profesores o solicitudes" }, { status: 400 });
  }

  try {
    // Procesar cada `request_id`
    for (const request_id of request_ids) {
      let sharedAssignmentId;

      // Procesar cada `teacher_id`
      for (const teacher_id of teacher_ids) {
        // Insertar en `teacher_course_assignments` y obtener el `assignment_id` generado
        const result = await pool.query(
          `INSERT INTO teacher_course_assignments (teacher_id, assigned_date, semester_id, course_request_id)
           VALUES ($1, NOW(), $2, $3)
           RETURNING assignment_id`,
          [teacher_id, semester_id, request_id]
        );

        const assignment_id = result.rows[0].assignment_id;

        // Almacenar el `assignment_id` compartido para todos los profesores
        if (!sharedAssignmentId) {
          sharedAssignmentId = assignment_id;
        }

        // Actualizar `course_requests` con el `assignment_id` compartido
        await pool.query(
          `UPDATE course_requests
           SET assignment_id = $1, request_status = 'approved'
           WHERE request_id = $2`,
          [sharedAssignmentId, request_id]
        );
      }
    }

    return NextResponse.json({ message: "Profesores asignados y solicitudes aprobadas" }, { status: 200 });
  } catch (error) {
    console.error("Error al asignar los profesores:", error);
    return NextResponse.json({ error: "Error al asignar los profesores" }, { status: 500 });
  }
}