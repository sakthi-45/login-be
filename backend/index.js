const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

// Temporary in-memory users
// NOTE: Users will be lost when the server restarts/redeploys.
const users = [];

// -----------------------------
// Middleware
// -----------------------------

// Allow frontend to communicate with backend
app.use(cors());

// Read JSON request bodies
app.use(express.json());

// -----------------------------
// Validation
// -----------------------------

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const nameRegex =
  /^[a-zA-Z][a-zA-Z\s]{2,}$/;

const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

// -----------------------------
// Password Hashing
// -----------------------------

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
};

const passwordsMatch = (password, storedPassword) => {
  const [salt, storedHash] = storedPassword.split(":");

  const suppliedHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(suppliedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
};

// -----------------------------
// Public User Data
// -----------------------------

const publicUser = ({ id, fullName, email }) => ({
  id,
  fullName,
  email,
});

// -----------------------------
// Health Check
// -----------------------------

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is connected",
    status: "ok",
  });
});

// -----------------------------
// Get Users
// -----------------------------

app.get("/api/users", (req, res) => {
  res.json(users.map(publicUser));
});

// -----------------------------
// Register
// -----------------------------

app.post("/api/register", (req, res) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
  } = req.body;

  // Check required fields
  if (
    ![fullName, email, password, confirmPassword].every(
      (value) =>
        typeof value === "string" &&
        value.trim()
    )
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  // Normalize data
  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // Validate name
  if (!nameRegex.test(normalizedName)) {
    return res.status(400).json({
      message:
        "Enter a valid name using at least 3 letters.",
    });
  }

  // Validate email
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Enter a valid email address.",
    });
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8+ characters with a number and special character.",
    });
  }

  // Confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match.",
    });
  }

  // Check existing user
  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    return res.status(409).json({
      message:
        "An account with this email already exists.",
    });
  }

  // Create user
  const newUser = {
    id: users.length + 1,
    fullName: normalizedName,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Account created successfully.",
    user: publicUser(newUser),
  });
});

// -----------------------------
// Login
// -----------------------------

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  // Normalize email
  const normalizedEmail =
    email.trim().toLowerCase();

  // Find user
  const user = users.find(
    (user) => user.email === normalizedEmail
  );

  // Check credentials
  if (
    !user ||
    !passwordsMatch(
      password,
      user.passwordHash
    )
  ) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  return res.json({
    message: `Welcome back, ${user.fullName}!`,
    user: publicUser(user),
  });
});

// -----------------------------
// JSON Error Handler
// -----------------------------

app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    "body" in error
  ) {
    return res.status(400).json({
      message: "Request body must be valid JSON.",
    });
  }

  next(error);
});

// -----------------------------
// 404 Handler
// -----------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

// -----------------------------
// Local Development
// -----------------------------

if (require.main === module) {
  app.listen(port, () => {
    console.log(
      `Backend server is running on http://localhost:${port}`
    );
  });
}

// -----------------------------
// Export for Vercel
// -----------------------------

module.exports = app;