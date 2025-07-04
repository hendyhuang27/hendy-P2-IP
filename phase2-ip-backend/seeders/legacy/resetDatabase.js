const db = require('../models');
const { runSeeders } = require('./index');

const resetDatabase = async () => {
    try {
        console.log('Resetting database...');

        await db.sequelize.authenticate();

        await db.sequelize.sync({ force: true });
        console.log('Database reset completed');

        await db.sequelize.close();

        console.log('Running seeders...');
        await runSeeders();

    } catch (error) {
        console.error('Database reset failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    resetDatabase();
}

module.exports = { resetDatabase };