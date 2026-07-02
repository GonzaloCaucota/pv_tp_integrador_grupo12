import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoritesSlice";

import {
  selectProductById,
  selectProductsStatus,
} from "../redux/slices/productsSlice";

import "./ProductDetailPage.css";

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productIdNum = parseInt(id, 10);

  const productFromRedux = useSelector((state) =>
    selectProductById(state, productIdNum)
  );
  const productsStatus = useSelector(selectProductsStatus);

  const [product, setProduct] = useState(productFromRedux);
  const [loading, setLoading] = useState(
    !productFromRedux && productsStatus !== "succeeded"
  );
  const [error, setError] = useState(null);

  // Lista actual de favoritos sincronizada con PostgreSQL.
  const favoriteItems = useSelector((state) => state.favorites.items);
  // Usuario logueado; su id se usa para operar contra /usuarios/:id/favoritos.
  const currentUser = useSelector((state) => state.user.currentUser);
  const isCurrentProductFavorite = favoriteItems.some(
    (fav) => String(fav.id) === String(id) // Mantener la comparación como string para seguridad
  );

  const handleToggleFavorite = () => {
    // Desde el detalle tambien se persiste el favorito en backend, no solo en Redux.
    if (product && currentUser?.id) {
      if (isCurrentProductFavorite) {
        // Borra el favorito de la tabla favoritos para este usuario.
        dispatch(
          removeFavorite({
            usuarioId: currentUser.id,
            productoId: product.id,
          })
        );
      } else {
        // Guarda el producto actual como fila nueva en favoritos.
        dispatch(
          addFavorite({
            usuarioId: currentUser.id,
            producto: product,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (productFromRedux) {
      setProduct(productFromRedux);
      setLoading(false);
      setError(null);
      return;
    }

    if (!id) {
      setLoading(false);
      setError("No se proporcionó un ID de producto en la URL.");
      return;
    }

    const fetchProductDetailsFromAPI = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`); // Aquí se usa fetch

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Producto no encontrado en la API.");
          } else {
            throw new Error(
              `Error al cargar los datos: ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(
          "Hubo un error al obtener los detalles del producto:",
          err
        );
        setError(err.message || "No se pudo cargar el producto de la API.");
      } finally {
        setLoading(false);
      }
    };

    if (
      !productFromRedux &&
      !loading &&
      !error &&
      productsStatus !== "loading"
    ) {
      fetchProductDetailsFromAPI();
    }
  }, [id, productFromRedux, productsStatus, loading, error]); // Dependencias del useEffect

  // Renderizado condicional basado en los estados
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Cargando detalles del producto...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Producto no encontrado.
        <br />
        <Link to="/">Volver a la lista de productos</Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="imagen">
        <div className="product-button">
          <Link to={"/"} className="button-link">
            <button>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </Link>
        </div>
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <div className="nombre">
          <h2>{product.title}</h2>
          <button
            onClick={handleToggleFavorite}
            className={`favorite-toggle-button ${
              isCurrentProductFavorite ? "is-favorite" : ""
            }`}
          >
            {isCurrentProductFavorite ? (
              <i className="fa-solid fa-heart"></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
          </button>
        </div>
        <div className="product-details-container">
          <div className="prices">
            <p className="current-price">
              USD {product.price ? product.price.toFixed(2) : "N/A"}
            </p>
            <p className="product-stock">
              Stock: {product.rating ? product.rating.count : "N/A"}
            </p>
            <p className="product-category">
              Categoría: {product.category ? product.category : "N/A"}
            </p>
          </div>
          <div className="product-description-section">
            <p className="label-text">Descripción</p>
            <p>{product.description}</p>
          </div>
          <Link to={`/edit-product/${product.id}`} className="edit-button-link">
            <button className="edit-product-button">
              <i className="fa-solid fa-edit"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
