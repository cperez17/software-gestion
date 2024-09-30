import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import Logout from './logout';
import NavBar from '../components/navbar'; // Import the client-side component

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
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Pass session to the client component */}
        <NavBar session={session} />
        {children}
      </body>
    </html>
  );
}
