import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../redux/slices/favoritesSlice";

import { Link } from "react-router-dom";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  // Estos favoritos ya vienen desde el backend y se guardan en Redux.
  const favoriteProducts = useSelector((state) => state.favorites.items);
  // Status/error permiten mostrar carga o errores de los thunks.
  const favoritesStatus = useSelector((state) => state.favorites.status);
  const favoritesError = useSelector((state) => state.favorites.error);
  // El id de usuario define de que tabla/relacion se elimina el favorito.
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (productId) => {
    if (currentUser?.id) {
      // Elimina en PostgreSQL y Redux queda con la lista actualizada que responde la API.
      dispatch(
        removeFavorite({
          usuarioId: currentUser.id,
          productoId: productId,
        })
      );
    }
  };

  return (
    <div className="favorites-container">
      <h1>Mis Productos Favoritos</h1>
      {favoritesStatus === "loading" && <p>Cargando favoritos...</p>}
      {favoritesError && <p>{favoritesError}</p>}
      {favoriteProducts.length === 0 ? (
        <p>No tienes productos marcados como favoritos aun.</p>
      ) : (
        <div className="card-container">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="img-card">
                <Link to={`/productos/${product.id}`}>
                  <img src={product.image} alt={product.title} />
                </Link>
              </div>
              <div className="info-card">
                <Link to={`/productos/${product.id}`} className="product-link">
                  <h3>{product.title}</h3>
                </Link>
                <p>Precio: ${product.price}</p>
                <button onClick={() => handleRemoveFavorite(product.id)}>
                  Desmarcar como Favorito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
