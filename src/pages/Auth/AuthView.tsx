import useAuthViewModel from "./useAuthViewModel";

function AuthView() {
  const {
    email,
    password,
    mode,
    loading,
    error,
    setEmail,
    setPassword,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel();

  const title = mode === "login" ? "Login" : "Create Account";
  const switchLabel = mode === "login" ? "Create an account" : "Back to login";

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <form
        className="w-full max-w-md space-y-5 rounded-lg bg-gray-800 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <h1 className="text-2xl font-semibold text-white">{title}</h1>

        <div className="space-y-2">
          <label className="block text-sm text-neutral-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-neutral-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            minLength={6}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-400"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : title}
        </button>

        <button
          type="button"
          onClick={toggleMode}
          disabled={loading}
          className="w-full text-sm text-blue-300 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {switchLabel}
        </button>
      </form>
    </main>
  );
}

export default AuthView;
