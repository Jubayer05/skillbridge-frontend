"use client";

import { UseFormSetValue } from "react-hook-form";

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@gmail.com",
    password: "123456abc!A",
    color:
      "text-rose-500 border-rose-200 hover:bg-rose-50 hover:border-rose-400 dark:border-rose-800 dark:hover:bg-rose-950",
  },
  {
    label: "Tutor",
    email: "tutor@gmail.com",
    password: "123456abc!A",
    color:
      "text-violet-500 border-violet-200 hover:bg-violet-50 hover:border-violet-400 dark:border-violet-800 dark:hover:bg-violet-950",
  },
  {
    label: "Student",
    email: "student@gmail.com",
    password: "123456abc!A",
    color:
      "text-emerald-500 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950",
  },
] as const;

type DemoField = { email: string; password: string };

interface DemoLoginButtonsProps {
  setValue: UseFormSetValue<DemoField>;
}

export function DemoLoginButtons({ setValue }: DemoLoginButtonsProps) {
  const fill = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true, shouldDirty: true });
    setValue("password", password, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        Quick demo fill
      </p>
      <div className="flex gap-2">
        {DEMO_ACCOUNTS.map(({ label, email, password, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => fill(email, password)}
            className={`flex-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${color}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
