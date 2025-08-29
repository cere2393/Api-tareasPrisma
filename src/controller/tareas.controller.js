const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
    const tareas = await prisma.tarea.findMany();
    res.json(tareas);
};

exports.getById = async (req, res) => {
    const tarea = await prisma.tarea.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tarea);
};

exports.create = async (req, res) => {
    const nueva = await prisma.tarea.create({ data: req.body });
    const tareas = await prisma.tarea.findMany();
    res.json(tareas);
};

exports.update = async (req, res) => {
    try {
        const tarea = await prisma.tarea.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json(tarea);
    } catch {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }
};

exports.delete = async (req, res) => {
    try {
        await prisma.tarea.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }
};