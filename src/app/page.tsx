import {
  AboutPreview,
  FeaturedServices,
  GalleryPreview,
  HeroSection,
  InstagramAndMap,
  PackagesSection,
  SocialProofSection
} from "@/components/home-sections";
import { Newsletter } from "@/components/newsletter";
import { SearchBox } from "@/components/search-box";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="container pb-8">
        <SearchBox />
      </section>
      <FeaturedServices />
      <AboutPreview />
      <GalleryPreview />
      <PackagesSection />
      <SocialProofSection />
      <InstagramAndMap />
      <Newsletter />
    </>
  );
}
