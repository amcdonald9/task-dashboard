const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

(async () => {
  try {
    await sequelize.sync({ force: true }); // force:true drops tables if they exist
    console.log('✅ All tables created successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
})();
