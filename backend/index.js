const express = require("express");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

// Temporary in-memory users
const users = [];

// Validation regex patterns
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z][a-zA-Z\s]{2,}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

// Helper functions for password hashing & matching
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const passwordsMatch = (password, storedPassword) => {
  const [salt, storedHash] = storedPassword.split(":");
  const suppliedHash = crypto.scryptSync(password, salt, 64).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(suppliedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
};

const publicUser = ({ id, fullName, email }) => ({ id, fullName, email });

// Middleware
app.use(express.json());

// CORS Configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is connected",
    status: "ok",
  });
});

// Get users list
app.get("/api/users", (req, res) => {
  res.json(users.map(publicUser));
});

// Register endpoint
app.post("/api/register", (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (
    ![fullName, email, password, confirmPassword].every(
      (value) => typeof value === "string" && value.trim()
    )
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!nameRegex.test(normalizedName)) {
    return res.status(400).json({
      message: "Enter a valid name using at least 3 letters.",
    });
  }

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Enter a valid email address.",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8+ characters with a number and special character.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match.",
    });
  }

  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({
      message: "An account with this email already exists.",
    });
  }

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

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

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

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((user) => user.email === normalizedEmail);

  if (!user || !passwordsMatch(password, user.passwordHash)) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  return res.json({
    message: `Welcome back, ${user.fullName}!`,
  });
});

// JSON error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      message: "Request body must be valid JSON.",
    });
  }

  next(error);
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

// Start a listener only for local development. Vercel imports this app as a
// serverless function and provides the request listener itself.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}

module.exports = app;
