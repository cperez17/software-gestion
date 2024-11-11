FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Configura variables de entorno
ENV NEXTAUTH_SECRET 7ND1V04ydzaqA9WHD3wneKaA0qWhfVCIhFnxvCftXB8=
ENV POSTGRES_URL postgres://default:jA2J3mRbXrMH@ep-silent-night-a4r7wmvh-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require

# Copia todos los archivos al contenedor
COPY . .

# Instala dependencias necesarias
RUN npm install --production
RUN npm install tailwindcss
RUN npm install next-auth

# Instala Playwright y descarga los navegadores necesarios
RUN npm install playwright && npx playwright install --with-deps

# Construye la aplicación
RUN npm run build

# Expone el puerto para el contenedor
EXPOSE 3004

# Comando para iniciar la aplicación
CMD ["npm", "start", "--host=3004"]
