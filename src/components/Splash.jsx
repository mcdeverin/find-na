import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";

const LOGO_URL =
  "https://media.base44.com/images/public/6a82709af51cf17b237590ab/d3667819f_ChatGPTImageAug17202612_02_17AM.png";

export default function Splash() {
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fading"), 1400);
    const t2 = setTimeout(() => setPhase("gone"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#27534F] transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src={LOGO_URL}
        alt="Find NA"
        fittingType="fit"
        originWidth={1024}
        originHeight={1024}
        className="h-64 w-64"
      />
    </div>
  );
}