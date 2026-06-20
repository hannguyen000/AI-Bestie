import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { login } from "../services/authService";
import { useFormState } from "../hooks";
import { type FormEvent } from "react";

import {
  InputField,
  ErrorMessage,
  Spinner,
  Sparkles,
} from "../components/illusttration";
import RotatingAura from "../components/illusttration";

// ─── Icons ─────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Login page ────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const { values, onChange, error, setError, loading, setLoading } =
    useFormState({ email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError("Please fill in all fields 🌸");
      return;
    }

    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // Friendlier error messages
      if (msg.includes("Invalid login credentials")) {
        setError("Hmm, that email or password doesn't look right 😔");
      } else if (msg.includes("Email not confirmed")) {
        setError("Please confirm your email first! Check your inbox 📧");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden md:flex-row">
      {/* Background blobs */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, #DDD5F7, transparent 70%)",
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 -left-16 w-48 h-48 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #F7C5D8, transparent 70%)",
          animation: "float 5s ease-in-out infinite 0.5s",
        }}
      />

      <Sparkles />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-20 w-9 h-9 flex items-center justify-center rounded-full glass-card text-aura-pink-dark hover:scale-105 transition-transform"
      >
        ←
      </button>

      {/* Illustration */}
      <div className="relative z-10 flex justify-center pt-12 pb-2 md:flex md:flex-1 md:p-12 md:mt-10">
        <div className="w-40 h-60 md:w-100 md:h-150 transition-all duration-1000 ease-in-out animate-float">
          <RotatingAura className="w-40 h-60 md:w-100 md:h-150" />
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 mx-4 animate-slide-in animation-fill-both animation-delay-100 md:flex-1 md:items-center">
        <div className="glass-card p-6 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-display font-black text-2xl text-gradient-pink mb-1 md:text-3xl md:mt-30">
              Welcome back 🌙
            </h2>
            <p className="text-xs font-body text-gray-400 md:text-sm">
              So glad you came back, bestie ✨
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3.5 flex-1 w-full max-w-sm md:max-w-sm mx-auto md:justify-center md:mt-10"
          >
            
            <div className="animate-fade-up animation-fill-both animation-delay-200 ">
              <InputField
                icon={<MailIcon />}
                name="email"
                type="email"
                placeholder="Your email"
                autoComplete="email"
                value={values.email}
                onChange={onChange}
                disabled={loading}
              />
            </div>

            <div className="animate-fade-up animation-fill-both animation-delay-300">
              <InputField
                icon={<LockIcon />}
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={values.password}
                onChange={onChange}
                disabled={loading}
              />
            </div>

            {/* Forgot password */}
            <div className="text-right animate-fade-up animation-fill-both animation-delay-300">
              <button
                type="button"
                className="text-xs text-aura-lav-dark font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <ErrorMessage message={error} />

            {/* Submit */}
            <div className="animate-fade-up animation-fill-both animation-delay-400 mt-auto">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed "
              >
                {loading ? (
                  <>
                    <Spinner /> Logging in...
                  </>
                ) : (
                  "Login ✨"
                )}
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-xs text-gray-400 animate-fade-up animation-fill-both animation-delay-500 md:mb-90">
              New here?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-aura-pink-dark font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
