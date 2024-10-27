"use client"
import "./globals.css";
import { useMounted } from './hooks/isMounted';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mounted = useMounted();

  return (
    <>
      {mounted &&
        <body>
          {children}
        </body>
      }
    </>
  );
}
