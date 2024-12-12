import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Obtener el token de sesión usando next-auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Obtener la URL de la solicitud actual
  const url = req.nextUrl.clone();

  // Lista de rutas que requieren rol admin
  const adminPaths = ['/register', '/admin-dashboard', '/solicitud', '/asignaciones'];

  // Si no hay token (usuario no autenticado), redirigir al login
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Verificar si la ruta actual es una de las que requieren rol admin
  if (adminPaths.some((path) => url.pathname.startsWith(path))) {
    if (token.role !== 'admin') {
      // Redirigir al login si el usuario no tiene el rol admin
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Permitir el paso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/register/:path*',
    '/admin-dashboard/:path*',
    '/solicitud/:path*',
    '/asignaciones/:path*',
  ],
};
