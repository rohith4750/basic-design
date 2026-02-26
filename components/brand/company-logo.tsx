"use client";

import Image from "next/image";
import { useState } from "react";

type CompanyLogoProps = {
  compact?: boolean;
  fill?: boolean;
  className?: string;
};

export function CompanyLogo({ compact = false, fill = false, className = "" }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center ${className}`}>
      {!imageError ? (
        <Image
          src="/frame-flow-logo.png"
          alt="Frame Flow Solutions Pvt Ltd"
          width={fill ? 560 : compact ? 44 : 220}
          height={fill ? 560 : compact ? 44 : 220}
          className={
            fill
              ? "h-full w-full object-contain"
              : compact
                ? "h-11 w-11 rounded-md object-cover shadow-sm"
                : "h-auto w-40 object-contain"
          }
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-fuchsia-500 text-sm font-extrabold text-white shadow-md">
          FF
        </div>
      )}
    </div>
  );
}
