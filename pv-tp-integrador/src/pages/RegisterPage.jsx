import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";

import "./RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("El formato del correo electronico no es valido.");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("La contrasena y la confirmacion no coinciden.");
      return;
    }

    try {
      // Registro contra el backend: crea una fila en la tabla usuarios.
      await registrarUsuario({
        nombre: name,
        email,
        password,
      });

      setSuccess("Registro exitoso. Seras redirigido al login.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al registrar usuario. Intente de nuevo.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Registro de Usuario</h2>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div>
            <label htmlFor="name">Nombre (Opcional):</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword">Confirmar Contrasena:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
        <p>
          Ya tienes una cuenta?{" "}
          <span onClick={() => navigate("/login")}>Inicia sesion aqui</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
