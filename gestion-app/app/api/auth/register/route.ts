// gestion-app/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Pool } from 'pg';

// Configuración del pool de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db', // Nombre del servicio en docker-compose
  database: 'soft-tech',
  password: 'jera123',
  port: 5432,
});

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    console.log({ email, password, role });

    // Validar que el rol sea 'admin' o 'general'
    if (!['admin', 'general'].includes(role)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      `INSERT INTO users (email, password, role) VALUES ($1, $2, $3)`,
      [email, hashedPassword, role]
    );

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500 });
  }
}
