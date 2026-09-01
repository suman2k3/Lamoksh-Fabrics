import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account & Sign In — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Sign in to your LaMoksh Fabrics account or create a new account to save your favourite pieces and manage orders.",
      },
      { property: "og:title", content: "Account & Sign In — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Sign in or create an account for a personal LaMoksh experience.",
      },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

type AuthMode = "signin" | "signup";
type AuthState = "idle" | "signed_in" | "created";

function AccountPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [authState, setAuthState] = useState<AuthState>("idle");

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");

  // Create Account Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signUpTermsError, setSignUpTermsError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!signInEmail.trim() || !validateEmail(signInEmail)) {
      setSignInEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setSignInEmailError("");
    }

    if (!signInPassword || signInPassword.length < 6) {
      setSignInPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setSignInPasswordError("");
    }

    if (valid) {
      setAuthState("signed_in");
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!firstName.trim()) {
      setFirstNameError("Please enter your first name.");
      valid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName.trim()) {
      setLastNameError("Please enter your last name.");
      valid = false;
    } else {
      setLastNameError("");
    }

    if (!signUpEmail.trim() || !validateEmail(signUpEmail)) {
      setSignUpEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setSignUpEmailError("");
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setSignUpPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setSignUpPasswordError("");
    }

    if (!agreeTerms) {
      setSignUpTermsError("You must agree to the Terms of Service and Privacy Policy.");
      valid = false;
    } else {
      setSignUpTermsError("");
    }

    if (valid) {
      setAuthState("created");
    }
  };

  const handleGoogleAuth = () => {
    setAuthState("signed_in");
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setSignInEmailError("");
    setSignInPasswordError("");
    setFirstNameError("");
    setLastNameError("");
    setSignUpEmailError("");
    setSignUpPasswordError("");
    setSignUpTermsError("");
  };

  if (authState === "signed_in") {
    return (
      <div className="container-lux py-20 md:py-32">
        <div className="mx-auto max-w-md rounded-sm border border-ivory/10 bg-espresso p-8 text-center text-ivory shadow-xl md:p-12">
          <Reveal>
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">WELCOME BACK</p>
            <h1 className="mt-3 font-serif text-3xl font-normal text-ivory md:text-4xl">
              You&apos;re signed in to LaMoksh.
            </h1>
            <p className="body-lux mt-4 text-sm text-ivory/80">
              Your wishlist and saved details are ready for your exploration.
            </p>
            <div className="mt-10">
              <Link
                to="/clothing"
                className="inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  if (authState === "created") {
    return (
      <div className="container-lux py-20 md:py-32">
        <div className="mx-auto max-w-md rounded-sm border border-ivory/10 bg-espresso p-8 text-center text-ivory shadow-xl md:p-12">
          <Reveal>
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
              ACCOUNT CREATED
            </p>
            <h1 className="mt-3 font-serif text-3xl font-normal text-ivory md:text-4xl">
              Welcome to the LaMoksh world.
            </h1>
            <p className="body-lux mt-4 text-sm text-ivory/80">
              Your account has been created. Save your favourite pieces and enjoy a personalized
              handloom experience.
            </p>
            <div className="mt-10">
              <Link
                to="/clothing"
                className="inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90"
              >
                EXPLORE THE COLLECTION
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lux py-16 md:py-24">
      {/* Centered Single Authentication Form Box in Dark Espresso */}
      <div className="mx-auto max-w-[500px] rounded-sm border border-ivory/10 bg-espresso p-8 text-ivory shadow-xl md:p-12">
        {mode === "signin" ? (
          <div key="signin">
            <Reveal>
              <div className="text-center">
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
                  WELCOME BACK
                </p>
                <h1 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
                  Sign In
                </h1>
                <p className="body-lux mt-3 text-sm text-ivory/80">
                  Sign in to access your wishlist, orders and personal details.
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} className="mt-8 space-y-6" noValidate>
                {/* EMAIL ADDRESS */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signin-email"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signInEmail}
                    onChange={(e) => {
                      setSignInEmail(e.target.value);
                      if (signInEmailError) setSignInEmailError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                      signInEmailError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signInEmailError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signInEmailError}</p>
                  ) : null}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="signin-password"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {showSignInPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  <input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value);
                      if (signInPasswordError) setSignInPasswordError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                      signInPasswordError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signInPasswordError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signInPasswordError}</p>
                  ) : null}
                  <div className="pt-1 text-right">
                    <button
                      type="button"
                      className="text-xs text-ivory/70 transition-colors hover:text-ivory hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  className="mt-6 h-12 w-full rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 active:scale-[0.99]"
                >
                  SIGN IN
                </button>

                {/* Subtle Divider */}
                <div className="relative pt-2 text-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-ivory/20" />
                  </div>
                  <div className="relative inline-block bg-espresso px-4">
                    <span className="text-xs font-medium uppercase tracking-widest text-ivory/70">
                      OR
                    </span>
                  </div>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-[2px] border border-ivory/30 bg-transparent text-xs font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-ivory/10"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Below form link */}
                <div className="pt-6 text-center">
                  <p className="text-sm text-ivory/80">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-medium text-ivory underline transition-colors hover:text-white"
                    >
                      Create one &rarr;
                    </button>
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        ) : (
          <div key="signup">
            <Reveal>
              <div className="text-center">
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
                  WELCOME TO LAMOKSH
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
                  Create an Account
                </h2>
                <p className="body-lux mt-3 text-sm text-ivory/80">
                  Create your account to save your favourite pieces and make every LaMoksh
                  experience personal.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="mt-8 space-y-6" noValidate>
                {/* FIRST NAME & LAST NAME */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="signup-firstname"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      FIRST NAME
                    </label>
                    <input
                      id="signup-firstname"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (firstNameError) setFirstNameError("");
                      }}
                      className={cn(
                        "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                        firstNameError && "border-red-400 focus:border-red-400",
                      )}
                    />
                    {firstNameError ? (
                      <p className="mt-1 font-sans text-xs text-red-300">{firstNameError}</p>
                    ) : null}
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="signup-lastname"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      LAST NAME
                    </label>
                    <input
                      id="signup-lastname"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (lastNameError) setLastNameError("");
                      }}
                      className={cn(
                        "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                        lastNameError && "border-red-400 focus:border-red-400",
                      )}
                    />
                    {lastNameError ? (
                      <p className="mt-1 font-sans text-xs text-red-300">{lastNameError}</p>
                    ) : null}
                  </div>
                </div>

                {/* EMAIL ADDRESS */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-email"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      if (signUpEmailError) setSignUpEmailError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                      signUpEmailError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signUpEmailError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signUpEmailError}</p>
                  ) : null}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="signup-password"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {showSignUpPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  <input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (signUpPasswordError) setSignUpPasswordError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                      signUpPasswordError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signUpPasswordError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signUpPasswordError}</p>
                  ) : null}
                </div>

                {/* TERMS CHECKBOX */}
                <div className="pt-2">
                  <label className="flex cursor-pointer items-start gap-3 text-xs text-ivory/80">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (signUpTermsError) setSignUpTermsError("");
                      }}
                      className="mt-0.5 h-4 w-4 rounded-[2px] accent-ivory"
                    />
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" className="text-ivory underline hover:text-white">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-ivory underline hover:text-white">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {signUpTermsError ? (
                    <p className="mt-1.5 font-sans text-xs text-red-300">{signUpTermsError}</p>
                  ) : null}
                </div>

                {/* CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  className="mt-6 h-12 w-full rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 active:scale-[0.99]"
                >
                  CREATE ACCOUNT
                </button>

                {/* Below form link */}
                <div className="pt-6 text-center">
                  <p className="text-sm text-ivory/80">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="font-medium text-ivory underline transition-colors hover:text-white"
                    >
                      Sign in &rarr;
                    </button>
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
