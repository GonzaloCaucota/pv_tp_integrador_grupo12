const Usuario = require("../models/Usuario");
const Favorito = require("../models/Favorito");

// Convierte columnas de PostgreSQL al formato que ya usa el front: id, title, price, image, etc.
const formatearFavorito = (favorito) => ({
  id: favorito.productoId,
  title: favorito.titulo,
  price: favorito.precio,
  description: favorito.descripcion,
  category: favorito.categoria,
  image: favorito.imagen,
  rating: favorito.rating,
});

const crearUsuario = async (req, res) => {
  try {
    // Acepta nombre o name para ser compatible con distintos nombres usados en el front.
    const { nombre, name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y password son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(409).json({ mensaje: "El email ya esta registrado" });
    }

    const usuario = await Usuario.create({
      nombre: nombre || name || null,
      email,
      password,
    });

    // Devuelve favoritos vacios porque un usuario nuevo todavia no tiene registros en favoritos.
    return res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      favoritos: [],
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear usuario", error: error.message });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y password son obligatorios" });
    }

    // Incluye favoritos para que el front cargue Redux apenas inicia sesion.
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Favorito, as: "favoritos" }],
    });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ mensaje: "Credenciales invalidas" });
    }

    return res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      favoritos: usuario.favoritos.map(formatearFavorito),
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al iniciar sesion", error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    // Lista usuarios con sus favoritos para revisar toda la relacion desde un endpoint.
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "createdAt", "updatedAt"],
      include: [{ model: Favorito, as: "favoritos" }],
      order: [["id", "ASC"]],
    });

    return res.json(
      usuarios.map((usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        favoritos: usuario.favoritos.map(formatearFavorito),
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
      }))
    );
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    // Busca un usuario puntual y trae sus favoritos relacionados.
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ["id", "nombre", "email", "createdAt", "updatedAt"],
      include: [{ model: Favorito, as: "favoritos" }],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    return res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      favoritos: usuario.favoritos.map(formatearFavorito),
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener usuario", error: error.message });
  }
};

const obtenerFavoritos = async (req, res) => {
  try {
    // Primero valida que el usuario exista antes de consultar sus favoritos.
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Lee directamente desde la tabla favoritos filtrando por usuarioId.
    const favoritos = await Favorito.findAll({
      where: { usuarioId: usuario.id },
      order: [["id", "ASC"]],
    });

    return res.json(favoritos.map(formatearFavorito));
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener favoritos", error: error.message });
  }
};

const agregarFavorito = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    const producto = req.body;

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!producto || !producto.id) {
      return res.status(400).json({ mensaje: "El producto favorito debe tener id" });
    }

    // Evita duplicados antes de crear el registro en PostgreSQL.
    const yaExiste = await Favorito.findOne({
      where: {
        usuarioId: usuario.id,
        productoId: producto.id,
      },
    });

    if (yaExiste) {
      return res.status(409).json({ mensaje: "El producto ya esta en favoritos" });
    }

    // Crea una fila nueva en favoritos con los datos del producto recibido desde React.
    await Favorito.create({
      productoId: producto.id,
      titulo: producto.title,
      precio: producto.price,
      descripcion: producto.description,
      categoria: producto.category,
      imagen: producto.image,
      rating: producto.rating || null,
      usuarioId: usuario.id,
    });

    // Devuelve la lista actualizada para reemplazar el estado de Redux en el front.
    const favoritos = await Favorito.findAll({
      where: { usuarioId: usuario.id },
      order: [["id", "ASC"]],
    });

    return res.status(201).json(favoritos.map(formatearFavorito));
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al agregar favorito", error: error.message });
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Borra solo el favorito del usuario indicado, no afecta a favoritos de otros usuarios.
    await Favorito.destroy({
      where: {
        usuarioId: usuario.id,
        productoId: req.params.productoId,
      },
    });

    // Devuelve la lista actualizada despues de eliminar.
    const favoritos = await Favorito.findAll({
      where: { usuarioId: usuario.id },
      order: [["id", "ASC"]],
    });

    return res.json(favoritos.map(formatearFavorito));
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar favorito", error: error.message });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
};
