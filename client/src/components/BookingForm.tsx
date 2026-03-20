import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { CalendarIcon, Loader2, Users, User, Mail } from "lucide-react";
import { z } from "zod";
import { DateRange } from "react-day-picker";

interface BookingFormProps {
  roomId: number;
  roomName: string;
}

// Ensure the form takes the combined date range object
const formSchema = z.object({
  roomId: z.number(),
  adults: z.number().min(1),
  children: z.number().min(0),
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Invalid email address"),
  dateRange: z.object({
    from: z.date({ required_error: "Check-in date is required" }),
    to: z.date({ required_error: "Check-out date is required" }).optional(), // Optional initially during selection
  }).refine((data) => data.from && data.to, "Please select both check-in and check-out dates"),
});

type FormData = z.infer<typeof formSchema>;

export function BookingForm({ roomId, roomName }: BookingFormProps) {
  const { mutate, isPending } = useCreateBooking();
  
  // Default to selecting today and tomorrow
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId,
      adults: 2,
      children: 0,
      guestName: "",
      guestEmail: "",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 1),
      }
    },
  });

  const onSubmit = (data: FormData) => {
    if (!data.dateRange.from || !data.dateRange.to) return;
    
    // Map to the backend expected schema (which expects checkIn/checkOut strings)
    mutate({
      roomId: data.roomId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      adults: data.adults,
      children: data.children,
      checkIn: format(data.dateRange.from, "yyyy-MM-dd"),
      checkOut: format(data.dateRange.to, "yyyy-MM-dd"),
    }, {
      onSuccess: () => {
        form.reset();
        setDate({
          from: new Date(),
          to: addDays(new Date(), 1),
        });
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-border/60">
      <div className="mb-8">
        <h3 className="text-2xl font-serif text-primary mb-2">Reserve Your Stay</h3>
        <p className="text-muted-foreground text-sm">
          Securing the <span className="font-semibold text-accent">{roomName}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Date Range Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <CalendarIcon size={16} className="text-primary" /> Select Dates
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal h-12 rounded-lg border-muted-foreground/30 hover:border-primary/50 transition-colors ${
                  !date && "text-muted-foreground"
                }`}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick your travel dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    form.setValue("dateRange", newDate as any, { shouldValidate: true });
                  }
                }}
                numberOfMonths={2}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                className="rounded-md border-0"
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.dateRange && (
            <p className="text-destructive text-xs mt-1">{form.formState.errors.dateRange.message}</p>
          )}
        </div>

        {/* Guests */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults" className="text-sm font-semibold flex items-center gap-2">
              <User size={16} className="text-primary" /> Adults
            </Label>
            <Input 
              id="adults" 
              type="number" 
              min="1" 
              className="h-12 rounded-lg"
              {...form.register("adults", { valueAsNumber: true })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children" className="text-sm font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" /> Children
            </Label>
            <Input 
              id="children" 
              type="number" 
              min="0" 
              className="h-12 rounded-lg"
              {...form.register("children", { valueAsNumber: true })} 
            />
          </div>
        </div>

        {/* Guest Info */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="guestName" className="text-sm font-semibold">Full Name</Label>
            <Input 
              id="guestName" 
              placeholder="e.g. John Doe" 
              className="h-12 rounded-lg"
              {...form.register("guestName")} 
            />
            {form.formState.errors.guestName && (
              <p className="text-destructive text-xs">{form.formState.errors.guestName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestEmail" className="text-sm font-semibold flex items-center gap-2">
               Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                id="guestEmail" 
                type="email" 
                placeholder="john@example.com" 
                className="h-12 pl-10 rounded-lg"
                {...form.register("guestEmail")} 
              />
            </div>
            {form.formState.errors.guestEmail && (
              <p className="text-destructive text-xs">{form.formState.errors.guestEmail.message}</p>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-serif rounded-lg shadow-md transition-all ease-in-out duration-300 hover:shadow-xl hover:-translate-y-1" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </Button>
          <div className="bg-secondary/20 p-3 mt-4 rounded-lg flex items-center justify-center gap-2 text-sm text-primary/80">
            <CalendarIcon size={16} className="text-accent" />
            <span>No payment required now. Pay upon arrival.</span>
          </div>
        </div>
      </div>
    </form>
  );
}
