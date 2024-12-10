// gestion-app/components/navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from '../app/logout';
import UserPopup from './userPopup';
import { FaHome, FaBook, FaClipboard, FaUser, FaHistory, FaChartLine, FaSignOutAlt } from 'react-icons/fa'; // Iconos de ejemplo

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavBar({ session }: { session: any }) {
  const pathname = usePathname();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  if (isLoginPage || isRegisterPage) {
    return null;
  }

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsPopupVisible((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Mostrar email del usuario si está logueado */}
        {session ? (
          <span className="userEmail">{session.user?.email}</span>
        ) : null}

        <div className="navLinks">
          {/* Enlaces de navegación solo si el usuario está logueado */}
          {session ? (
            <div className="navGrid">
              <Link href="/inicio" className="navButton">
                <FaHome className="icon" />
                <span>Inicio</span>
              </Link>
              <Link href="/asignaturas" className="navButton">
                <FaBook className="icon" />
                <span>Asignaturas</span>
              </Link>
              <Link href="/solicitud" className="navButton">
                <FaClipboard className="icon" />
                <span>Solicitudes</span>
              </Link>
              <Link href="/docentes" className="navButton">
                <FaUser className="icon" />
                <span>Docentes</span>
              </Link>
              <Link href="/informes" className="navButton">
                <FaChartLine className="icon" />
                <span>Informes</span>
              </Link>
              <Link href="/historico" className="navButton">
                <FaHistory className="icon" />
                <span>Histórico</span>
              </Link>
              <Link href="#" onClick={handleProfileClick} className="navButton">
                <FaUser className="icon" />
                <span>Perfil</span>
              </Link>
              {isPopupVisible && (
                <UserPopup
                  email={session.user?.email}
                  role={session.user?.role}
                  onClose={() => setIsPopupVisible(false)}
                />
              )}
            </div>
          ) : (
            <div className="authLinks">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          )}
        </div>

        {session ? (
          <Logout /> // Usar componente de Logout
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
