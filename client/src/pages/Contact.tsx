import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCreateContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import type { z } from "zod";

type ContactForm = z.infer<typeof insertContactSchema>;

export default function Contact() {
  const { mutate, isPending } = useCreateContact();
  const form = useForm<ContactForm>({
    resolver: zodResolver(insertContactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="bg-primary pt-32 pb-16 text-center text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We are here to assist you. Reach out for bookings, events, or general inquiries.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-primary mb-6">Get in Touch</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Located conveniently on Bole Road, Momona Hotel is just 3 minutes away from Bole International Airport, making it the perfect choice for transit and business travelers.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white border border-border/60 shadow-sm rounded-lg">
                <MapPin className="text-accent w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-primary">Address</h4>
                  <p className="text-muted-foreground">Bole Road, Addis Ababa, Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white border border-border/60 shadow-sm rounded-lg">
                <Phone className="text-accent w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-primary">Phone</h4>
                  <p className="text-muted-foreground">+251 11 661 0404</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white border border-border/60 shadow-sm rounded-lg">
                <Mail className="text-accent w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-primary">Email</h4>
                  <p className="text-muted-foreground">info@momonahotel.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-border/40">
            <h3 className="text-2xl font-serif text-primary mb-6">Send a Message</h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="John Doe" {...form.register("name")} />
                {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
                {form.formState.errors.email && <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Inquiry about..." {...form.register("subject")} />
                {form.formState.errors.subject && <p className="text-destructive text-sm">{form.formState.errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" {...form.register("message")} />
                {form.formState.errors.message && <p className="text-destructive text-sm">{form.formState.errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full btn-primary h-12" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
              </Button>
            </form>
          </div>

        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-[400px] bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p className="flex items-center gap-2"><MapPin /> Map Integration Placeholder (Addis Ababa)</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
