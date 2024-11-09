const db = require('./model');

db.SignUp.hasMany(db.Otp, { foreignKey: 'signup_id' });
db.Otp.belongsTo(db.SignUp, { foreignKey: 'signup_id' });

db.SignUp.hasOne(db.Teacher, { foreignKey: 'signup_id', sourceKey: 'signup_id' });
db.Teacher.belongsTo(db.SignUp, { foreignKey: 'signup_id', targetKey: 'signup_id' });

db.SignUp.hasOne(db.Student, { foreignKey: 'signup_id', sourceKey: 'signup_id' });
db.Student.belongsTo(db.SignUp, { foreignKey: 'signup_id', targetKey: 'signup_id' });

db.SignUp.hasOne(db.User, { foreignKey: 'signup_id', sourceKey: 'signup_id' });
db.User.belongsTo(db.SignUp, { foreignKey: 'signup_id', targetKey: 'signup_id' });

db.SignUp.hasOne(db.Token, { foreignKey: 'signup_id', sourceKey: 'signup_id' });
db.Token.belongsTo(db.SignUp, { foreignKey: 'signup_id', targetKey: 'signup_id' });


//batch table
db.Batch.hasMany(db.Student, { foreignKey: 'batch_id' });
db.Student.belongsTo(db.Batch, { foreignKey: 'batch_id' });

db.Batch.belongsToMany(db.Teacher, { through: 'BatchTeacher' });
db.Teacher.belongsToMany(db.Batch, { through: 'BatchTeacher' });


module.exports = db;
