import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
