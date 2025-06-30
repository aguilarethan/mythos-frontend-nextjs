import { Navbar } from "@/components/shared/navbar";
import { BreadcrumbDemo } from "@/components/shared/breadcrumb";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar/>
      <BreadcrumbDemo />
      <main className="antialiased">
        {children}
      </main>
    </div>
  );
}

