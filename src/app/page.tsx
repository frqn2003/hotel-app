import Navbar from "@/componentes/Navbar";
import Hero from "@/componentes/Hero";
import Habitaciones from "@/componentes/Habitaciones";
import Servicios from "@/componentes/Servicios";
import Footer from "@/componentes/Footer";

export default function Home() {
  return (
    <>
    <Navbar />  
    <Hero />
    <Habitaciones />
    <Servicios />
    <Footer />
    </>
  );
}
