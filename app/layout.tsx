import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'katex/dist/katex.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Homepage",
  description: "数式が書ける私のホームページです",
};

// ヘッダーコンポーネント
function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="text-xl font-bold text-gray-800">Tatsuki Homepage</div>
      </nav>
    </header>
  );
}

// フッターコンポーネント
function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; 2025 Your Name. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="container mx-auto px-6 py-8 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}