'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

// Form validation schema
const leadFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
  question: z.string().min(1, 'Please tell us how we can help you'),
  phone: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to our privacy policy to continue'
  })
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface MultiStepLeadFormProps {
  onClose?: () => void
}

export function MultiStepLeadForm({ onClose }: MultiStepLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      first_name: '',
      email: '',
      question: '',
      phone: '',
      consent: false
    }
  })

  const steps = [
    {
      field: 'first_name',
      label: 'What\'s your first name?',
      placeholder: 'Your first name',
      type: 'text'
    },
    {
      field: 'email',
      label: 'What\'s your email address?',
      placeholder: 'your@email.com',
      type: 'email'
    },
    {
      field: 'phone',
      label: 'Phone number? (Optional)',
      placeholder: '(555) 123-4567',
      type: 'tel'
    },
    {
      field: 'question',
      label: 'How can we help you?',
      placeholder: 'Tell us about your current ad challenges...',
      type: 'textarea'
    },
    {
      field: 'consent',
      label: 'Almost done!',
      type: 'consent'
    }
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    const fieldName = currentStepData.field as keyof LeadFormData
    
    // For consent step, check if checkbox is checked
    if (currentStepData.type === 'consent') {
      const consentValue = form.getValues('consent')
      if (!consentValue) {
        form.setError('consent', { message: 'You must agree to our privacy policy to continue' })
        return
      }
    }
    
    // Validate current field
    const isValid = await form.trigger(fieldName)
    
    if (isValid) {
      if (isLastStep) {
        handleSubmit()
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const data = form.getValues()
    
      // Format phone number for Brevo (E.164 format: +1XXXXXXXXXX)
  let formattedPhone = data.phone
  if (formattedPhone) {
    const digits = formattedPhone.replace(/\D/g, '')
    if (digits.length === 10) {
      // Convert to E.164 format for Brevo
      formattedPhone = `+1${digits}`
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // Already has country code
      formattedPhone = `+${digits}`
    }
  }
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.first_name,
          email: data.email,
          question: data.question,
          phone: formattedPhone || undefined,
          source: 'website_modal'
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          onClose?.()
        }, 2000)
      } else {
        console.error('Form submission error')
      }
    } catch (error) {
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  // Format phone number for display (US format for user experience)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Limit to 10 digits for US numbers
    const limitedDigits = digits.slice(0, 10)
    
    // Format for display as (XXX) XXX-XXXX
    if (limitedDigits.length >= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`
    } else if (limitedDigits.length >= 3) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`
    } else {
      return limitedDigits
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    form.setValue('phone', formatted)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Thank you!</h3>
        <p className="text-gray-300">
          We'll get back to you within 1 hour with actionable insights.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium text-white">
            {currentStepData.label}
          </h3>

          {currentStepData.type === 'textarea' ? (
            <Textarea
              {...form.register(currentStepData.field as keyof LeadFormData)}
              placeholder={currentStepData.placeholder}
              className="min-h-[80px] bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={handleKeyPress}
              autoFocus
            />
          ) : currentStepData.type === 'consent' ? (
            <div className="space-y-4">
              <div 
                className="flex items-start space-x-3 p-4 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-750"
                onClick={() => {
                  const currentValue = form.getValues('consent')
                  form.setValue('consent', !currentValue)
                }}
              >
                <Checkbox
                  {...form.register('consent')}
                  className="mt-1 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label className="text-sm text-gray-200 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <a href="/privacy" className="text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                    Terms of Service
                  </a>
                  .
                </label>
              </div>
            </div>
          ) : (
            <Input
              {...form.register(currentStepData.field as keyof LeadFormData)}
              type={currentStepData.type}
              placeholder={currentStepData.placeholder}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={handleKeyPress}
              onChange={currentStepData.type === 'tel' ? handlePhoneChange : undefined}
              autoFocus
            />
          )}

          {form.formState.errors[currentStepData.field as keyof LeadFormData] && (
            <p className="text-red-400 text-sm">
              {form.formState.errors[currentStepData.field as keyof LeadFormData]?.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-gray-400 hover:text-white"
        >
          Back
        </Button>

        <div className="text-xs text-gray-400">
          {currentStep + 1} of {steps.length}
        </div>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isSubmitting ? 'Sending...' : isLastStep ? 'Send Message' : 'Next'}
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        🔒 Your information is secure and will never be shared with third parties.
      </p>
    </div>
  )
} 