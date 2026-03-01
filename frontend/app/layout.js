import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
        <ThemeProvider>
          <div className="flex flex-col min-h-screen w-full">
            <Header />
            <main className="main-content flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
