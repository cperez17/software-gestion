// app/api/docentes/route.ts

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

// Manejo de la solicitud GET para obtener todos los docentes
export async function GET() {
  try {
    const res = await pool.query('SELECT * FROM teachers');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error al obtener los docentes:', error);
    return NextResponse.json({ error: 'Error al obtener los docentes' }, { status: 500 });
  }
}

// Manejo de la solicitud POST para agregar un nuevo docente con todos los campos
export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, last_name, email, phone_number, max_credits, rut_login, password, contract } = body;

  try {
    const res = await pool.query(
      'INSERT INTO teachers (first_name, last_name, email, phone_number, max_credits, rut_login, password, contract) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [first_name, last_name, email, phone_number, max_credits, rut_login, password, contract]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error al agregar el docente:', error);
    return NextResponse.json({ error: 'Error al agregar el docente' }, { status: 500 });
  }
}

// Manejo de la solicitud DELETE para eliminar un docente
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacher_id = searchParams.get('id');

  if (!teacher_id) {
    return NextResponse.json({ error: 'Falta el id del docente' }, { status: 400 });
  }

  try {
    const res = await pool.query('DELETE FROM teachers WHERE teacher_id = $1', [teacher_id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Docente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el docente:', error);
    return NextResponse.json({ error: 'Error al eliminar el docente' }, { status: 500 });
  }
}