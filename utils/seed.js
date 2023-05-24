
const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drops all existing users 
  await User.deleteMany({});

  // Drops all existing thoughts
  await Thought.deleteMany({});

  // Create empty array to hold the elite users
  const users = [
    {
        username: "Spongebob",
        email: "bob@whitehous.gov"
    },
    {
        username: "Patrick",
        email: "patrick@aol.com"
    }
];

  // Add users to the collection 
  await User.collection.insertMany(users);


  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info("I'm Readyyyy! 🌱");
  process.exit(0);
});
