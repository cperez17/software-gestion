import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'soft-tech',
  password: 'jera123',
  port: 5432,
});

export async function GET() {
  try {
    const res = await pool.query('SELECT * FROM teachers');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    return NextResponse.json({ error: 'Error al obtener docentes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status } = body;

  try {
    const res = await pool.query(
      'INSERT INTO teachers (first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error al agregar docente:', error);
    return NextResponse.json({ error: 'Error al agregar docente' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacher_id = searchParams.get('id');
  const body = await request.json();
  const { first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status } = body;

  if (!teacher_id) {
    return NextResponse.json({ error: 'Falta el id del docente' }, { status: 400 });
  }

  try {
    const res = await pool.query(
      'UPDATE teachers SET first_name = $1, last_name = $2, email = $3, phone_number = $4, max_credits = $5, rut_login = $6, password = $7, contract = $8, status = $9 WHERE teacher_id = $10 RETURNING *',
      [first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status, teacher_id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el docente:', error);
    return NextResponse.json({ error: 'Error al actualizar el docente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacher_id = searchParams.get('id');

  if (!teacher_id) {
    return NextResponse.json({ error: 'Falta el id del docente' }, { status: 400 });
  }

  try {
    const res = await pool.query('DELETE FROM teachers WHERE teacher_id = $1 RETURNING *', [teacher_id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Docente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el docente:', error);
    return NextResponse.json({ error: 'Error al eliminar el docente' }, { status: 500 });
  }
}
