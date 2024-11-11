// gestion-app/app/api/asignaciones/edit/route.ts

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
  try {
    const { assignment_id, teacher_name, course_name } = await request.json();

    if (!assignment_id || !teacher_name || !course_name) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Buscar el ID del profesor a partir del nombre
    const teacherResult = await pool.query(
      `SELECT teacher_id FROM teachers WHERE CONCAT(first_name, ' ', last_name) = $1`,
      [teacher_name]
    );

    if (teacherResult.rows.length === 0) {
      return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 });
    }

    const teacher_id = teacherResult.rows[0].teacher_id;

    // Buscar el ID del curso a partir del nombre
    const courseResult = await pool.query(
      `SELECT course_id FROM courses WHERE course_name = $1`,
      [course_name]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const course_id = courseResult.rows[0].course_id;

    // Actualizar la asignación en `teacher_course_assignments`
    await pool.query(
      `UPDATE teacher_course_assignments
       SET teacher_id = $1
       WHERE assignment_id = $2`,
      [teacher_id, assignment_id]
    );

    // Actualizar la solicitud de curso en `course_requests`
    await pool.query(
      `UPDATE course_requests
       SET course_id = $1
       WHERE assignment_id = $2`,
      [course_id, assignment_id]
    );

    return NextResponse.json({ message: "Asignación actualizada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al editar la asignación:", error);
    return NextResponse.json({ error: "Error al editar la asignación" }, { status: 500 });
  }
}
