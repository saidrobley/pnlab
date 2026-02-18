"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TerminalPreview from "@/components/TerminalPreview";
import Features from "@/components/Features";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <Navbar onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <TerminalPreview />
      <Features />
      <StatsBar />
      <HowItWorks />
      <Pricing onOpenModal={openModal} />
      <CTA onOpenModal={openModal} />
      <Footer />
      <WaitlistModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
