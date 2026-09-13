import { useState } from "react";
import { loginUser } from "../api";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const LoginCard = ({ onLogin, onCreateAccount, backendStatus }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value) => {
    if (!value) {
      return "Email address is required.";
    }

    if (!emailRegex.test(value)) {
      return "Enter a valid email address, such as name@example.com.";
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required.";
    }

    if (!passwordRegex.test(value)) {
      return "Password must be 8+ characters with a number and special character.";
    }

    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const validationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (validationError) {
      setEmailError(validationError);
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
    }

    if (validationError || passwordValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });

      setServerMessage(data.message);
    } catch (error) {
      setServerMessage(error.message || "Unable to connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] rounded-2xl border border-cyan-500/40 bg-slate-950/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-9">

      <div className="mb-7 grid grid-cols-2 border-b border-slate-700/60">
        <button
          type="button"
          onClick={onLogin}
          className="border-b-2 border-cyan-400 pb-3 text-sm font-medium text-cyan-300"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onCreateAccount}
          className="border-b-2 border-transparent pb-3 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          Create Account
        </button>
      </div>

      {/* Logo */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/50 bg-gradient-to-br from-blue-500 to-slate-950 text-3xl shadow-[0_0_25px_rgba(0,140,255,0.35)]">
        🐟
      </div>

      {/* Heading */}
      <h2 className="text-center text-2xl font-medium text-white">
        Welcome Back
      </h2>

      <p className="mt-2 mb-7 text-center text-sm text-slate-400">
        Login to continue your journey
      </p>

      <form onSubmit={handleLogin}>

        {/* Email */}
        <div className="relative mb-3">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ♙
          </span>

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email Address"
            title="Enter a valid email address"
            required
            value={email}
            onChange={(event) => {
              const value = event.target.value;
              setEmail(value);

              if (emailError) {
                setEmailError(validateEmail(value));
              }
            }}
            onBlur={() => setEmailError(validateEmail(email))}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
            className="h-11 w-full rounded-md border border-slate-700/70 bg-slate-950/60 px-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
          />

          {emailError && (
            <p id="email-error" className="mt-1 text-xs text-red-300">
              {emailError}
            </p>
          )}

        </div>

        {/* Password */}
        <div className="relative mb-4">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔒
          </span>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            required
            value={password}
            onChange={(event) => {
              const value = event.target.value;
              setPassword(value);

              if (passwordError) {
                setPasswordError(validatePassword(value));
              }
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
            onInvalid={() => setPasswordError(validatePassword(password))}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : undefined}
            className="h-11 w-full rounded-md border border-slate-700/70 bg-slate-950/60 px-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
          >
            {showPassword ? "👁️" : "◉"}
          </button>

          {passwordError && (
            <p id="password-error" className="mt-1 text-xs text-red-300">
              {passwordError}
            </p>
          )}

        </div>

        {/* Remember / Forgot */}
        <div className="mb-4 flex items-center justify-between">

          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">

            <input
              type="checkbox"
              className="h-4 w-4 accent-cyan-500"
            />

            Remember me

          </label>

          <button
            type="button"
            className="text-xs text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {serverMessage && (
          <p className="mt-3 text-center text-sm text-cyan-300">{serverMessage}</p>
        )}

      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">

        <div className="h-px flex-1 bg-slate-700/50"></div>

        <span className="text-xs text-slate-500">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-700/50"></div>

      </div>

      {/* Google */}
      <button type="button" className="mb-2 flex h-11 w-full items-center justify-center gap-3 rounded-md border border-slate-700/70 bg-slate-950/50 text-sm text-slate-200 transition hover:border-cyan-500 hover:bg-slate-900">
        <span className="text-lg font-bold text-blue-400">
          G
        </span>

        Continue with Google
      </button>

      {/* Email */}
      <button type="button" className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-slate-700/70 bg-slate-950/50 text-sm text-slate-200 transition hover:border-cyan-500 hover:bg-slate-900">
        <span>
          ✉
        </span>

        Continue with Email
      </button>

      {/* Signup */}
      <p className="mt-6 text-center text-xs text-slate-500">

        Don't have an account?{" "}

        <button type="button" onClick={onCreateAccount} className="text-cyan-400 hover:underline">
          Create Account
        </button>

      </p>
      <p className="mt-3 text-center text-xs text-slate-500" role="status">{backendStatus}</p>

    </div>
  );
};

export default LoginCard;
