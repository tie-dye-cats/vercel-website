import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { NegativeKeywordGenerator } from '@/components/NegativeKeywordGenerator';

export default function FreeTools() {
  return (
    <>
      <Helmet>
        <title>Free Tools That Don't Suck – AdVelocity</title>
        <meta
          name="description"
          content="Free Tools That Don't Suck: Explore our real tools designed to give you the competitive edge. Try our Negative Keyword Generator for free."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main className="bg-white text-gray-900">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[60vh] text-white">
          <div className="absolute inset-0">
            <div 
              className="w-full h-full"
              style={{
                backgroundColor: 'black',
                backgroundImage: 'linear-gradient(45deg, #000 25%, #111 25%, #111 50%, #000 50%, #000 75%, #111 75%, #111 100%)',
                backgroundSize: '20px 20px'
              }}
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6"
            >
              Free Tools That Don't Suck
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto text-lg md:text-xl"
            >
              No fluff. Just pure, free tools designed to give you real results.
            </motion.p>
          </div>
          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Tools Section */}
        <section className="px-4 py-16 md:py-24">
          <NegativeKeywordGenerator />
        </section>
      </main>
    </>
  );
}
