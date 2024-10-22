import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123", 
  port: 5432,
});

// Manejo de la solicitud GET para obtener profesores
export async function GET() {
  try {
    const res = await pool.query('SELECT * FROM teachers');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return NextResponse.json({ error: 'Error al obtener los profesores' }, { status: 500 });
  }
}

// Manejo de la solicitud POST para asignar profesor a una asignatura
export async function POST(request: Request) {
  const { course_name, school_name, teacher_id } = await request.json();

  try {
    const res = await pool.query(
      `INSERT INTO teacher_course_assignments (teacher_id, course_id, assigned_date, semester_id)
       VALUES ($1, 
               (SELECT course_id FROM courses WHERE course_name = $2 AND school_id = (SELECT school_id FROM schools WHERE school_name = $3)),
               CURRENT_DATE, 1)`, // Puedes ajustar el "semester_id" según sea necesario
      [teacher_id, course_name, school_name]
    );

    return NextResponse.json({ message: 'Profesor asignado correctamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al asignar profesor:', error);
    return NextResponse.json({ error: 'Error al asignar profesor' }, { status: 500 });
  }
}
