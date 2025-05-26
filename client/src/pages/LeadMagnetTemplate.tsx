import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LeadForm } from '@/components/LeadForm';

interface LeadMagnetTemplateProps {
  title: string;
  description: string;
  offer: string;
  bulletPoints?: string[];
  buttonText?: string;
}

export default function LeadMagnetTemplate({ 
  title, 
  description, 
  offer,
  bulletPoints = [],
  buttonText 
}: LeadMagnetTemplateProps) {
  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
    // Handle form submission - to be implemented based on needs
  };

  return (
    <>
      <Helmet>
        <title>{title} - AdVelocity</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main className="min-h-screen bg-white">
        <div className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-black opacity-5"
            style={{
              backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
              backgroundSize: '20px 20px'
            }}
          />
          
          <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Content Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
                  <p className="text-lg mb-6">{description}</p>
                  
                  {bulletPoints.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {bulletPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 * index }}
                          className="flex items-center space-x-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-black" />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  
                  <p className="text-lg font-semibold">{offer}</p>
                </motion.div>

                {/* Form Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-xl"
                >
                  <LeadForm onSubmit={handleSubmit} buttonText={buttonText} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
