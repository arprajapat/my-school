"use strict";

module.exports = function(sequelize, DataTypes) {
    const grade = sequelize.define("Grade", {
        school: DataTypes.STRING,
        city: DataTypes.STRING,
        subject: DataTypes.STRING,
        year: DataTypes.INTEGER,
        studentsCount: DataTypes.INTEGER, 
        batchCount: DataTypes.INTEGER,
        avgGrade: DataTypes.FLOAT,
    }, {
        tableName: "Grade",
        classMethods: {
            associate: function(models) {

            }
        }
    });

    return grade;
};