// app/api/asignaturas/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123", 
  port: 5432,
});

// Manejo de la solicitud GET
export async function GET() {
    try {
      console.log("hola");
        const res = await pool.query('SELECT * FROM courses');
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
        return NextResponse.json({ error: 'Error al obtener las courses' }, { status: 500 });
    }
}

// Manejo de la solicitud POST
// http://localhost:3004/api/asignaturas?course_id=80
export async function POST(request: Request) {
    const body = await request.json();
    const { course_name, credits, semester_id, code } = body;

    try {
        const res = await pool.query(
            'INSERT INTO courses (course_name, credits, semester_id, code) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_name, credits, semester_id, code]
        );
        return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error al agregar la asignatura:', error);
        return NextResponse.json({ error: 'Error al agregar la asignatura' }, { status: 500 });
    }
}

// Manejo de la solicitud PUT
export async function PUT(request: Request) {
    const body = await request.json();
    const { course_id, course_name, credits, semester_id, code } = body;

    try {
        const res = await pool.query(
            'UPDATE courses SET course_name = $1, credits = $2, semester_id = $3, code = $4 WHERE course_id = $5 RETURNING *',
            [, course_id,course_name, credits, semester_id, code,]
        );
        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error('Error al actualizar la asignatura:', error);
        return NextResponse.json({ error: 'Error al actualizar la asignatura' }, { status: 500 });
    }
}


// Manejo de la solicitud DELETE
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const course_id = searchParams.get("course_id");

    if (!course_id) {
        return NextResponse.json({ error: 'course_id es requerido' }, { status: 400 });
    }

    try {
        await pool.query('DELETE FROM courses WHERE course_id = $1', [course_id]);
        return NextResponse.json({ message: 'Asignatura eliminada correctamente' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar la asignatura:', error);
        return NextResponse.json({ error: 'Error al eliminar la asignatura' }, { status: 500 });
    }
}
