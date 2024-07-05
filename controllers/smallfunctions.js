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

  async function updateUser(userId, newValues) {
    // Build the update query dynamically
    let updateQuery = {};
    for (let key in newValues) {
        if (newValues[key] !== undefined) {
            updateQuery[key] = newValues[key];
        }
    }

    try {
        // Perform the update operation
        const result = await User.updateOne(
            { _id: userId },
            { $set: updateQuery },
            { upsert: true } // This option creates a new document if no document matches the query
        );
    } catch (err) {
        console.error('Error updating user:', err);
    }
}

module.exports={
    findUserByEmail,
    updateUser
}