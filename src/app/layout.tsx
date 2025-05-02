import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import Header from "@/components/Header";
export const metadata: Metadata = {
  title: "Ant-Drop",
  description: "Website to recognize if a product/store operates with dropshipping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
      >
       <QueryProvider>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            <Header />
              {children}
            </ThemeProvider>
       </QueryProvider>
      </body>
    </html>
  );
}
