import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/authOptions'; // Importar authOptions
import NavBar from '../components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de gestión',
  description: 'aplicación creada para gestionar',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  console.log('Sesión en layout:', session);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar session={session} />
        {children}
      </body>
    </html>
  );
}
