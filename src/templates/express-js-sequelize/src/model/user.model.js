const { Sequelize, Model, DataTypes, Deferrable } = require("sequelize");
const sequelize = require("../connections/db.connections");
const logger = require("../logger/logger");
const { constant } = require("../helper/constant");

/*---------------------------------------------[ Define table type in sequelize ]----------------------------------------------*/
class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      select: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifyOtp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING,
    },
    isVerify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  },
  {
    sequelize,
    modelName: "Users",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

/*---------------------------------------------[ Define the association for createdBy ]----------------------------------------------*/
User.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });

/*---------------------------------------------[ Define the association for createdBy ]----------------------------------------------*/
User.belongsTo(User, { as: "updatedBy", foreignKey: "updatedById" });

/*---------------------------------------------[ Create the table if it doesn't exist ]----------------------------------------------*/
User.sync({ force: false }).then(() => {
  logger.info(constant.USER_TABLE_CREATE);
});

module.exports = User;
