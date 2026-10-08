"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/assets";
import { APP_ROUTES } from "@/lib/data/service-config";

/*
 * LoginForm — FormFields 6031:5870, "Forgot password?" 6031:5884 and
 * ActionButtons 6031:5885 of the login card. ADDED 2026-09-30 (branch
 * feedback-ui).
 *
 * WHY. Team meeting (Bob): the presenter should TYPE a user ID and a
 * password, and any value is accepted. Until now the two fields were empty
 * presentational boxes and "Log in" was a <Link>, so the demo opened with a
 * click on a button beside two boxes nobody filled in.
 *
 * WHAT IT DOES
 *   - Real <input>s: "Email Address" (type email, autocomplete="username")
 *     and "Password" (type password, autocomplete="current-password"). Both
 *     start empty.
 *   - The eye in the password box is now a button: it shows / hides the
 *     password. Same 16px eye image, same place.
 *   - Submit with "Log in" or Enter. Either field empty (or only spaces) ->
 *     an inline error in the GNL danger style (the NL-05 terms message's
 *     classes), announced with role="alert", and the page stays. Any
 *     non-empty values -> the dashboard. Nothing is checked or stored.
 *   - `noValidate`: the browser's own "enter an email address" bubble would
 *     reject a presenter typing a plain user ID, and any value is accepted.
 *   - "Forgot password?" stays inert (the toast), as before.
 *
 * PIXELS. At rest the form draws what the static markup drew: the same
 * 40px boxes, the same labels, the same button. The <form> is
 * `display: contents`, so the three rows stay direct flex children of the
 * login card and its 24px gap is unchanged. The error line only exists
 * after a failed submit, so it is never in the `login` baseline.
 */

/** Label, 40px box and input — InputField 6031:5871 / 6031:5878. */
function Field({
  id,
  label,
  nodeId,
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
  nodeId: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  describedBy?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-start gap-[6px]"
      data-node-id={nodeId}
    >
      <label
        htmlFor={id}
        className="block w-full text-[14px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
      >
        {label}
      </label>
      {/* The box keeps its border; focus shows as a 1px #004b87 ring on it
          (the link blue), so the input itself needs no outline. */}
      <div className="box-border flex h-[40px] w-full shrink-0 items-center rounded-[6px] border border-solid border-[#d4d8da] bg-white px-[12px] focus-within:border-[#004b87] focus-within:shadow-[0_0_0_1px_#004b87]">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="m-0 h-[21px] min-w-px flex-[1_0_0] border-0 bg-transparent p-0 text-[14px] font-normal leading-[1.5] text-[#212326] outline-none"
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
    <form className="contents" noValidate onSubmit={onSubmit} aria-label="Log in">
      {/* FormFields 6031:5870 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px]"
        data-node-id="6031:5870"
      >
        <Field
          id={emailId}
          label="Email Address"
          nodeId="6031:5871"
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
        <Field
          id={passwordId}
          label="Password"
          nodeId="6031:5878"
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
              className="relative block size-[16px] shrink-0 cursor-pointer"
              data-node-id="6031:5882"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls={passwordId}
              onClick={() => setShowPassword((v) => !v)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.iconEye}
              />
            </button>
          }
        />
        {/* Only after a failed submit. The NL-05 validation message's style:
            14px, #d32f2f (§11.2 `danger`), role="alert". */}
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

      {/* No password-reset screen exists in the demo — inert, not wired. */}
      <p
        className="w-full cursor-default text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-underline-position:from-font] [word-break:break-word]"
        data-node-id="6031:5884"
        data-demo-inert="true"
      >
        Forgot password?
      </p>

      {/* ActionButtons 6031:5885 — was a <Link>, now the form's submit. */}
      <div
        className="flex w-full shrink-0 items-center justify-end"
        data-node-id="6031:5885"
      >
        <button
          type="submit"
          className="flex min-w-px flex-[1_0_0] cursor-pointer items-center justify-center overflow-clip rounded-[4px] bg-[#263854] px-[24px] py-[10px]"
          data-node-id="6031:5888"
        >
          <span className="shrink-0 text-[14px] font-bold leading-[normal] whitespace-nowrap text-white [word-break:break-word]">
            Log in
          </span>
        </button>
      </div>
    </form>
  );
}
