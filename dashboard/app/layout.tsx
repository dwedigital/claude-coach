import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coach Dashboard",
  description: "Triathlon training dashboard — Coach Claude",
};

// Inline script runs before React hydrates — avoids flash of wrong theme
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
