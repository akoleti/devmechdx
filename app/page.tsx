import HeroSection from '@/components/HeroSection';
import KeyFeatures from '@/components/sections/KeyFeatures';
import Benefits from '@/components/sections/Benefits';
import IndustrySolutions from '@/components/sections/IndustrySolutions';
import Integrations from '@/components/sections/Integrations';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import Resources from '@/components/sections/Resources';
import CallToAction from '@/components/sections/CallToAction';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="bg-white">
        <HeroSection />
        <KeyFeatures />
        <Benefits />
        <IndustrySolutions />
        <Integrations />
        <Testimonials />
        <Pricing />
        <Resources />
        <CallToAction />
      </div>
    </Layout>
  );
}
