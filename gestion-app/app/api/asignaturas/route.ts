// app/api/asignaturas/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const asignaturas = [
    { id: 1, nombre: 'Matemáticas', creditos: 4 },
    { id: 2, nombre: 'Física', creditos: 3 },
  ];

  return NextResponse.json(asignaturas);
}