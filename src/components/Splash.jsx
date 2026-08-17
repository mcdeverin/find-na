import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

export default function Splash() {
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fading"), 1100);
    const t2 = setTimeout(() => setPhase("gone"), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-accent transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <Logo className="h-28 w-28 text-white" />
    </div>
  );
}