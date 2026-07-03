// URL base del backend. Se puede cambiar con VITE_API_URL sin tocar el codigo.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Wrapper comun para todos los fetch: agrega JSON, parsea respuesta y muestra errores del backend.
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.mensaje || "Error al conectar con el servidor");
  }

  return data;
};

export const registrarUsuario = (usuario) =>
  // Crea usuario en PostgreSQL desde RegisterPage.
  request("/register", {
    method: "POST",
    body: JSON.stringify(usuario),
  });

export const iniciarSesion = (credenciales) =>
  // Valida email/password y devuelve usuario con favoritos.
  request("/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });

export const obtenerFavoritos = (usuarioId) =>
  // Carga favoritos del usuario logueado desde la tabla favoritos.
  request(`/usuarios/${usuarioId}/favoritos`);

export const agregarFavoritoUsuario = (usuarioId, producto) =>
  // Inserta una fila en favoritos para el usuario indicado.
  request(`/usuarios/${usuarioId}/favoritos`, {
    method: "POST",
    body: JSON.stringify(producto),
  });

export const eliminarFavoritoUsuario = (usuarioId, productoId) =>
  // Elimina una fila de favoritos usando usuarioId + productoId.
  request(`/usuarios/${usuarioId}/favoritos/${productoId}`, {
    method: "DELETE",
  });
