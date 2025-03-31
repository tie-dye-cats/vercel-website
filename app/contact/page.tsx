'use client';

import React from 'react';
import { ContactForm } from "../../client/src/components/ContactForm"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-600">We'd love to hear from you</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  )
} 