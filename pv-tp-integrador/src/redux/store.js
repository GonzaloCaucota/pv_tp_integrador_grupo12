import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import favoritesReducer from "./slices/favoritesSlice";
import userReducer from "./slices/userSlice";

// Store central: favoritos ya no se precargan desde localStorage, se cargan desde backend.
const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    user: userReducer,
  },
});

export default store;
