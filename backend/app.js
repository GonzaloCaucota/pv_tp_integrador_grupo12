const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

// Permite que Vite/React consuma la API desde otro puerto.
app.use(cors());
// Permite recibir JSON en register, login y favoritos.
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API pv-tp-integrador funcionando" });
});

// Todas las rutas del backend quedan prefijadas con /api.
app.use("/api", usuarioRoutes);

module.exports = app;
