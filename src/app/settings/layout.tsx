import { Navbar } from "@/components/navbar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main className="antialiased">{children}</main>
    </div>
  );
}
