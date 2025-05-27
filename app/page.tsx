'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LeadCaptureForm } from '@/components/lead-capture-form'
import { LeadCaptureModal } from '@/components/lead-capture-modal'
import { Button } from '@/components/ui/button'

// Rotating platforms component with brand colors
function RotatingPlatforms() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  const platforms = [
    { name: 'Facebook', color: 'text-blue-500' }, // Facebook blue
    { name: 'Google', color: 'text-red-500' }, // Google red
    { name: 'TikTok', color: 'text-pink-500' }, // TikTok pink (we'll use pink as primary)
  ]
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % platforms.length)
    }, 2000) // Change every 2 seconds
    
    return () => clearInterval(interval)
  }, [platforms.length])
  
  return (
    <span className="inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`${platforms[currentIndex].color} font-extrabold`}
        >
          {platforms[currentIndex].name}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section with Perfect Hero Image */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-white">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900"></div>
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            <span className="block">How Can We Fix Your Broken</span>
            <span className="block">
              <RotatingPlatforms /> Ad Accounts So You
            </span>
            <span className="block">Can Stop Wasting Money And Grow</span>
            <span className="block">Your Business Right Now?</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <LeadCaptureModal 
              trigger={
                <Button 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Message an Expert - Get a FREE Response in 1-Hour
                </Button>
              }
              title="Get Your FREE Ad Account Analysis"
              description="Tell us about your current ad challenges and we'll get back to you within 1 hour with actionable insights."
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto text-sm md:text-base text-gray-200"
          >
            (Trust us, we hate sales calls and wanna puke every time we get a "free marketing audit" in our inbox. We ain't got time for dat and neither do you.)
          </motion.p>
        </div>
      </section>

      {/* Section: Paid Ads Specialists */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-center"
          >
            Imagine Having a Team of Paid Ads Specialists Who Spend More Than 10-Minutes Per Day On Your Accounts Driving Real Results For Your Business.... With Zero Excuses!
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-center"
          >
            At AdVelocity, we transform your ad spend into measurable business growth. With millions in managed paid media across Facebook, Google, and TikTok, we deliver what matters: real results that scale your business.
          </motion.p>
        </div>
      </section>

      {/* Section: The AdVelocity Difference */}
      <section className="bg-gray-100 px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            The AdVelocity Difference
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg">
              We're specialists, not generalists. After running successful campaigns for fitness brands, e-commerce stores, and online learning platforms, we've developed expertise that generic marketing partners simply can't match.
            </p>
            <p className="text-lg">
              Your metrics drive our strategy. Forget vanity metrics like ROAS and CPA that look good in reports but fail to capture real business impact. We focus on what actually matters: customer acquisition costs, lifetime value, and net profitability.
            </p>
            <p className="text-lg">
              Transparency in tracking and attribution is non-negotiable. You'll always know exactly how your campaigns are performing against the metrics that truly impact your bottom line.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Rethink Marketing Metrics */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            Rethink Everything You Know About Marketing Metrics
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg">
              If your current marketing partners still rely on outdated measures like ROAS, they're positioning you for failure.
            </p>
            <p className="text-lg">
              In today's privacy-driven, omnichannel landscape, traditional metrics fall short. They offer a limited perspective and fail to capture the full customer journey or the metrics that truly impact your business growth.
            </p>
            <p className="text-lg">
              Say 'goodbye' to misaligned goals and 'hello' to measurable returns. Our approach aligns your teams, data, and efforts around the metrics that matter most for your business growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: You Deserve Better */}
      <section className="bg-gray-100 px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            You Deserve Better From Your Marketing Partner
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg">
              Your business deserves a trusted marketing specialist—one that delivers on promises and drives profitable growth.
            </p>
            <p className="text-lg">
              At our core, we are committed to one thing: achieving your business goals.
            </p>
            <p className="text-lg">
              To accomplish this, we take a comprehensive approach, immersing ourselves in your unique business model, customer journey, and product offerings. With this understanding, we develop a tailored, cross-channel digital marketing strategy designed to deliver scalable, long-term profitability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Our Conversion Engine */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            Our Conversion Engine: Aligning Expertise To Accelerate Your Growth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-lg"
          >
            We believe that the right combination of strategy, creative, and analytics creates an unstoppable conversion engine for your business.
          </motion.p>
        </div>
      </section>

      {/* Section: Strategy, Creative & Analytics */}
      <section className="bg-gray-100 px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-bold text-blue-600">Strategy That Converts</h3>
            <p className="text-lg">
              We develop data-backed strategies tailored to your specific audience and business goals, ensuring every dollar spent moves you closer to your objectives.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-bold text-blue-600">Creative That Captivates</h3>
            <p className="text-lg">
              Fresh creative perspectives unlock new levels of performance. Our approach goes beyond basic ads to create compelling messages that resonate with your ideal customers.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-bold text-blue-600">Analytics That Matter</h3>
            <p className="text-lg">
              We track the metrics that enhance your profitability while driving sustainable sales growth, not just the ones that make us look good.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: A True Extension Of Your Team */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            A True Extension Of Your Team
          </motion.h2>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="list-disc list-inside text-lg space-y-3"
          >
            <li>A proactive, collaborative partner who functions as an extension of your in-house team</li>
            <li>Unbiased, expert guidance to help you navigate tough decisions</li>
            <li>A partnership structured around your goals, not how much you spend on ads</li>
          </motion.ul>
        </div>
      </section>

      {/* Section: What We Specialize In */}
      <section className="bg-gray-100 px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold"
          >
            What We Specialize In
          </motion.h2>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="list-disc list-inside text-lg space-y-3"
          >
            <li>Paid Social Media Advertising (Facebook, Instagram, TikTok)</li>
            <li>Paid Search Advertising (Google, Microsoft)</li>
            <li>Performance Creative Development</li>
            <li>Data-Driven Campaign Optimization</li>
            <li>Cross-Channel Strategy</li>
          </motion.ul>
        </div>
      </section>

      {/* Section: How Can We Help You Right Now - Lead Capture */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              How Can We Help You Right Now?
            </h2>
            <p className="text-lg text-gray-600">
              (We'll get back to you within 1 hour)
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <LeadCaptureForm 
              title="Get Your FREE Ad Account Analysis"
              description="Tell us about your current ad challenges and we'll provide actionable insights to improve your performance."
              className="shadow-xl"
            />
          </motion.div>
        </div>
      </section>
    </main>
  )
}

function TestSupabaseButton() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = React.useState('')

  const testConnection = async () => {
    setStatus('loading')
    setMessage('')
    
    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage('✅ Database connection verified!')
      } else {
        setStatus('error')
        setMessage(`❌ ${data.error}: ${data.details || data.message}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Failed to test connection')
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={testConnection}
        disabled={status === 'loading'}
        variant="outline"
        size="sm"
      >
        {status === 'loading' ? 'Testing...' : 'Verify Database Connection'}
      </Button>
      
      {message && (
        <div className={`p-3 rounded-md text-sm ${
          status === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
} 