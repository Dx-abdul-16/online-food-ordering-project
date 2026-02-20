import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import OfferBanners from "@/components/home/OfferBanners";
import RecommendedFood from "@/components/home/RecommendedFood";
import ViralDishes from "@/components/home/ViralDishes";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import FounderStory from "@/components/home/FounderStory";
import PartnerSection from "@/components/home/PartnerSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />
      <main>
        {/* 1. Hero - Street Arabiya atmosphere + Zomato mode tabs + search */}
        <Hero />

        {/* 2. Offer Banners - Swiggy-style promo strip */}
        <OfferBanners />

        {/* 3. Food Categories - Zomato-style circular cuisine icons */}
        <Categories />

        {/* 4. Recommended Food - Zomato red theme */}
        <RecommendedFood />

        {/* 5. Viral Dishes - Street Arabiya showcase */}
        <ViralDishes />

        {/* 6. Featured Restaurants - Swiggy-style cards with filters */}
        <FeaturedRestaurants />

        {/* 7. Founder Story - Street Arabiya about/stats */}
        <FounderStory />

        {/* 8. Partner Section - Restaurant & delivery partner CTA */}
        <PartnerSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
