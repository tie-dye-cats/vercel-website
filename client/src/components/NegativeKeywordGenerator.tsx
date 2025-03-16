import { useState } from 'react';
import { motion } from 'framer-motion';

export function NegativeKeywordGenerator() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')

  const generateKeywords = () => {
    const words = inputText.split(/[,\s]+/).filter(word => word.trim().length > 0)
    const negatives = words.map(word => `-${word}`)
    setResult(negatives.join(' '))
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Negative Keyword Generator</h2>
        <p className="mb-4 text-lg text-gray-700">
          Enter keywords (separated by commas or spaces) and we'll generate negative keywords for you—no nonsense.
        </p>
        <textarea
          className="w-full border p-4 rounded-lg mb-4 focus:ring-2 focus:ring-black focus:border-transparent"
          rows={3}
          placeholder="e.g. free, discount, cheap, low quality"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateKeywords}
          className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-full text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg transform transition-all duration-300"
        >
          Generate Negative Keywords
        </motion.button>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gray-100 rounded-lg shadow-inner"
          >
            <h3 className="text-lg font-bold mb-2">Your Negative Keywords:</h3>
            <p className="text-gray-800 break-words font-mono">{result}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
