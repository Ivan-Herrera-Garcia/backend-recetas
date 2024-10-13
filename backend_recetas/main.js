import { Application, Router } from "https://deno.land/x/oak@v17.1.0/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

// Configuración de conexión a MongoDB Atlas manualmente
const client = new MongoClient();
await client.connect({
  db: "HextechIt",  // Nombre de la base de datos
  tls: true,
  servers: [
        {
        host: "hextechit-shard-00-02.nxlay.mongodb.net",
        port: 27017,
        },
    ],
  credential: {
    username: "user",  // Usuario de MongoDB
    password: "contrasena123",  // Reemplaza <db_password> con tu contraseña
    db: "admin",
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database("nombreBaseDatos");
const recetasCollection = db.collection("recetas");

const app = new Application();
const router = new Router();

// Endpoint GET con paginación de recetas
router.get("/recetas", async (context) => {
    console.log("Petición recibida para /recetas");
    const page = parseInt(context.request.url.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
  
    const recetas = await recetasCollection.find({}, { skip, limit }).toArray();
    
    console.log(`Retornando ${recetas.length} recetas`);
    context.response.body = recetas;
});

router.get("/", (context) => {
    context.response.body = "Bienvenido al API de Recetas";
});

app.use(router.routes());
app.use(router.allowedMethods());

// Iniciar el servidor en el puerto 8000
console.log("Servidor corriendo en http://localhost:8000");
await app.listen({ port: 8000 });