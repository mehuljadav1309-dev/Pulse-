import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
