import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ClientProviders from '@/components/Providers/ClientProviders';
import theme from '@/lib/theme';
import "./globals.css";

export const metadata: Metadata = {
  title: "Artale 組隊網站",
  description: "幫助 Artale 玩家尋找組隊夥伴的網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ClientProviders>
              <CssBaseline />
              {children}
            </ClientProviders>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
