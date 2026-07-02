import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFavorites } from "../redux/slices/favoritesSlice";
import { loginUser } from "../redux/slices/userSlice";
import { iniciarSesion } from "../services/api";

import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contrasena.");
      return;
    }

    try {
      // Login contra el backend: devuelve usuario con id de PostgreSQL y sus favoritos.
      const usuario = await iniciarSesion({ email, password });

      // Guarda la sesion local para que PrivateRoute pueda proteger las rutas.
      dispatch(loginUser(usuario));
      // Carga en Redux los favoritos recibidos desde la tabla favoritos.
      dispatch(setFavorites(usuario.favoritos || []));
      navigate("/");
    } catch (err) {
      setError(err.message || "Ocurrio un error al intentar iniciar sesion.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Iniciar Sesion</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="email">Correo Electronico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contrasena:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>
          <button type="submit">Iniciar Sesion</button>
        </form>
        <p>
          No tienes una cuenta?{" "}
          <span onClick={() => navigate("/register")}>Registrate aqui</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
