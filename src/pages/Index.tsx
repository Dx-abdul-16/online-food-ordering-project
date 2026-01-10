import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import PartnerSection from "@/components/home/PartnerSection";
import AppDownload from "@/components/home/AppDownload";
import ChatBot from "@/components/chatbot/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedRestaurants />
        <PartnerSection />
        <AppDownload />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
