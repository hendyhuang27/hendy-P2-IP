'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if users already exist (same logic as your original)
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUsers.length > 0) {
      console.log('Users already exist, skipping user seeding');
      return;
    }

    console.log('Seeding users...');

    // Use your original sample users data
    const bcrypt = require('bcrypt');

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

    // Hash passwords and add required fields
    const users = [];
    for (const user of sampleUsers) {
      users.push({
        username: user.username,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        firstName: user.firstName,
        lastName: user.lastName,
        provider: 'local',
        emailVerified: false,
        profilePicture: null,
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Users', users);
    console.log(`✅ Created ${users.length} sample users`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    console.log('✅ Users table cleared');
  }
};