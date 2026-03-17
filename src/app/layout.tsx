import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { createClient } from '@/utils/supabase/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoops Stats | Elite Basketball Analytics",
  description: "Performance tracking and advanced statistics for professional basketball coaching.",
  appleWebApp: {
    title: "Hoops Stats",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex bg-navy-dark text-slate-50 selection:bg-hoops-orange/30`}>
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {user && <Navbar />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-navy-dark via-navy-dark to-slate-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
