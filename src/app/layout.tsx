import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ToastProvider from "@/components/ui/ToastProvider";
import { auth } from "@/auth";
import { getViewMode } from "@/lib/adminView";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DALIA.EXE — Comunidad oficial de Dalia",
  description:
    "La web oficial de la comunidad de Dalia: rankings de LoL, torneos, sorteos y predicciones.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const { isAdminView } = await getViewMode();
  const verified = session?.user?.riotVerified ?? false;

  return (
    <html lang="es" className={`${chakra.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>
          <Sidebar isAdmin={isAdminView} verified={verified} />
          <div className="lg:pl-60">
            <Topbar />
            <main className="striped-bg min-h-screen">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
