const connection = require('../config/connection');

const { User, Thought } = require('../models');
const { userData, thoughtData } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    try {
        await connection.db.dropDatabase();
        await User.create(userData);
        await Thought.create(thoughtData);
        console.log('-----DATABASE SEEDED-----');
        process.exit(0);
    }  catch(err) {
        console.error(err);
        process.exit(1)
    }
})