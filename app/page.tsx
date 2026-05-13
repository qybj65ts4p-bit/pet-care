import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LocationMap } from "@/components/LocationMap";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import { StoreGallery } from "@/components/StoreGallery";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-28 top-[480px] h-80 w-80 rounded-full bg-brand/10 blur-lg" />
      <div className="pointer-events-none absolute -right-28 top-[820px] h-96 w-96 rounded-full bg-sage/15 blur-lg" />
      <Header />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Process />
        <Reviews />
        <Contact />
        <StoreGallery />
        <LocationMap />
      </main>
      <Footer />
      <a
        href="#contact"
        className="fixed bottom-4 left-4 right-4 z-20 inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brandDeep px-5 font-extrabold text-white shadow-[0_20px_38px_rgba(199,100,54,0.26)] sm:left-auto sm:right-5"
      >
        预约洗护
      </a>
    </div>
  );
}
