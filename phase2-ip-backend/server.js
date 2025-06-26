require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        await db.sequelize.sync({ force: false });
        console.log('✅ Database synced successfully.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
    }
};

startServer();