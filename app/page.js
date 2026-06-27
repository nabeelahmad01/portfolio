import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import VideoDemo from '@/components/VideoDemo';
import About from '@/components/About';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Process from '@/components/Process';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default function Home() {
  return (
    <>
      {/* 1. Silent Client Analytics Tracker */}
      <AnalyticsTracker />

      {/* 2. Floating Live Chat Widget */}
      <ChatWidget />

      {/* 3. Header Sticky Navbar */}
      <Navbar />

      {/* 4. Sections Scroll Flow */}
      <main>
        <Hero />
        <VideoDemo />
        <About />
        <Services />
        <Work />
        <Process />
        <ContactForm />
      </main>

      {/* 5. Footer */}
      <Footer />
    </>
  );
}
