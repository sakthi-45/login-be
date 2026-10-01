const crypto = require("crypto");

const users = new Map();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z][a-zA-Z\s]{2,}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const send = (res, status, data) => res.status(status).json(data);
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
};
const isValidPassword = (password, savedPassword) => {
  const [salt, savedHash] = savedPassword.split(":");
  const suppliedHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(suppliedHash, "hex"), Buffer.from(savedHash, "hex"));
};

module.exports = (req, res) => {
  const body = req.body || {};
  const action = req.method === "GET" ? req.query.action : body.action;

  if (action === "health" && req.method === "GET") {
    return send(res, 200, { message: "Backend is connected", status: "ok" });
  }

  if (action === "register" && req.method === "POST") {
    const { fullName, email, password, confirmPassword } = body;
    if (![fullName, email, password, confirmPassword].every((value) => typeof value === "string" && value.trim())) return send(res, 400, { message: "All fields are required." });
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!nameRegex.test(normalizedName)) return send(res, 400, { message: "Enter a valid name using at least 3 letters." });
    if (!emailRegex.test(normalizedEmail)) return send(res, 400, { message: "Enter a valid email address." });
    if (!passwordRegex.test(password)) return send(res, 400, { message: "Password must be 8+ characters with a number and special character." });
    if (password !== confirmPassword) return send(res, 400, { message: "Passwords do not match." });
    if (users.has(normalizedEmail)) return send(res, 409, { message: "An account with this email already exists." });
    users.set(normalizedEmail, { fullName: normalizedName, passwordHash: hashPassword(password) });
    return send(res, 201, { message: "Account created successfully." });
  }

  if (action === "login" && req.method === "POST") {
    const { email, password } = body;
    const user = typeof email === "string" ? users.get(email.trim().toLowerCase()) : null;
    if (!user || typeof password !== "string" || !isValidPassword(password, user.passwordHash)) return send(res, 401, { message: "Invalid email or password." });
    return send(res, 200, { message: `Welcome back, ${user.fullName}!` });
  }

  return send(res, 404, { message: "API route not found." });
};
