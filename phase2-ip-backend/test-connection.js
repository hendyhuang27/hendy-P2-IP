require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

        const sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            logging: console.log,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        });

        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Test query
        const result = await sequelize.query('SELECT version();');
        console.log('PostgreSQL version:', result[0][0].version);

        await sequelize.close();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();