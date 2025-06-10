# Dockerfile
FROM node:18

WORKDIR /app

ENV NEXTAUTH_SECRET=7ND1V04ydzaqA9WHD3wneKaA0qWhfVCIhFnxvCftXB8=
# Conecta usando el puerto interno 5432
ENV POSTGRES_URL=postgres://postgres:jera123@db:5432/soft-tech

COPY . .

RUN npm install --production
RUN npm install tailwindcss
RUN npm install next-auth
RUN npm install playwright && npx playwright install --with-deps

RUN npm run build

EXPOSE 3004


CMD ["npm", "start"]
