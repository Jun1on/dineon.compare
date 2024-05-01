"use client";
import { useEffect, useRef, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Select } from "./select";

export default function BackgroundGradientAnimationDemo() {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [gradientX, setGradientX] = useState(50);
  const [gradientY, setGradientY] = useState(50);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      // Calculate gradient position as a percentage of the bounding box size
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setGradientX(x);
      setGradientY(y);
    }
  };

  return (
    <div onMouseMove={handleMouseMove} className="h-screen w-full bg-black bg-grid-white/[0.1] relative flex justify-center antialiased overflow-hidden">
      <div
        ref={interactiveRef}
        className={`absolute inset-0 bg-blue`/* [mask-image:radial-gradient(ellipse_at_3.76%_6.29%,transparent_0%,black)]*/}
        style={{
          background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, transparent, black)`,
        }}
      ></div>
      
      <div className="flex flex-col items-center p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center mt-24 mb-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500 bg-opacity-50">
            Compare dining options.
          </span>
        </h1>
        <Select />
      </div>
    </div>
  );
}
