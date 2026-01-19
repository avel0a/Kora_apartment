import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Booking } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: [api.bookings.list.path],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-primary">Guest Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.guestName}</TableCell>
                    <TableCell>{booking.guestEmail}</TableCell>
                    <TableCell>{booking.roomId}</TableCell>
                    <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.createdAt ? format(new Date(booking.createdAt), "MMM dd, HH:mm") : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {!bookings?.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
