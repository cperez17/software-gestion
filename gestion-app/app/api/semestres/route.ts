import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: "postgres",
    host: "db",
    database: "soft-tech",
    password: "jera123", 
    port: 5432,
  });

export async function GET(){
    try {
      // Realizar la consulta a la base de datos para obtener los semestres
      const res = await pool.query('SELECT semester_id, semester_num, semester_name FROM semesters');
      return NextResponse.json(res.rows);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error al obtener los semestres' }, { status: 500 });
  }
}
