import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AdPlatformSlider } from '@/components/AdPlatformSlider';
import { ContactForm } from '@/components/ContactForm';
import { useState } from 'react';
import { StepDialog } from '@/components/StepDialog';

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    console.log('Button clicked, opening dialog');
    setIsDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>AdVelocity - Your Ad Growth Partner</title>
        <meta
          name="description"
          content="AdVelocity transforms your ad spend into measurable business growth. With millions in managed paid media, we deliver real results that scale your business."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main className="bg-white text-gray-900">
        {/* Hero Section with Video Background */}
        <section className="relative flex flex-col items-center justify-center min-h-[95vh] text-white overflow-hidden -mt-5">
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              onError={(e) => {
                console.error('Video error:', e);
                const videoElement = e.target as HTMLVideoElement;
                console.log('Video source:', videoElement.currentSrc);
                console.log('Video ready state:', videoElement.readyState);
                console.log('Video error code:', videoElement.error?.code);
                console.log('Video error message:', videoElement.error?.message);
              }}
              className="w-full h-full object-cover scale-105"
            >
              <source 
                src="/assets/AdVelocity_Home_Page_Video.mp4" 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg"
            >
              How Can We Fix Your Broken <AdPlatformSlider /> Ad Accounts So You Can Stop Wasting Money And Grow Your Business Right Now?
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleButtonClick}
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-8 rounded-full text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-[#1877F2] shadow-lg transform transition-all duration-300"
            >
              Message an Expert--Get a FREE Response in 1-Hour
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto text-sm md:text-base opacity-90"
            >
              (Trust us, we hate sales calls and wanna puke every time we get a "free marketing audit" in our inbox. We ain't got time for dat and neither do you.)
            </motion.p>
          </div>
          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Section: Paid Ads Specialists */}
        <section className="px-4 py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl md:text-2xl font-bold leading-tight">
                Imagine Having a Team of Paid Ads Specialists Who Spend More Than 10-Minutes Per Day On Your Accounts Driving Real Results For Your Business.... With Zero Excuses!
              </p>
              <p className="text-lg md:text-xl mt-6">
                At AdVelocity, we transform your ad spend into measurable business growth. With millions in managed paid media across Facebook, Google, and TikTok, we deliver what matters: real results that scale your business.
              </p>
            </motion.div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 w-64 h-64 bg-black opacity-5 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-16 w-48 h-48 bg-black opacity-5 rounded-full"></div>
        </section>

        {/* Section: The AdVelocity Difference */}
        <section className="bg-black text-white px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold mb-8">The AdVelocity Difference</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-lg">
                    We're specialists, not generalists. After running successful campaigns for fitness brands, e-commerce stores, and online learning platforms, we've developed expertise that generic marketing partners simply can't match.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-lg">
                    Your metrics drive our strategy. Forget vanity metrics like ROAS and CPA that look good in reports but fail to capture real business impact. We focus on what actually matters: customer acquisition costs, lifetime value, and net profitability.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Decorative diagonal lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: "linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)",
              backgroundSize: "60px 60px"
            }}></div>
          </div>
        </section>

        {/* Section: Rethink Marketing Metrics */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">Rethink Everything You Know About Marketing Metrics</h2>
            <p className="text-lg">
              If your current marketing partners still rely on outdated measures like ROAS, they're positioning you for failure.
            </p>
            <p className="text-lg">
              In today's privacy-driven, omnichannel landscape, traditional metrics fall short. They offer a limited perspective and fail to capture the full customer journey or the metrics that truly impact your business growth.
            </p>
            <p className="text-lg">
              Say 'goodbye' to misaligned goals and 'hello' to measurable returns. Our approach aligns your teams, data, and efforts around the metrics that matter most for your business growth.
            </p>
          </div>
        </section>

        {/* Section: Our Conversion Engine */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Our Conversion Engine: Aligning Expertise To Accelerate Your Growth
            </h2>
            <p className="text-lg">
              We believe that the right combination of strategy, creative, and analytics creates an unstoppable conversion engine for your business.
            </p>
          </div>
        </section>

        {/* Section: Strategy, Creative & Analytics */}
        <section className="bg-black text-white px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-xl md:text-2xl font-bold">Strategy That Converts</h3>
            <p className="text-lg">
              We develop data-backed strategies tailored to your specific audience and business goals, ensuring every dollar spent moves you closer to your objectives.
            </p>
            <h3 className="text-xl md:text-2xl font-bold">Creative That Captivates</h3>
            <p className="text-lg">
              Fresh creative perspectives unlock new levels of performance. Our approach goes beyond basic ads to create compelling messages that resonate with your ideal customers.
            </p>
            <h3 className="text-xl md:text-2xl font-bold">Analytics That Matter</h3>
            <p className="text-lg">
              We track the metrics that enhance your profitability while driving sustainable sales growth, not just the ones that make us look good.
            </p>
          </div>
        </section>

        {/* Section: What We Specialize In */}
        <section className="bg-black text-white px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">What We Specialize In</h2>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>Paid Social Media Advertising (Facebook, Instagram, TikTok)</li>
              <li>Paid Search Advertising (Google, Microsoft)</li>
              <li>Performance Creative Development</li>
              <li>Data-Driven Campaign Optimization</li>
              <li>Cross-Channel Strategy</li>
            </ul>
          </div>
        </section>

        {/* Section: How Can We Help You Right Now */}
        <section className="px-4 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold">How Can We Help You Right Now?</h2>
              <p className="text-lg mb-8">(We'll get back to you within 1 hour)</p>
              <div className="bg-white p-8 rounded-lg shadow-2xl">
                <ContactForm />
              </div>
            </motion.div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </section>
        <StepDialog 
          isOpen={isDialogOpen}
          onClose={() => {
            console.log('Closing dialog');
            setIsDialogOpen(false);
          }}
        />
      </main>
    </>
  );
}