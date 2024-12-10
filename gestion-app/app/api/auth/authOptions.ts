import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { Pool } from 'pg';
import type { AuthOptions, SessionStrategy } from 'next-auth'; // Importa SessionStrategy

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'soft-tech',
  password: 'jera123',
  port: 5432,
});

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy, // Asegura que el tipo sea SessionStrategy
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await pool.query('SELECT * FROM users WHERE email = $1', [credentials?.email]);
          const user = res.rows[0];

          if (!user) {
            console.error('Usuario no encontrado');
            return null;
          }

          const passwordCorrect = await compare(credentials?.password || '', user.password);

          if (passwordCorrect) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          } else {
            console.error('Contraseña incorrecta');
            return null;
          }
        } catch (error) {
          console.error('Error en la autenticación:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.role === 'string') {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
