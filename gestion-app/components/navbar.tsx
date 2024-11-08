
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from '../app/logout';
import UserPopup from './userPopup'; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavBar({ session }: { session: any }) {
  const pathname = usePathname();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  if (isLoginPage||isRegisterPage) {
    return null;
  }

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    setIsPopupVisible((prev) => !prev);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 relative">
      <div className="flex justify-between items-center">
        <span className="font-bold">Administrador</span>

        {/* Show user email if logged in */}
        {session ? (
          <span className="mr-4">{session.user?.email}</span>
        ) : null}

        <div className="space-x-4">
          {/* Navigation links visible only when logged in */}
          {session ? (
            <>
              <Link href="/inicio">Inicio</Link>
              <Link href="/asignaturas">Asignaturas</Link>
              <Link href="/solicitud">Solicitudes</Link>
              <Link href="/docentes">Planta Docente</Link>            
              <Link href="/informes">Informes</Link>
              <Link href="/historico">Histórico</Link>
              <Link href="#" onClick={handleProfileClick}>
                Perfil
              </Link>
              {isPopupVisible && (
                <UserPopup
                  email={session.user?.email}
                  role={session.user?.role} // Assuming the role is also stored in the session
                  onClose={() => setIsPopupVisible(false)}
                />
              )}
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>

        {session ? (
          <Logout /> // Use the Logout component here
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
