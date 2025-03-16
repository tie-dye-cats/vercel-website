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
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  marketingConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive marketing communications",
  }),
  communicationConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the communications terms",
  }),
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
      marketingConsent: false,
      communicationConsent: false,
    },
  });

  const fields = [
    { 
      name: "firstName" as const, 
      label: "Hey, can't wait to chat! Before we send our reply, can we get your first name?", 
      type: "text",
      placeholder: "First Name"
    },
    { 
      name: "email" as const, 
      label: "Drop your email below to get our unfiltered reply.", 
      type: "email",
      placeholder: "Email",
      disclaimer: "We'll clear the smoke on those trash metrics in no time—then we'll be toastin' to your big win."
    },
    { 
      name: "phone" as const, 
      label: "Your phone number is not required but if you prefer getting down to business over text or by phone, then we're going to need those digits.", 
      type: "tel",
      placeholder: "Phone Number",
      disclaimer: "(We won't blow up your phone with dumb offers or try to get you on more calls. Just don't ghost us ;)"
    },
    {
      name: "consent" as const,
      label: "Last thing, just to keep everything above board...",
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
    } else {
      const fieldValue = form.getValues(currentField.name);
      const fieldError = await form.trigger(currentField.name);

      if (!fieldError || !fieldValue) {
        return;
      }
    }

    if (step === fields.length - 1) {
      // Submit form
      try {
        await apiRequest('POST', '/api/leads', form.getValues());
        toast({
          title: "Message sent!",
          description: "We'll be in touch within 1 hour.",
        });
        onClose();
        form.reset();
        setStep(0);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
        });
      }
    } else {
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
                <Input
                  type={currentField.type}
                  className="w-full"
                  placeholder={currentField.placeholder}
                  {...form.register(currentField.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                />
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
            {form.formState.errors[currentField.name] && (
              <p className="text-red-500 text-sm mb-4">
                {form.formState.errors[currentField.name]?.message}
              </p>
            )}
            <div className="space-y-2">
              <Button 
                onClick={handleNext}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                {step === fields.length - 1 ? "Send Message" : "Continue"}
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