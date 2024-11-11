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
    for (const teacher_id of teacher_ids) {
      // Obtener el `course_id` de uno de los `request_ids` (suponemos que es el mismo en todos)
      const { rows: courseRows } = await pool.query(`
        SELECT course_id 
        FROM course_requests 
        WHERE request_id = $1
        LIMIT 1
      `, [request_ids[0]]);
      const course_id = courseRows[0]?.course_id;

      if (!course_id) {
        return NextResponse.json({ error: "No se encontró un curso válido para los request_ids proporcionados" }, { status: 400 });
      }

      // Buscar un `assignment_id` compartido para el `course_id`, `semester_id` y `teacher_id`
      const { rows: existingAssignments } = await pool.query(`
        SELECT assignment_id 
        FROM teacher_course_assignments 
        WHERE course_request_id IN (
          SELECT request_id 
          FROM course_requests 
          WHERE course_id = $1 AND semester_id = $2
        ) AND teacher_id = $3
        LIMIT 1
      `, [course_id, semester_id, teacher_id]);

      let sharedAssignmentId = existingAssignments[0]?.assignment_id;

      // Si no existe, crear un nuevo `assignment_id`
      if (!sharedAssignmentId) {
        const result = await pool.query(
          `INSERT INTO teacher_course_assignments (teacher_id, assigned_date, semester_id, course_request_id)
           VALUES ($1, NOW(), $2, $3)
           RETURNING assignment_id`,
          [teacher_id, semester_id, request_ids[0]]
        );
        sharedAssignmentId = result.rows[0].assignment_id;
      }

      // Asignar el `sharedAssignmentId` a todos los `request_ids` relacionados
      for (const request_id of request_ids) {
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