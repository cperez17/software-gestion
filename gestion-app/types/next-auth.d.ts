import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    email: string;
    role: string; // Añadir la propiedad 'role' al tipo User
  }

  interface Session {
    user: {
      id: number;
      email: string;
      role: string; // Añadir la propiedad 'role' al tipo Session User
    };
  }

  interface JWT {
    id: number;
    email: string;
    role: string; // Añadir la propiedad 'role' al tipo JWT
  }
}
