"use strict";

module.exports = function(sequelize, DataTypes) {
    const aggregatedGrade = sequelize.define("AggregatedGrade", {
        city: {type: DataTypes.STRING, allowNull: false },
        subject: {type: DataTypes.STRING, allowNull: false },
        year: {type: DataTypes.INTEGER, allowNull: false },
        studentsCount: {type: DataTypes.INTEGER,  allowNull: false },
        batchCount: {type: DataTypes.INTEGER, allowNull: false },
        avgGrade: {type: DataTypes.FLOAT, allowNull: false },
        minGrade: {type: DataTypes.FLOAT, allowNull: false },
        maxGrade: {type: DataTypes.FLOAT, allowNull: false }
    }, {
        tableName: "AggregatedGrade",
        classMethods: {
            associate: function(models) {

            }
        }
    });

    return aggregatedGrade;
};