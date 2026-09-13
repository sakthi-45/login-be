const EmailField = ({ value, error, onChange, onBlur }) => {
  return (
    <div className="relative mb-3">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉</span>
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email Address"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "create-email-error" : undefined}
        className="h-11 w-full rounded-md border border-slate-700/70 bg-slate-950/60 px-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
      />
      {error && <p id="create-email-error" className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
};

export default EmailField;
