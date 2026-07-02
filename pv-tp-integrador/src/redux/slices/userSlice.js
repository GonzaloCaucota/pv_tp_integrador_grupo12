import { createSlice } from "@reduxjs/toolkit";

// Recupera la sesion guardada, pero descarta sesiones viejas sin id de PostgreSQL.
const getSessionUser = () => {
  try {
    const sessionUser = localStorage.getItem("sessionUser");
    const user = sessionUser ? JSON.parse(sessionUser) : null;

    if (!user?.id) {
      localStorage.removeItem("sessionUser");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error al leer sessionUser de localStorage:", error);
    return null;
  }
};

const sessionUser = getSessionUser();

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: sessionUser,
    isAuthenticated: !!sessionUser,
  },
  reducers: {
    // Guarda el usuario devuelto por /api/login, incluyendo su id real de base de datos.
    loginUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("sessionUser", JSON.stringify(action.payload));
    },
    // Cierra sesion localmente; los favoritos se limpian desde NavBar con clearFavorites.
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem("sessionUser");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
