import type { Metadata } from "next";

export const metadata: Metadata ={
  title: "Ant-Drop Histórico",
  description: "your ant-drop search history"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <>{children}</>
  )
}