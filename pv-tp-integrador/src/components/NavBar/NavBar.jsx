import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearFavorites } from "../../redux/slices/favoritesSlice";
import { logoutUser } from "../../redux/slices/userSlice";

import "./NavBar.css";

const NavBar = () => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Cierra la sesion local.
    dispatch(logoutUser());
    // Limpia favoritos de Redux para que no queden datos del usuario anterior.
    dispatch(clearFavorites());
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="nav-bar">
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? "X" : "Menu"}
      </div>

      <div className={`links ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/favorites" onClick={() => setMenuOpen(false)}>
              Favoritos
            </Link>
          </li>
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Iniciar Sesion
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {isAuthenticated && currentUser && (
        <div className="user-info">
          <span>
            {/* El backend devuelve nombre; name queda como fallback por compatibilidad. */}
            Bienvenido, {currentUser.nombre || currentUser.name || currentUser.email}
          </span>
          <button onClick={handleLogout}>Cerrar Sesion</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
