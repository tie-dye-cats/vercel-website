import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AdPlatformSlider } from '@/components/AdPlatformSlider';

export default function Home() {
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
        <section className="relative flex flex-col items-center justify-center min-h-screen text-white">
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              poster="https://source.unsplash.com/1600x900/?glitch,technology"
            >
              <source src="/8632780-uhd_3840_2160_25fps_merged.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6"
            >
              How Can We Fix Your Broken <AdPlatformSlider /> Ad Accounts So You Can Stop Wasting Money And Grow Your Business Right Now?
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Message an Expert--Get a FREE Response in 1-Hour
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto text-sm md:text-base"
            >
              (Trust us, we hate sales calls and wanna puke every time we get a "free marketing audit" in our inbox. We ain't got time for dat and neither do you.)
            </motion.p>
          </div>
        </section>

        {/* Section: Paid Ads Specialists */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-xl md:text-2xl font-bold">
              Imagine Having a Team of Paid Ads Specialists Who Spend More Than 10-Minutes Per Day On Your Accounts Driving Real Results For Your Business.... With Zero Excuses!
            </p>
            <p className="text-lg md:text-xl">
              At AdVelocity, we transform your ad spend into measurable business growth. With millions in managed paid media across Facebook, Google, and TikTok, we deliver what matters: real results that scale your business.
            </p>
          </div>
        </section>

        {/* Section: The AdVelocity Difference */}
        <section className="bg-black text-white px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">The AdVelocity Difference</h2>
            <p className="text-lg">
              We're specialists, not generalists. After running successful campaigns for fitness brands, e-commerce stores, and online learning platforms, we've developed expertise that generic marketing partners simply can't match.
            </p>
            <p className="text-lg">
              Your metrics drive our strategy. Forget vanity metrics like ROAS and CPA that look good in reports but fail to capture real business impact. We focus on what actually matters: customer acquisition costs, lifetime value, and net profitability.
            </p>
            <p className="text-lg">
              Transparency in tracking and attribution is non-negotiable. You'll always know exactly how your campaigns are performing against the metrics that truly impact your bottom line.
            </p>
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

        {/* Section: You Deserve Better */}
        <section className="bg-black text-white px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">You Deserve Better From Your Marketing Partner</h2>
            <p className="text-lg">
              Your business deserves a trusted marketing specialist—one that delivers on promises and drives profitable growth.
            </p>
            <p className="text-lg">
              At our core, we are committed to one thing: achieving your business goals.
            </p>
            <p className="text-lg">
              To accomplish this, we take a comprehensive approach, immersing ourselves in your unique business model, customer journey, and product offerings. With this understanding, we develop a tailored, cross-channel digital marketing strategy designed to deliver scalable, long-term profitability.
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

        {/* Section: A True Extension Of Your Team */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">A True Extension Of Your Team</h2>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>A proactive, collaborative partner who functions as an extension of your in-house team</li>
              <li>Unbiased, expert guidance to help you navigate tough decisions</li>
              <li>A partnership structured around your goals, not how much you spend on ads</li>
            </ul>
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
        <section className="px-4 py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold">How Can We Help You Right Now?</h2>
            <p className="text-lg">(We'll get back to you within 1 hour)</p>
          </div>
        </section>
      </main>
    </>
  );
}