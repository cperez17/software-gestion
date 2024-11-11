//gestion-app\app\api\solicitudes\delete\route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function DELETE(request: Request) {
  const { request_id } = await request.json();

  try {
    await pool.query(
      `DELETE FROM course_requests WHERE request_id = $1`,
      [request_id]
    );

    return NextResponse.json({ message: "Solicitud eliminada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return NextResponse.json({ error: "Error al eliminar la solicitud" }, { status: 500 });
  }
}
