import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background-dark/80 backdrop-blur-sm border-t border-slate-800 pt-5 overflow-hidden">
      <div className="flex flex-col items-center text-center px-4">
        {/* Text content */}
        <p className="text-sm text-primary-foreground/80 mb-2">
          Questions? Email us at{" "}
          <a
            href="mailto:sales@medcodepro.com"
            className="underline hover:text-primary-foreground"
          >
            prachiiyadav2409@gmail.com
          </a>
        </p>

        <p className="text-sm text-slate-400 mb-2">&copy; 2025 SynCode AI</p>

        {/* WATERMARK — last element */}
        <span
          className="block text-6xl sm:text-8xl font-extrabold uppercase tracking-widest leading-none select-none pointer-events-none"
          style={{ color: "rgba(17, 212, 98, 0.15)" }}
        >
          SYNCODE AI
        </span>
      </div>
    </footer>
  );
};

export default Footer;
