import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type BookingInput = z.infer<typeof api.bookings.create.input>;

export function useCreateBooking() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: BookingInput) => {
      // Ensure numeric fields are numbers (standard HTML form behavior sends strings)
      const formattedData = {
        ...data,
        adults: Number(data.adults),
        children: Number(data.children),
        roomId: Number(data.roomId)
      };

      const res = await fetch(api.bookings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Received",
        description: "We will contact you shortly to confirm your reservation.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
