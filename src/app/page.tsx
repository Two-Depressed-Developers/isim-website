"use client"

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [num, setNum] = useState(0);

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Welcome!</h1>
    </div>
  );
}
