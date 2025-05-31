// src/app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load Geist Sans and Geist Mono fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VectorQuerycorns",
  description: "Chat-style data analysis by VectorQuerycorns",
  /*
  icons: {
    icon: './icon.ico',
    shortcut: './icon.ico',
    apple: './apple-icon.png',
  },
  */
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Page title and description */}
        <title>🦄 VectorQuerycorns</title>
        <meta name="description" content="Chat-style data analysis by VectorQuerycorns" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}