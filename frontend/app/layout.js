import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import siteConfig from "@/lib/config";

export const metadata = {
  title: siteConfig.title,
  description: `${siteConfig.nickname}'s Blog`,
  icons: {
    icon: siteConfig.favicon,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
