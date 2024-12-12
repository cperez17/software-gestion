// pages/api/getCourses.ts
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
        const result = await pool.query(`
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
        `);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json({ error: 'Error fetching assignments' }, { status: 500 });
    }
}
