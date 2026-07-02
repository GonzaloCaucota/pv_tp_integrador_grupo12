import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  agregarFavoritoUsuario,
  eliminarFavoritoUsuario,
  obtenerFavoritos,
} from "../../services/api";

// GET /usuarios/:id/favoritos: se usa al iniciar la app o recuperar la sesion.
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (usuarioId, { rejectWithValue }) => {
    try {
      return await obtenerFavoritos(usuarioId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// POST /usuarios/:id/favoritos: guarda un producto favorito en PostgreSQL.
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ usuarioId, producto }, { rejectWithValue }) => {
    try {
      return await agregarFavoritoUsuario(usuarioId, producto);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// DELETE /usuarios/:id/favoritos/:productoId: borra el favorito del usuario.
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async ({ usuarioId, productoId }, { rejectWithValue }) => {
    try {
      return await eliminarFavoritoUsuario(usuarioId, productoId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Carga inmediata de favoritos recibidos en el login.
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    // Limpia favoritos al cerrar sesion para no mostrar datos de otro usuario.
    clearFavorites: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Cada thunk reemplaza items con la lista actualizada que devuelve el backend.
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
