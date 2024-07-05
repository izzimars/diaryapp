const mongoose = require('mongoose');


async function findUserByEmail(email) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        console.log('User found:', user);
      } else {
        console.log('No user found with that email');
      }
    } catch (err) {
      console.error('Error finding user:', err);
    }
  }

module.exports={
    findUserByEmail
}