const { User } = require('../models');

const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@deezer.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
    },
    {
        username: 'music_lover',
        email: 'music@example.com',
        password: 'password123',
        firstName: 'Music',
        lastName: 'Lover'
    }
];

const seedUsers = async () => {
    try {
        console.log('Seeding users...');

        const existingUsers = await User.findAll();
        if (existingUsers.length > 0) {
            console.log('Users already exist, skipping user seeding');
            return existingUsers;
        }

        const users = await User.bulkCreate(sampleUsers);
        console.log(`Created ${users.length} sample users`);
        return users;
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

module.exports = { seedUsers, sampleUsers };