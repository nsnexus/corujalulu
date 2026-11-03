"use client";

interface StepIconProps {
  step: number;
}

export default function StepIcon({ step }: StepIconProps) {
  if (step === 1) {
    return (
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-coral-500 to-amber-400 text-white shadow-lg shadow-coral-500/25">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
          <path d="m19 5 2 2" stroke="#FDE047" strokeWidth="2.5" />
          <path d="m19 7 2-2" stroke="#FDE047" strokeWidth="2.5" />
        </svg>
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-[11px] font-black text-ink shadow">
          ⭐
        </span>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-magic-600 to-magic-400 text-white shadow-lg shadow-magic-600/25">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-sun-400 text-[11px] font-black text-ink shadow">
          🎨
        </span>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-sun-400 text-ink shadow-lg shadow-amber-500/25">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          <circle cx="12" cy="8" r="2" fill="currentColor" />
        </svg>
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-magic-600 text-[11px] font-black text-white shadow">
          👀
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-600/25">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-sun-400 text-[11px] font-black text-ink shadow">
        🎵
      </span>
    </div>
  );
}

