import Hero from "@/components/Hero";
import Applications from "@/components/Applications";
import Features from "@/components/Features";
import Vision from "@/components/Vision";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Applications />
      <Features />
      <Vision />
      <Footer />
    </div>
  );
};

export default Index;
