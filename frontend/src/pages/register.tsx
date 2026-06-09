import { type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { signUp } from "../services/authService";
import { useFormState } from "../hooks";
import {
  InputField,
  ErrorMessage,
  Spinner,
  Sparkles,
} from "../components/illusttration";
import RotatingAura from "../components/illusttration";

// ─── Icons ─────────────────────────────────────────────────
function UserIcon() {
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
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

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

// ─── Sign Up page ──────────────────────────────────────────
export default function SignUp() {
  const navigate = useNavigate();
  const { values, onChange, error, setError, loading, setLoading } =
    useFormState({ name: "", email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!values.name || !values.email || !values.password) {
      setError("Please fill in all fields");
      return;
    }
    if (values.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      // After signup, go to Aura selection
      navigate(`${ROUTES.AURA_SELECTION}?onboarding=true`, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("already registered")) {
        setError("This email is already registered. Try logging in!");
      } else if (msg.includes("invalid email")) {
        setError("That email doesn't look quite right");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden overflow-y-auto md:flex-row">
      {/* Background blobs */}
      <div
        className="absolute top-0 left-0 w-52 h-52 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #F7C5D8, transparent 70%)",
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-10 right-0 w-48 h-48 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #DDD5F7, transparent 70%)",
          animation: "float 5.5s ease-in-out infinite 1s",
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
      <div className="relative z-10 flex-1 mx-4 animate-slide-in animation-fill-both animation-delay-100">
        <div className="glass-card p-6 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="font-display font-black text-2xl text-gradient-peach mb-1 md:mt-40 md:text-3xl">
              Create account 🌸
            </h2>
            <p className="text-xs font-body text-gray-400">
              Your bestie is waiting for you ✨
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1 md:max-w-lg mx-auto md:justify-center">
            <div className="animate-fade-up animation-fill-both animation-delay-200">
              <InputField
                icon={<UserIcon />}
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                value={values.name}
                onChange={onChange}
                disabled={loading}
              />
            </div>

            <div className="animate-fade-up animation-fill-both animation-delay-300">
              <InputField
                icon={<MailIcon />}
                name="email"
                type="email" required
                placeholder="Email address"
                autoComplete="email"
                value={values.email}
                onChange={onChange}
                disabled={loading}
              />
            </div>

            <div className="animate-fade-up animation-fill-both animation-delay-400">
              <InputField
                icon={<LockIcon />}
                name="password"
                type="password"
                placeholder="Password (min. 8 chars)"
                autoComplete="new-password"
                value={values.password}
                onChange={onChange}
                disabled={loading}
              />
            </div>

            {/* Password strength bar */}
            {values.password.length > 0 && (
              <PasswordStrength password={values.password} />
            )}

            <ErrorMessage message={error} />

            {/* Terms */}
            <p className="text-center text-[11px] text-gray-400 leading-relaxed animate-fade-up animation-fill-both animation-delay-500">
              By registering, you agree to our{" "}
              <span className="text-aura-pink-dark font-semibold cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-aura-pink-dark font-semibold cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>

            {/* Submit */}
            <div className="animate-fade-up animation-fill-both animation-delay-600 mt-auto md:mt-10">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner /> Creating account...
                  </>
                ) : (
                  "Register ✨"
                )}
              </button>
            </div>

            {/* Login link */}
            <p className="text-center text-xs text-gray-400 animate-fade-up animation-fill-both animation-delay-700 md:mb-60">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-aura-lav-dark font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

// ─── Password strength indicator ──────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordScore(password);
  const labels = ["Too weak", "Weak", "OK", "Good", "Strong"];
  const colors = [
    "bg-red-300",
    "bg-orange-300",
    "bg-yellow-300",
    "bg-lime-400",
    "bg-aura-mint-dark",
  ];
  const widths = ["w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

  return (
    <div className="animate-fade-in">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[score]} ${widths[score]}`}
        />
      </div>
      <p
        className={`text-[11px] mt-1 font-semibold ${score >= 3 ? "text-aura-mint-dark" : "text-gray-400"}`}
      >
        {labels[score]}
      </p>
    </div>
  );
}

function getPasswordScore(pwd: string): number {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4);
}
