require('dotenv').config();
const express = require('express');
const tareasRoutes = require('./routes/tareas.routes');

const app = express();
app.use(express.json());
app.use('/tareas', tareasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});