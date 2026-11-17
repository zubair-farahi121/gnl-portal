"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/assets";
import { APP_ROUTES } from "@/lib/data/service-config";

/*
 * LoginForm — "Login fields" 11:24884 of the GNWT login card (Figma
 * 20:23088). release-2, 2026-11-16. Spec A §5.
 *
 *   FormFields (gap 16)
 *     Email Address   label Bold 14 #333, gap 8, input h40, square,
 *                     1px rgba(51,51,51,.75), px 12, text 14 #5F6368
 *     Password        the same, with the eye (show / hide) inside the box
 *     Forgot password?  Medium 16 #005D8F underlined, 8 under the input — inert
 *   ActionButtons     right-aligned, gap 24: "Create Account" (secondary,
 *                     inert) and "Sign-in" (primary #333, the submit)
 *
 * BEHAVIOUR (unchanged since 2026-09-30): any non-empty email and password
 * go to the dashboard; nothing is checked or stored. Either field empty (or
 * only spaces) shows an inline error with role="alert" and the page stays.
 * `noValidate`, because the presenter may type a plain user ID.
 */

/** Label, 40px square box and input. */
function Field({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  invalid,
  describedBy,
  trailing,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  describedBy?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <label
        htmlFor={id}
        className="block w-full text-[14px] font-bold leading-[1.5] text-[#333333] [word-break:break-word]"
      >
        {label}
      </label>
      <div
        className={`box-border flex h-[40px] w-full items-center gap-[8px] rounded-none border border-solid bg-white px-[12px] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#005d8f] ${
          invalid ? "border-[color:var(--gnl-danger,#d32f2f)]" : "border-[rgba(51,51,51,0.75)]"
        }`}
      >
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="m-0 h-[21px] min-w-px flex-[1_0_0] border-0 bg-transparent p-0 text-[14px] font-normal leading-[1.5] text-[#5f6368] outline-none"
        />
        {trailing}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const uid = useId();
  const emailId = `${uid}-email`;
  const passwordId = `${uid}-password`;
  const errorId = `${uid}-error`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    router.push(APP_ROUTES.dashboard);
  };

  return (
    <form
      className="flex w-[428px] min-w-0 shrink flex-col gap-[24px] max-md:w-full"
      noValidate
      onSubmit={onSubmit}
      aria-label="Sign in"
      data-node-id="11:24884"
    >
      {/* FormFields */}
      <div className="flex w-full flex-col items-start gap-[16px]">
        <Field
          id={emailId}
          label="Email Address"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (showError) setShowError(false);
          }}
          invalid={showError && !email.trim()}
          describedBy={showError ? errorId : undefined}
        />

        <div className="flex w-full flex-col items-start gap-[8px]">
          <Field
            id={passwordId}
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (showError) setShowError(false);
            }}
            invalid={showError && !password.trim()}
            describedBy={showError ? errorId : undefined}
            trailing={
              <button
                type="button"
                className="relative block size-[16px] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls={passwordId}
                onClick={() => setShowPassword((v) => !v)}
              >
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconEye} />
              </button>
            }
          />
          {/* No password-reset screen exists in the demo — inert (toast). */}
          <button
            type="button"
            className="cursor-pointer text-left text-[16px] font-medium leading-normal text-[#005d8f] underline decoration-solid decoration-from-font [text-underline-position:from-font] hover:text-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
            data-demo-inert="true"
          >
            Forgot password?
          </button>
        </div>

        {/* Only after a failed submit. */}
        {showError ? (
          <p
            id={errorId}
            role="alert"
            className="w-full text-[14px] font-normal leading-[21px] text-[color:var(--gnl-danger,#d32f2f)] [word-break:break-word]"
          >
            Enter your email address and password.
          </p>
        ) : null}
      </div>

      {/* ActionButtons — right-aligned "Double button", gap 24. */}
      <div className="flex w-full flex-wrap items-center justify-end gap-[24px]">
        <button
          type="button"
          className="inline-flex h-[40px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent px-[12px] py-[8px] text-[16px] font-bold leading-[1.5] whitespace-nowrap text-[#333333] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
          data-demo-inert="true"
        >
          Create Account
        </button>
        <button
          type="submit"
          className="inline-flex h-[40px] cursor-pointer items-center justify-center rounded-[6px] bg-[#333333] px-[12px] py-[8px] text-[16px] font-bold leading-[1.5] whitespace-nowrap text-white hover:bg-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
        >
          Sign-in
        </button>
      </div>
    </form>
  );
}
