"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface HeaderProps {
  maxWidth: number;
  setMaxWidth: (width: number) => void;
}

export function Header({ maxWidth, setMaxWidth }: HeaderProps) {
  const [showWidthControl, setShowWidthControl] = useState(false);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Tasker</span>
          </a>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={() => setShowWidthControl(!showWidthControl)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showWidthControl ? "Hide Width" : "Adjust Width"}
          </button>
          {showWidthControl && (
            <div className="flex items-center space-x-2 w-48">
              <Slider
                value={[maxWidth]}
                min={400}
                max={1200}
                step={50}
                onValueChange={(value) => setMaxWidth(value[0])}
              />
              <span className="text-xs text-muted-foreground w-12">
                {maxWidth}px
              </span>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
