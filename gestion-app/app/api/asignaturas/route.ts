// app/api/asignaturas/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "evaevaeva2", 
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
