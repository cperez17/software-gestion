//docker-compose exec nextapp node app/api/db.js
import pkg from 'pg'; // Importa el módulo pg como un paquete por defecto
const { Client } = pkg; // Desestructura Client del paquete

const client = new Client({
  user: "postgres",
  host: "db",
  database: "soft-tech",
  password: "jera123", 
  port: 4004,
});

client.connect()
  .then(async () => {
    console.log("Conectado a la base de datos");
    
    // Consulta de prueba: selecciona todos los registros de una tabla
  })
  .catch(err => console.error("Error al conectar a la base de datos", err))
  .finally(() => client.end()); 

export default client;