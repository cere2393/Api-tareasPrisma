import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* GET /tareas -> lista todas las tareas */
app.get("/tareas", async (req, res) => {
    try {
        const tareas = await prisma.task.findMany({ orderBy: { id: "asc" } });
        res.json(tareas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo tareas" });
    }
});

/* GET /tareas/:id -> devuelve la tarea o 404 */
app.get("/tareas/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const tarea = await prisma.task.findUnique({ where: { id } });
        if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
        res.json(tarea);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo la tarea" });
    }
});

/* POST /tareas -> crea y devuelve todas las tareas incluyendo la nueva */
app.post("/tareas", async (req, res) => {
    const { titulo, descripcion, completada } = req.body || {};
    if (!titulo) return res.status(400).json({ error: "titulo es requerido" });

    try {
        await prisma.task.create({
            data: { titulo, descripcion, completada: Boolean(completada) }
        });
        const tareas = await prisma.task.findMany({ orderBy: { id: "asc" } });
        res.status(201).json(tareas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creando la tarea" });
    }
});

/* PUT /tareas/:id -> actualiza y devuelve la tarea modificada (404 si no existe) */
app.put("/tareas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descripcion, completada } = req.body || {};
    try {
        const updated = await prisma.task.update({
            where: { id },
            data: {
                ...(titulo !== undefined ? { titulo } : {}),
                ...(descripcion !== undefined ? { descripcion } : {}),
                ...(completada !== undefined ? { completada: Boolean(completada) } : {})
            }
        });
        res.json(updated);
    } catch (e) {
        console.error(e);
        // Prisma error cuando no encuentra el registro al actualizar
        if (e?.code === "P2025") return res.status(404).json({ error: "Tarea no encontrada" });
        res.status(500).json({ error: "Error actualizando la tarea" });
    }
});

/* DELETE /tareas/:id -> elimina la tarea (404 si no existe) */
app.delete("/tareas/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.task.delete({ where: { id } });
        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        if (e?.code === "P2025") return res.status(404).json({ error: "Tarea no encontrada" });
        res.status(500).json({ error: "Error eliminando la tarea" });
    }
});

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
