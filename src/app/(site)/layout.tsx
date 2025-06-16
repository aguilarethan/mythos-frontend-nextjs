import { Navbar } from "@/components/navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main className="antialiased">
        {children}
      </main>
    </div>
  );
}

