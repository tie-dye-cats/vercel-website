import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
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
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const fields = [
    { name: "firstName" as const, label: "What's your first name?", type: "text" },
    { name: "lastName" as const, label: "And your last name?", type: "text" },
    { name: "email" as const, label: "What's your email address?", type: "email" },
    { name: "phone" as const, label: "Finally, your phone number?", type: "tel" },
  ];

  const currentField = fields[step];

  const handleNext = async () => {
    const fieldValue = form.getValues(currentField.name);
    const fieldError = await form.trigger(currentField.name);
    
    if (!fieldError || !fieldValue) {
      return;
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
            <Input
              type={currentField.type}
              className="w-full mb-4"
              {...form.register(currentField.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
            {form.formState.errors[currentField.name] && (
              <p className="text-red-500 text-sm mb-4">
                {form.formState.errors[currentField.name]?.message}
              </p>
            )}
            <Button 
              onClick={handleNext}
              className="w-full bg-black hover:bg-gray-800"
            >
              {step === fields.length - 1 ? "Send Message" : "Continue"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
