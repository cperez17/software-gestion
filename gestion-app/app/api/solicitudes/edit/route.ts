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
  const { request_id, credits, group, school_name } = await request.json();

  try {
    // Get school_id from school_name
    const schoolResult = await pool.query(
      `SELECT school_id FROM schools WHERE unaccent(lower(trim(school_name))) = unaccent(lower(trim($1)))`,
      [school_name]
    );

    if (schoolResult.rows.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const school_id = schoolResult.rows[0].school_id;

    // Update the course request with the new values
    await pool.query(
      `UPDATE course_requests
       SET credits = $1, group = $2, school_id = $3
       WHERE request_id = $4`,
      [credits, group, school_id, request_id]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al editar la solicitud:", error);
    return NextResponse.json({ error: "Error al editar la solicitud" }, { status: 500 });
  }
}
