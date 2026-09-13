const ConfirmPasswordField = ({ showPassword, onToggle, value, error, onChange, onBlur }) => {
  return (
    <div className="relative mb-5">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Confirm Password"
        required
        minLength={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "create-confirm-password-error" : undefined}
        className="h-11 w-full rounded-md border border-slate-700/70 bg-slate-950/60 px-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide confirmed password" : "Show confirmed password"}
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
      >
        {showPassword ? "👁️" : "◉"}
      </button>
      {error && <p id="create-confirm-password-error" className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
};

export default ConfirmPasswordField;
