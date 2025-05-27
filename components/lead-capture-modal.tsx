'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MultiStepLeadForm } from './multi-step-lead-form'

interface LeadCaptureModalProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
}

export function LeadCaptureModal({ 
  trigger,
  title = "Let's Work Together",
  description = "Ready to transform your business? Tell us about your project and we'll get back to you within 24 hours."
}: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultTrigger = (
    <Button size="lg" className="bg-primary hover:bg-primary/90">
      Get Started
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-gray-900 border-gray-700 p-4">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-white">{title}</DialogTitle>
          <DialogDescription className="text-xs text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <MultiStepLeadForm onClose={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 