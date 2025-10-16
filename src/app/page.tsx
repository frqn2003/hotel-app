import Navbar from "@/componentes/Navbar";
import Hero from "@/componentes/Hero";
import Habitaciones from "@/componentes/Habitaciones/Habitaciones";
import Servicios from "@/componentes/Servicios";
import BannerPromo from "@/componentes/BannerPromo";
import Footer from "@/componentes/Footer";

export default function Home() {
  return (
    <>
    <Navbar onImportantPage={true} />  
    <Hero />
    <Habitaciones />
    <Servicios />
    <BannerPromo />
    <Footer />
    </>
  );
}
