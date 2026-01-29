import { FaqHome } from "@/components/modules/Home/FaqHome";
import { HomeBanner } from "@/components/modules/Home/HomeBanner";
import { HomeFeatureTutor } from "@/components/modules/Home/HomeFeatureTutor";
import { HomeReviews } from "@/components/modules/Home/HomeReviews";
import { HomeServices } from "@/components/modules/Home/HomeServices";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container space-y-12 py-2">
        <HomeBanner />
        <HomeServices />
        <HomeFeatureTutor />
        <HomeReviews />
        <FaqHome />
      </main>
    </div>
  );
}
