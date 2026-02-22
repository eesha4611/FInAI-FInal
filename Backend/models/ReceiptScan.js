module.exports = (sequelize, DataTypes) => {
  const ReceiptScan = sequelize.define("ReceiptScan", {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    scannedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return ReceiptScan;
};
