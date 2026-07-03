require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
// Carga los modelos para que Sequelize conozca tablas y relaciones antes del sync.
require("./models/Usuario");
require("./models/Favorito");

const PORT = process.env.PORT || 3001;

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    // Crea/sincroniza las tablas usuarios y favoritos si no existen.
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

iniciarServidor();
