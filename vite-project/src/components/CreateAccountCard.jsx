import { useState } from "react";
import FullNameField from "./create-account/FullNameField";
import EmailField from "./create-account/EmailField";
import PasswordField from "./create-account/PasswordField";
import ConfirmPasswordField from "./create-account/ConfirmPasswordField";
import { registerUser } from "../api";

const nameRegex = /^[a-zA-Z][a-zA-Z\s]{2,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const CreateAccountCard = ({ onLogin, onCreateAccount, backendStatus }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (field, value, values = { password, confirmPassword }) => {
    if (field === "fullName") {
      return value.trim() && nameRegex.test(value.trim())
        ? ""
        : "Enter a valid name using at least 3 letters.";
    }

    if (field === "email") {
      return emailRegex.test(value)
        ? ""
        : "Enter a valid email address, such as name@example.com.";
    }

    if (field === "password") {
      return passwordRegex.test(value)
        ? ""
        : "Password must be 8+ characters with a number and special character.";
    }

    return value === values.password ? "" : "Passwords do not match.";
  };

  const updateField = (field, value) => {
    const setters = {
      fullName: setFullName,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
    };

    setters[field](value);

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validate(field, value),
      }));
    }
  };

  const validateAll = () => {
    const nextErrors = {
      fullName: validate("fullName", fullName),
      email: validate("email", email),
      password: validate("password", password),
      confirmPassword: validate("confirmPassword", confirmPassword),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).some(Boolean);
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setServerMessage("");

    if (validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerUser({ fullName, email, password, confirmPassword });
      setServerMessage(data.message);
      
      // Clear fields upon successful registration
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
          className="border-b-2 border-transparent pb-3 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onCreateAccount}
          className="border-b-2 border-cyan-400 pb-3 text-sm font-medium text-cyan-300"
        >
          Create Account
        </button>
      </div>

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/50 bg-gradient-to-br from-blue-500 to-slate-950 text-3xl shadow-[0_0_25px_rgba(0,140,255,0.35)]">
        🐟
      </div>

      <h2 className="text-center text-2xl font-medium text-white">Create Account</h2>
      <p className="mt-2 mb-7 text-center text-sm text-slate-400">
        Join our aquatic community
      </p>

      <form onSubmit={handleCreateAccount}>
        <FullNameField
          value={fullName}
          error={errors.fullName}
          onChange={(value) => updateField("fullName", value)}
          onBlur={() => setErrors((current) => ({ ...current, fullName: validate("fullName", fullName) }))}
        />
        <EmailField
          value={email}
          error={errors.email}
          onChange={(value) => updateField("email", value)}
          onBlur={() => setErrors((current) => ({ ...current, email: validate("email", email) }))}
        />
        <PasswordField
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={password}
          error={errors.password}
          onChange={(value) => updateField("password", value)}
          onBlur={() => setErrors((current) => ({ ...current, password: validate("password", password) }))}
        />
        <ConfirmPasswordField
          showPassword={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
          onBlur={() => setErrors((current) => ({ ...current, confirmPassword: validate("confirmPassword", confirmPassword) }))}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        {serverMessage && (
          <p className="mt-3 text-center text-sm text-cyan-300">{serverMessage}</p>
        )}
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="text-cyan-400 hover:underline">
          Login
        </button>
      </p>
      <p className="mt-3 text-center text-xs text-slate-500" role="status">{backendStatus}</p>
    </div>
  );
};

export default CreateAccountCard;




