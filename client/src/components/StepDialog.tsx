import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  question: z.string().min(10, "Please tell us a bit more about your situation"),
  marketingConsent: z.boolean().default(false),
  communicationConsent: z.boolean().default(false),
});

interface StepDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StepDialog({ isOpen, onClose }: StepDialogProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      question: "",
      marketingConsent: false,
      communicationConsent: false,
    },
  });

  const fields = [
    {
      name: "firstName",
      label: "Hey, can't wait to chat! Before we send our reply, can we get your first name?",
      type: "text",
      placeholder: "First Name"
    },
    {
      name: "email",
      label: "Drop your email below to get our unfiltered reply.",
      type: "email",
      placeholder: "Email",
      disclaimer: "We'll clear the smoke on those trash metrics in no time—then we'll be toastin' to your big win."
    },
    {
      name: "phone",
      label: "Your phone number is not required but if you prefer getting down to business over text or by phone, then we're going to need those digits.",
      type: "tel",
      placeholder: "Phone Number",
      disclaimer: "(We won't blow up your phone with dumb offers or try to get you on more calls. Just don't ghost us ;)"
    },
    {
      name: "question",
      label: "We're all ears—tell us what's going down in the box below.",
      type: "textarea",
      placeholder: "What's on your mind? Tell us about your ad challenges..."
    },
    {
      name: "consent",
      label: "Last thing—just to keep everything legit before we get cookin'...",
      type: "checkbox",
      isConsentStep: true,
    },
  ];

  const currentField = fields[step];

  const handleNext = async () => {
    if (currentField.isConsentStep) {
      const marketingConsent = form.getValues("marketingConsent");
      const communicationConsent = form.getValues("communicationConsent");

      if (!marketingConsent || !communicationConsent) {
        form.setError("marketingConsent", {
          type: "manual",
          message: "Please agree to both consent options to continue",
        });
        return;
      }

      try {
        const values = form.getValues();
        console.log("Starting form submission with data:", values);

        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });

        console.log("Form submission response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Form submission error:", errorData);
          throw new Error(errorData.message || 'Failed to submit form');
        }

        const responseData = await response.json();
        console.log("Form submission successful:", responseData);

        toast({
          title: "Success! 🎯",
          description: "Your question is on its way to our experts. They'll get back to you within one hour!",
        });

        onClose();
        form.reset();
        setStep(0);
      } catch (error) {
        console.error('Form submission error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
        });
      }
    } else {
      const fieldName = currentField.name as keyof z.infer<typeof formSchema>;
      const fieldValue = form.getValues(fieldName);
      const fieldError = await form.trigger(fieldName);

      console.log(`Field validation - Name: ${fieldName}, Value: ${fieldValue}, Valid: ${fieldError}`);

      if (!fieldError || !fieldValue) {
        return;
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setStep(0);
      form.reset();
    }}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            <h2 className="text-2xl font-bold mb-4">{currentField.label}</h2>
            {!currentField.isConsentStep ? (
              <div className="space-y-2">
                {currentField.type === "textarea" ? (
                  <textarea
                    className="w-full min-h-[120px] p-3 rounded-md border focus:ring-2 focus:ring-[#1877F2] focus:border-transparent"
                    placeholder={currentField.placeholder}
                    {...form.register("question")}
                  />
                ) : (
                  <Input
                    type={currentField.type}
                    className="w-full"
                    placeholder={currentField.placeholder}
                    {...form.register(currentField.name as "firstName" | "email" | "phone")}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                  />
                )}
                {'disclaimer' in currentField && (
                  <p className="text-sm text-gray-500 italic">
                    {currentField.disclaimer}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketingConsent"
                    {...form.register("marketingConsent")}
                  />
                  <label
                    htmlFor="marketingConsent"
                    className="text-sm text-gray-600"
                  >
                    I agree to receive marketing communications from AdVelocity about products, services, and industry insights.
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="communicationConsent"
                    {...form.register("communicationConsent")}
                  />
                  <label
                    htmlFor="communicationConsent"
                    className="text-sm text-gray-600"
                  >
                    I understand and agree that AdVelocity will use my information in accordance with their privacy policy to provide the requested services.
                  </label>
                </div>
              </div>
            )}
            {form.formState.errors[currentField.name as keyof typeof form.formState.errors] && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors[currentField.name as keyof typeof form.formState.errors]?.message}
              </p>
            )}
            <div className="space-y-2 mt-4">
              <Button
                onClick={handleNext}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                {step === fields.length - 1 ? "Send Message to a Real Person (Not a Bot)" : "Continue"}
              </Button>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
                >
                  Go back
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}