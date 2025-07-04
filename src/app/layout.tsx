import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { AccountProvider } from "@/context/account-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mythos",
  description: "Generated by create next app",
  icons: {
    icon: "/mythos-logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AccountProvider>
              <Toaster />
              {children}
            </AccountProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
