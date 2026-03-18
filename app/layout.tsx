import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

const siteName = "The AI Agent Index";
const siteDescription =
  "The structured index of AI agents for business automation.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: "%s | The AI Agent Index"
  },
  description: siteDescription,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {siteName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{siteDescription}</p>
            </div>
            <div className="rounded-full border border-gray-200 px-3 py-1 text-xs uppercase tracking-wide text-gray-500">
              Dataset-first directory
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-8 border-t border-gray-200 pt-6 text-xs text-gray-500">
            <p>
              Built for humans and AI systems. JSON API available at{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.7rem]">
                /api/agents
              </code>
              .
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}

