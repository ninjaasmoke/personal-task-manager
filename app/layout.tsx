import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { IBM_Plex_Sans } from "next/font/google";
import type { Metadata } from "next";

const appFont = IBM_Plex_Sans({ weight: "400" });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A personal task manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={appFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
