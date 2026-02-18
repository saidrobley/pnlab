"use client";

interface CTAProps {
  onOpenModal: () => void;
}

export default function CTA({ onOpenModal }: CTAProps) {
  return (
    <section className="px-10 py-[120px] text-center relative">
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(34,197,94,0.06),transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <h2 className="font-serif text-[clamp(36px,5vw,64px)] font-normal tracking-tight mb-5 relative">
        Ready to find your edge?
      </h2>
      <p className="text-text-muted text-sm mb-10 font-light relative">
        Join the waitlist and be first to find your edge.
      </p>
      <div className="flex gap-4 justify-center relative">
        <button
          className="bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          onClick={onOpenModal}
        >
          Join the Waitlist
        </button>
      </div>
    </section>
  );
}
