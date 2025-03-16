import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>No‑BS Blog – AdVelocity</title>
        <meta
          name="description"
          content="No‑BS Blog: Real talk on marketing, advertising, and growth. Get straight-up advice without the BS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main className="bg-white text-gray-900">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen text-white">
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              poster="https://source.unsplash.com/1600x900/?urban,graffiti"
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
              No‑BS Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto text-lg md:text-xl"
            >
              Real talk on marketing, advertising, and growth. No fluff, no BS—just straight-up insights.
            </motion.p>
          </div>
          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Blog Post: Why Your Ad Copy Sucks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-b pb-8"
            >
              <h2 className="text-3xl font-bold mb-4">
                Why Your Ad Copy Sucks
              </h2>
              <p className="text-lg text-gray-700">
                If your ad copy isn't driving results, it's time to face the brutal truth. We break down the mistakes and show you how to fix it—no BS included.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg transform transition-all duration-300"
              >
                Read More
              </motion.button>
            </motion.div>

            {/* Additional Blog Posts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-b pb-8"
            >
              <h2 className="text-3xl font-bold mb-4">
                Stop Obsessing Over ROAS
              </h2>
              <p className="text-lg text-gray-700">
                Why return on ad spend is the most overrated metric in digital marketing, and what you should be measuring instead.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg transform transition-all duration-300"
              >
                Read More
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
