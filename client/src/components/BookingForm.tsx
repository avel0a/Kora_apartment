import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { z } from "zod";

interface BookingFormProps {
  roomId: number;
  roomName: string;
}

// Frontend schema tweaks (dates as Date objects, not strings for the form)
const formSchema = insertBookingSchema.extend({
  checkIn: z.date(),
  checkOut: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export function BookingForm({ roomId, roomName }: BookingFormProps) {
  const { mutate, isPending } = useCreateBooking();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId,
      adults: 1,
      children: 0,
      guestName: "",
      guestEmail: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({
      ...data,
      // Date-fns format creates string YYYY-MM-DD
      checkIn: format(data.checkIn, "yyyy-MM-dd"),
      checkOut: format(data.checkOut, "yyyy-MM-dd"),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-border/50 shadow-sm rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif mb-2">Book Your Stay</h3>
        <p className="text-muted-foreground text-sm">Reserving: <span className="font-semibold text-primary">{roomName}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check In */}
        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("checkIn") ? format(form.watch("checkIn"), "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch("checkIn")}
                onSelect={(date) => date && form.setValue("checkIn", date)}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.checkIn && <p className="text-destructive text-xs">Required</p>}
        </div>

        {/* Check Out */}
        <div className="space-y-2">
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("checkOut") ? format(form.watch("checkOut"), "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch("checkOut")}
                onSelect={(date) => date && form.setValue("checkOut", date)}
                initialFocus
                disabled={(date) => date < (form.watch("checkIn") || new Date())}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.checkOut && <p className="text-destructive text-xs">Required</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">Adults</Label>
          <Input id="adults" type="number" min="1" {...form.register("adults", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Children</Label>
          <Input id="children" type="number" min="0" {...form.register("children", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestName">Full Name</Label>
        <Input id="guestName" placeholder="John Doe" {...form.register("guestName")} />
        {form.formState.errors.guestName && <p className="text-destructive text-xs">{form.formState.errors.guestName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestEmail">Email Address</Label>
        <Input id="guestEmail" type="email" placeholder="john@example.com" {...form.register("guestEmail")} />
        {form.formState.errors.guestEmail && <p className="text-destructive text-xs">{form.formState.errors.guestEmail.message}</p>}
      </div>

      <Button type="submit" className="w-full btn-primary h-12 text-lg" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          "Confirm Reservation"
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        No payment required now. Pay upon arrival.
      </p>
    </form>
  );
}
