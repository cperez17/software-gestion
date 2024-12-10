'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from '../app/logout';
import UserPopup from './userPopup';
import { FaHome, FaBook, FaClipboard, FaUser, FaHistory, FaChartLine } from 'react-icons/fa'; // Iconos de ejemplo

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavBar({ session }: { session: any }) {
  const pathname = usePathname();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Ocultar navbar en páginas específicas
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isInformesSolicitudPage = pathname === '/informesSolicitud';

  if (isLoginPage || isRegisterPage || isInformesSolicitudPage) {
    return null;
  }

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsPopupVisible((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {session ? (
          <>
            <span className="adminLabel">
              {session.user?.email} ({session.user?.role || 'general'})
            </span>

            <div className="navLinks">
              <div className="navGrid">
                <Link href="/inicio" className="navButton">
                  <FaHome className="icon" />
                  <span>Inicio</span>
                </Link>
                <Link href="/asignaturas" className="navButton">
                  <FaBook className="icon" />
                  <span>Asignaturas</span>
                </Link>
                <Link href="/docentes" className="navButton">
                  <FaUser className="icon" />
                  <span>Docentes</span>
                </Link>
                {session.user?.role === 'admin' && (
                  <Link href="/solicitud" className="navButton">
                    <FaClipboard className="icon" />
                    <span>Solicitudes</span>
                  </Link>
                )}
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
            </div>

            <Logout /> {/* Usar componente de Logout */}
          </>
        ) : (
          <div className="authLinks">
            <Link href="/login" className="navButton">Login</Link>
            <Link href="/register" className="navButton">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
