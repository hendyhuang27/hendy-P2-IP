const { seedUsers } = require('./userSeeder');
const { seedPlaylists } = require('./playlistSeeder');
const db = require('../models');

const runSeeders = async () => {
    try {
        console.log('Starting database seeding...');

        await db.sequelize.authenticate();
        console.log('Database connected');

        await db.sequelize.sync({ force: false });
        console.log('Database synced');

        const users = await seedUsers();

        await new Promise(resolve => setTimeout(resolve, 1000));

        await seedPlaylists(users);

        console.log('Database seeding completed successfully!');
        console.log('');
        console.log('Sample data created:');
        console.log('Users: admin, john_doe, jane_smith, music_lover');
        console.log('Playlists: Top Hits, Eminem Classics, Coldplay Vibes, etc.');
        console.log('Login with: admin@deezer.com / admin123');
        console.log('');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {

        await db.sequelize.close();
        process.exit(0);
    }
};

if (require.main === module) {
    runSeeders();
}

module.exports = { runSeeders };