/**
 * authService.js
 * Business logic for user registration and login.
 * Orchestrates: password hashing, user creation, JWT generation.
 * Never handles HTTP directly — only called by authController.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/userRepository');

/**
 * Register a new user account.
 * Hashes the password, creates the user record, and returns a JWT.
 *
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ token: string, user: Object }>}
 */
const register = async ({ name, email, password }) => {
  // Hash the password — cost factor 12 is a good balance of security vs speed
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the user record in the database (repository handles DB logic)
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  // Sign a JWT containing the user's ID as the payload
  const token = signToken(user.id);

  return { token, user };
};

/**
 * Authenticate a user with email and password.
 * Returns a JWT on success; throws an error on invalid credentials.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: Object }>}
 */
const login = async (email, password) => {
  // Fetch the user including the password hash
  const userWithPassword = await userRepository.findByEmail(email);

  // Use a generic error message — don't reveal whether email or password is wrong
  const invalidCredError = new Error('Invalid email or password.');
  invalidCredError.status = 401;

  if (!userWithPassword) throw invalidCredError;

  // Compare the submitted password against the stored hash
  const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);
  if (!isPasswordValid) throw invalidCredError;

  // Sign the token
  const token = signToken(userWithPassword.id);

  // Return user without the password hash
  const { password: _pw, ...user } = userWithPassword;

  return { token, user };
};

/**
 * Signs a JWT with the user's ID as the payload.
 * All token configuration comes from the config object.
 *
 * @param {string} userId - UUID of the authenticated user
 * @returns {string} Signed JWT string
 */
const signToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = { register, login };
