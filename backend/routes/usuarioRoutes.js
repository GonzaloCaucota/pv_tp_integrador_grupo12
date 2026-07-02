const express = require("express");
const {
  agregarFavorito,
  crearUsuario,
  eliminarFavorito,
  loginUsuario,
  obtenerFavoritos,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} = require("../controllers/usuarioController");

const router = express.Router();

// Registro e inicio de sesion consumidos por RegisterPage y LoginPage.
router.post("/register", crearUsuario);
router.post("/login", loginUsuario);

// Endpoints de consulta de usuarios con sus favoritos.
router.get("/usuarios", obtenerUsuarios);
router.get("/usuarios/:id", obtenerUsuarioPorId);

// Endpoints que trabajan contra la tabla favoritos en PostgreSQL.
router.get("/usuarios/:id/favoritos", obtenerFavoritos);
router.post("/usuarios/:id/favoritos", agregarFavorito);
router.delete("/usuarios/:id/favoritos/:productoId", eliminarFavorito);

module.exports = router;
