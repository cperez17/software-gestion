import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function GET() {
  try {
    const res = await pool.query(`SELECT school_id, school_name FROM schools`);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error al obtener escuelas:", error);
    return NextResponse.json({ error: "Error al obtener escuelas" }, { status: 500 });
  }
}
