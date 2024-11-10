// gestion-app/app/api/solicitudes/profesores-disponibles/route.ts

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
  const { course_id, group } = await request.json();

  try {
    // Obtener los profesores que ya están asignados a la misma asignatura y grupo
    const assignedTeachers = await pool.query(
      `SELECT tca.teacher_id
       FROM teacher_course_assignments tca
       JOIN course_requests cr ON tca.assignment_id = cr.assignment_id
       WHERE cr.course_id = $1 AND cr.group = $2`,
      [course_id, group]
    );

    const assignedTeacherIds = assignedTeachers.rows.map(row => row.teacher_id);

    // Obtener los profesores que no están en la lista de asignados
    const availableTeachers = await pool.query(
      `SELECT teacher_id, first_name, last_name
       FROM teachers
       WHERE teacher_id NOT IN (${assignedTeacherIds.join(', ')})`
    );

    return NextResponse.json(availableTeachers.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener profesores disponibles:", error);
    return NextResponse.json({ error: "Error al obtener profesores disponibles" }, { status: 500 });
  }
}
