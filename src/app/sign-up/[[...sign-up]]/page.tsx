import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-1/4 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-radial from-mint/15 to-transparent blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-3xl" />
      </div>
      <div className="flex flex-col items-center gap-6">
        <a
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Back to home"
        >
          <span className="relative grid h-8 w-8 place-items-center">
            <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent to-mint opacity-80 blur-md" />
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint">
              <span className="font-display text-sm font-bold text-background">P</span>
            </span>
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-white">
            Pulse
          </span>
        </a>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "bg-white/[0.03] border border-white/10 shadow-card-lift backdrop-blur-xl rounded-3xl",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton:
                "bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.07]",
              socialButtonsBlockButtonText: "text-white",
              formButtonPrimary:
                "bg-gradient-to-b from-white to-[#d8dde6] text-[#0a0a0a] hover:from-white hover:to-white",
              formFieldLabel: "text-white/70",
              formFieldInput:
                "bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
              footerActionLink: "text-accent hover:text-accent/80",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-accent",
              formFieldAction: "text-accent hover:text-accent/80",
              alert: "bg-danger/10 border border-danger/30 text-danger",
            },
            variables: {
              colorPrimary: "#4F8CFF",
              colorBackground: "#0A0A0A",
              colorInputBackground: "rgba(255,255,255,0.04)",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.6)",
              colorNeutral: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            },
          }}
        />
      </div>
    </div>
  );
}
