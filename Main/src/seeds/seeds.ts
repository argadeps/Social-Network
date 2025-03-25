import db from '../config/connection.js';
import { User, Thought } from '../models/index.js';

// Start by connecting to the database
const seedDatabase = async () => {
  try {
    // Connect to database
    await db();
    
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    
    console.log('Collections cleared');
    
    // Create users
    const users = await User.create([
      {
        username: 'alice',
        email: 'alice@example.com',
      },
      {
        username: 'bob',
        email: 'bob@example.com',
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
      },
      {
        username: 'diana',
        email: 'diana@example.com',
      }
    ]);
    
    console.log('Users seeded');
    
    // Create thoughts and link to users
    const thoughts = await Thought.create([
      {
        thoughtText: 'This is my first thought!',
        username: 'alice',
      },
      {
        thoughtText: 'Working with MongoDB is fun.',
        username: 'bob',
      },
      {
        thoughtText: 'NoSQL databases are perfect for social networks.',
        username: 'charlie',
      },
      {
        thoughtText: 'Express makes API development so much easier.',
        username: 'diana',
      }
    ]);
    
    console.log('Thoughts seeded');
    
    // Update users with their thoughts
    for (let i = 0; i < thoughts.length; i++) {
      const user = await User.findOneAndUpdate(
        { username: thoughts[i].username },
        { $push: { thoughts: thoughts[i]._id } },
        { new: true }
      );
      if (!user) {
        console.warn(`Could not find user with username:${thoughts[i].username}`)
            
      }
    }
    
    console.log('User thoughts updated');
    
    // Add reactions to thoughts
    await Thought.findOneAndUpdate(
      { _id: thoughts[0]._id },
      { 
        $push: { 
          reactions: { 
            reactionBody: 'Love this!', 
            username: 'bob' 
          } 
        } 
      },
      { new: true }
    );
    
    await Thought.findOneAndUpdate(
      { _id: thoughts[1]._id },
      { 
        $push: { 
          reactions: { 
            reactionBody: 'I agree completely!', 
            username: 'alice' 
          } 
        } 
      },
      { new: true }
    );
    
    console.log('Reactions added');
    
    // Add friends
    await User.findOneAndUpdate(
      { username: 'alice' },
      { $push: { friends: users[1]._id } },
      { new: true }
    );
    
    await User.findOneAndUpdate(
      { username: 'bob' },
      { $push: { friends: users[0]._id } },
      { new: true }
    );
    
    console.log('Friends added');
    
    console.log('All seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();