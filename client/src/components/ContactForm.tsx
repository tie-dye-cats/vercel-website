import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const initialFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive communications',
  }),
});

const phoneFormSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
  phoneConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive phone communications',
  }),
});

type InitialFormData = z.infer<typeof initialFormSchema>;
type PhoneFormData = z.infer<typeof phoneFormSchema>;

export function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [initialFormData, setInitialFormData] = useState<InitialFormData | null>(null);

  const initialForm = useForm<InitialFormData>({
    resolver: zodResolver(initialFormSchema),
    defaultValues: {
      firstName: '',
      email: '',
      consent: false,
    },
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
      phoneConsent: false,
    },
  });

  const onSubmitInitial = async (values: InitialFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          email: values.email,
          consent: values.consent,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setInitialFormData(values);
        setShowPhoneForm(true);
        initialForm.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || 'Something went wrong. Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: 'Error submitting form. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPhone = async (values: PhoneFormData) => {
    if (!initialFormData) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...initialFormData,
          phone: values.phone,
          phoneConsent: values.phoneConsent,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Thank you for providing your phone number!",
        });
        phoneForm.reset();
        setShowPhoneForm(false);
        setInitialFormData(null);
      } else {
        toast({
          title: "Error",
          description: result.error || 'Something went wrong. Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: 'Error submitting form. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showPhoneForm ? (
        <Form {...initialForm}>
          <form onSubmit={initialForm.handleSubmit(onSubmitInitial)} className="space-y-6">
            <FormField
              control={initialForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={initialForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={initialForm.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to receive communications about my inquiry
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">Thanks! We've received your initial information.</p>
          </div>
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={phoneForm.control}
                name="phoneConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to receive phone communications
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Phone Number'}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
