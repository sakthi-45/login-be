const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Array of objects to store users in backend memory
const users = [];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z][a-zA-Z\s]{2,}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is connected", status: "ok" });
});

// GET route to inspect registered users array
app.get("/api/users", (req, res) => {
  res.json(users);
});

// POST route for registering a new user into the array
app.post("/api/register", (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (![fullName, email, password, confirmPassword].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!nameRegex.test(normalizedName)) {
    return res.status(400).json({ message: "Enter a valid name using at least 3 letters." });
  }

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be 8+ characters with a number and special character.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const existingUser = users.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const newUser = {
    id: users.length + 1,
    fullName: normalizedName,
    email: normalizedEmail,
    password: password,
  };

  users.push(newUser);
  return res.status(201).json({ message: "Account created successfully.", user: newUser });
});

// POST route for login request
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({ message: `Welcome back, ${user.fullName}!` });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  next(error);
});

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




