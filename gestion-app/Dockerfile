FROM node:18-alpine

WORKDIR /app
ENV NEXTAUTH_SECRET 7ND1V04ydzaqA9WHD3wneKaA0qWhfVCIhFnxvCftXB8=
ENV POSTGRES_URL postgres://default:jA2J3mRbXrMH@ep-silent-night-a4r7wmvh-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require
COPY . .
RUN npm install --production
RUN npm install tailwindcss
RUN npm install next-auth
RUN npm run build

EXPOSE 3004

CMD ["npm","start","--host=3004"]


