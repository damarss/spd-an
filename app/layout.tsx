import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, items } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/page-title";
import { db } from "@/lib/db";
import IdentitasGuard from "@/components/identitas-guard";
import { Toaster } from "sonner";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPD-an",
  description: "Buat laporan SPD dengan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <IdentitasGuard>
              <main className="flex flex-col w-full m-4">
                <header className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SidebarTrigger className="cursor-pointer" />
                    <Separator orientation="vertical" className="mr-2 h-6" />
                    <PageTitle />
                  </div>
                  <ModeToggle />
                </header>
                {children}
              </main>
              <Toaster />
            </IdentitasGuard>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
