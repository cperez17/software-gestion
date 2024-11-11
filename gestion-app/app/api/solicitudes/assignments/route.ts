import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

// Endpoint para obtener asignaciones de los profesores con carga calculada
export async function GET(request: Request) {
  try {
    const result = await pool.query(`
      SELECT teacher_id, course_name, HT, HP, RP, factor
      FROM teacher_assignments 
      JOIN courses ON teacher_assignments.course_id = courses.course_id
    `);

    const assignments = result.rows.map((row) => {
      const FacRP = row.RP ? 2 : 1;

      // Asignación de porcentaje hardcodeada
      const percentage = row.course_name === "Curso X" ? 30 : 20; // Cambia "Curso X" y el valor de ejemplo según necesidades

      const totalHours = (row.HT + FacRP * row.HP) * row.factor * (percentage / 100);

      return {
        ...row,
        percentage, // Incluye el porcentaje utilizado
        total_hours: totalHours,
      };
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error al obtener asignaciones:", error);
    return NextResponse.json({ error: "Error al obtener asignaciones" }, { status: 500 });
  }
}
