import { Navbar } from "@/components/shared/navbar";
import { AppHorizontalMenu } from "@/components/shared/settings-menu";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppHorizontalMenu activeUrl="/settings/account" />
      <main className="antialiased">{children}</main>
    </div>
  );
}
