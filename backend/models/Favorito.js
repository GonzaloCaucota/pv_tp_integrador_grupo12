const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

// Tabla favoritos: guarda cada producto favorito asociado a un usuario.
// Se guardan los datos necesarios del producto que viene desde el front/Fake Store API.
const Favorito = sequelize.define(
  "Favorito",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productoId: {
      // BIGINT permite guardar tambien los productos locales creados con Date.now().
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      // Rating queda como JSONB porque Fake Store API lo entrega como objeto { rate, count }.
      type: DataTypes.JSONB,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
  },
  {
    tableName: "favoritos",
    timestamps: true,
    indexes: [
      {
        // Evita que un mismo usuario guarde dos veces el mismo producto.
        unique: true,
        fields: ["usuarioId", "productoId"],
      },
    ],
  }
);

// Un usuario puede tener muchos favoritos; si se borra el usuario, se borran sus favoritos.
Usuario.hasMany(Favorito, {
  foreignKey: "usuarioId",
  as: "favoritos",
  onDelete: "CASCADE",
});

// Cada favorito pertenece a un usuario.
Favorito.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

module.exports = Favorito;
