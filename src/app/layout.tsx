import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoops Stats | Elite Basketball Analytics",
  description: "Performance tracking and advanced statistics for professional basketball coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex bg-navy-dark text-slate-50 selection:bg-hoops-orange/30`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-navy-dark via-navy-dark to-slate-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
