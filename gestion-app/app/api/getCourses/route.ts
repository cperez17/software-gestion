import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123",
  port: 5432,
});

export async function GET(req: Request) {
    const url = new URL(req.url);
    const teacher = url.searchParams.get('teacher');
    const academicYear = url.searchParams.get('academicYear');
  
    try {
      let query = `
        SELECT 
          tca.assignment_id,
          tca.course_request_id,
          tca.teacher_id,
          CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
          c.course_name,
          c.credits,
          ac.semester_name,
          tca.assigned_date,
          c.code
        FROM 
          teacher_course_assignments tca
        INNER JOIN 
          teachers t ON tca.teacher_id = t.teacher_id
        INNER JOIN 
          course_requests cr ON tca.course_request_id = cr.request_id
        INNER JOIN 
          courses c ON cr.course_id = c.course_id
        INNER JOIN 
          academic_year ac ON ac.academic_year_id = tca.academic_year_id
        WHERE 1=1
      `;
  
      const params = [];
      if (teacher) {
        query += ` AND CONCAT(t.first_name, ' ', t.last_name) ILIKE $${params.length + 1}`;
        params.push(`%${teacher}%`);
      }
  
      if (academicYear) {
        query += ` AND ac.academic_year_id = $${params.length + 1}`;
        params.push(academicYear);
      }
  
      const result = await pool.query(query, params);
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return NextResponse.json({ error: 'Error fetching assignments' }, { status: 500 });
    }
  }
  