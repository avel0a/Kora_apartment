import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking, Room, Contact, GalleryImage, RoomImage, insertRoomSchema } from "../../../shared/schema";
import { api } from "../../../shared/routes";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, CheckCircle, XCircle, Plus, Pencil, Upload, Save, Settings, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useSettings, useUpdateSettings, getSetting, type SettingsMap } from "@/hooks/use-settings";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const { data: bookings } = useQuery<Booking[]>({ 
    queryKey: [api.bookings.list.path],
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const { data: inquiries } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  // Delete mutation for contacts
  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Inquiry deleted" });
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Booking updated" });
    },
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({ title: "Room deleted" });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-8">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="contacts">Inquiries</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1"><Settings className="h-4 w-4" /> Site Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage hotel reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No bookings found
                            </TableCell>
                        </TableRow>
                    )}
                    {bookings?.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>#{booking.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.guestName}</div>
                          <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                        </TableCell>
                        <TableCell>Room #{booking.roomId}</TableCell>
                        <TableCell>
                          {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'confirmed' })}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'cancelled' })}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Room Management</CardTitle>
                    <CardDescription>Manage available rooms and pricing</CardDescription>
                </div>
                <RoomDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {rooms?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No rooms found
                            </TableCell>
                        </TableRow>
                    )}
                    {rooms?.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                            <img src={room.imageUrl} alt={room.name} className="h-10 w-16 object-cover rounded" />
                        </TableCell>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell className="text-gray-500">{room.slug}</TableCell>
                        <TableCell>${room.price}</TableCell>
                        <TableCell>{room.capacity} Guests</TableCell>
                        <TableCell>
                          <RoomImagesDialog room={room} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <RoomDialog room={room} />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                               onClick={() => {
                                   if(confirm('Are you sure you want to delete this room?')) {
                                       deleteRoom.mutate(room.id);
                                   }
                               }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          
          <TabsContent value="contacts">
            <Card>
                <CardHeader>
                    <CardTitle>Inquiries</CardTitle>
                    <CardDescription>Messages from the contact form</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No inquiries found
                          </TableCell>
                        </TableRow>
                      )}
                      {inquiries?.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="text-xs">
                            {inquiry.createdAt ? format(new Date(inquiry.createdAt), "MMM d, HH:mm") : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{inquiry.name}</div>
                            <div className="text-xs text-gray-500">{inquiry.email}</div>
                          </TableCell>
                          <TableCell className="font-medium">{inquiry.subject}</TableCell>
                          <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                               onClick={() => {
                                   if(confirm('Delete this inquiry?')) {
                                       deleteContact.mutate(inquiry.id);
                                   }
                               }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ====== Room Dialog ======

function RoomDialog({ room }: { room?: Room }) {
  const isEditing = !!room;
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertRoomSchema),
    defaultValues: {
      name: room?.name || "",
      slug: room?.slug || "",
      description: room?.description || "",
      price: room?.price || 0,
      capacity: room?.capacity || 1,
      size: room?.size || "",
      bedType: room?.bedType || "",
      imageUrl: room?.imageUrl || "",
      amenities: room?.amenities || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertRoomSchema>) => {
      const url = isEditing ? `/api/rooms/${room.id}` : "/api/rooms";
      const method = isEditing ? "PATCH" : "POST";
      const res = await apiRequest(method, url, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({ title: isEditing ? "Room updated successfully" : "Room created successfully" });
      setOpen(false);
      if (!isEditing) form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: isEditing ? "Failed to update room" : "Failed to create room",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof insertRoomSchema>) {
    mutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Room" : "Add New Room"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modify the room details below." : "Create a new room type for the hotel."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 45m²" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. King Size" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Room Image</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="Image URL or upload a file" />
                    </FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        className="hidden"
                        id="image-upload"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append("file", file);

                          try {
                            const res = await apiRequest("POST", "/api/upload", formData);
                            const data = await res.json();
                            field.onChange(data.url);
                            toast({ title: "Image uploaded successfully" });
                          } catch (err: any) {
                            console.error("Upload Error Details:", err);
                            toast({
                              title: "Upload failed",
                              description: err.message,
                              variant: "destructive",
                            });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                  {field.value && (
                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border">
                      <img src={field.value} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Room" : "Create Room")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ====== Room Images Dialog ======

function RoomImagesDialog({ room }: { room: Room }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: roomImages, isLoading } = useQuery<RoomImage[]>({
    queryKey: ["/api/rooms", room.id, "images"],
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${room.id}/images`);
      if (!res.ok) throw new Error("Failed to fetch room images");
      return res.json();
    },
    enabled: open,
  });

  const addImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await apiRequest("POST", `/api/rooms/${room.id}/images`, { imageUrl, sortOrder: (roomImages?.length || 0) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room.id, "images"] });
      toast({ title: "Image added" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add image", description: err.message, variant: "destructive" });
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/room-images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room.id, "images"] });
      toast({ title: "Image removed" });
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await apiRequest("POST", "/api/upload", formData);
      const data = await res.json();
      addImage.mutate(data.url);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3" /> Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Photos for {room.name}</DialogTitle>
          <DialogDescription>
            Manage additional photos for the room slideshow. The main image is set in room settings.
          </DialogDescription>
        </DialogHeader>

        {/* Upload */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            className="hidden"
            id={`room-img-upload-${room.id}`}
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(`room-img-upload-${room.id}`)?.click()}
            disabled={addImage.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            {addImage.isPending ? "Uploading..." : "Upload Photo"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Add photos to the room slideshow</p>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* Main image (non-deletable) */}
            <div className="relative aspect-video rounded-md overflow-hidden border-2 border-primary/30">
              <img src={room.imageUrl} alt="Main" className="w-full h-full object-cover" />
              <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>
            </div>
            {/* Extra images */}
            {roomImages?.map((img) => (
              <div key={img.id} className="relative aspect-video rounded-md overflow-hidden border group">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteImage.mutate(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {(!roomImages || roomImages.length === 0) && (
              <div className="col-span-2 flex items-center justify-center aspect-video rounded-md border border-dashed text-muted-foreground text-sm">
                No additional photos yet
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ====== Gallery Tab ======

function GalleryTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [caption, setCaption] = React.useState("");

  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json();
    },
  });

  const addImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await apiRequest("POST", "/api/gallery", { imageUrl, caption: caption || null, sortOrder: (images?.length || 0) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setCaption("");
      toast({ title: "Image added to gallery" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add image", description: err.message, variant: "destructive" });
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Image removed from gallery" });
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await apiRequest("POST", "/api/upload", formData);
      const data = await res.json();
      addImage.mutate(data.url);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Management</CardTitle>
        <CardDescription>Upload and manage images shown on the Gallery page</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="gallery-caption" className="text-sm mb-1 block">Caption (optional)</Label>
              <Input
                id="gallery-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Lobby view, Suite interior..."
              />
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                className="hidden"
                id="gallery-upload"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <Button
                onClick={() => document.getElementById("gallery-upload")?.click()}
                disabled={addImage.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                {addImage.isPending ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !images?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-40" />
            <p>No gallery images yet. Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border shadow-sm">
                <img src={image.imageUrl} alt={image.caption || ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {image.caption && (
                    <p className="text-white text-xs text-center px-2">{image.caption}</p>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Delete this gallery image?")) {
                        deleteImage.mutate(image.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ====== Site Settings Tab ======

function SettingsImageField({ label, settingKey, value, onChange }: {
  label: string;
  settingKey: string;
  value: string;
  onChange: (key: string, val: string) => void;
}) {
  const { toast } = useToast();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await apiRequest("POST", "/api/upload", formData);
      const data = await res.json();
      onChange(settingKey, data.url);
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(settingKey, e.target.value)}
          placeholder="Image URL or upload..."
          className="flex-1"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <Button type="button" variant="outline" size="icon" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      {value && (
        <div className="mt-2 relative aspect-video w-full max-w-sm overflow-hidden rounded-md border">
          <img src={value} alt={label} className="object-cover w-full h-full" />
        </div>
      )}
    </div>
  );
}

function SettingsSection({ title, description, children, onSave, isSaving }: {
  title: string;
  description: string;
  children: React.ReactNode;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
          <Button onClick={onSave} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SiteSettingsTab() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();
  const [local, setLocal] = React.useState<Record<string, string>>({});

  // Sync settings from server to local state
  React.useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      for (const [key, val] of Object.entries(settings)) {
        map[key] = val.value;
      }
      setLocal(map);
    }
  }, [settings]);

  const set = (key: string, value: string) => {
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  const saveSection = (keys: string[]) => {
    const updates: Record<string, string> = {};
    for (const key of keys) {
      if (local[key] !== undefined) {
        updates[key] = local[key];
      }
    }
    updateSettings.mutate(updates, {
      onSuccess: () => toast({ title: "Settings saved successfully" }),
      onError: (err: Error) => toast({ title: "Failed to save", description: err.message, variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Brand Section */}
      <SettingsSection
        title="🌟 Brand Settings"
        description="The main text logo and subtitle shown in the Navbar and Footer. Upload a logo to replace the text branding."
        onSave={() => saveSection(["site_name", "site_subtitle", "company_logo"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Company Logo" settingKey="company_logo" value={local.company_logo || ""} onChange={set} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Site Name / Logo Text (fallback)</Label>
            <Input value={local.site_name || ""} onChange={e => set("site_name", e.target.value)} placeholder="e.g. PANDA" />
          </div>
          <div className="space-y-2">
            <Label>Site Subtitle</Label>
            <Input value={local.site_subtitle || ""} onChange={e => set("site_subtitle", e.target.value)} placeholder="e.g. Hotel Apartments" />
          </div>
        </div>
      </SettingsSection>

      {/* Hero Section */}
      <SettingsSection
        title="🏠 Hero Section"
        description="Background image, headline, and subtitle shown on the home page"
        onSave={() => saveSection(["hero_image", "hero_title", "hero_subtitle"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Hero Background Image" settingKey="hero_image" value={local.hero_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>Hero Title</Label>
          <Input value={local.hero_title || ""} onChange={e => set("hero_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Hero Subtitle</Label>
          <Textarea value={local.hero_subtitle || ""} onChange={e => set("hero_subtitle", e.target.value)} rows={2} />
        </div>
      </SettingsSection>

      {/* About Section */}
      <SettingsSection
        title="📖 About Section"
        description="The 'about' block on the home page with image, title, and description"
        onSave={() => saveSection(["about_image", "about_title", "about_description"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="About Image" settingKey="about_image" value={local.about_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>About Title</Label>
          <Input value={local.about_title || ""} onChange={e => set("about_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>About Description</Label>
          <Textarea value={local.about_description || ""} onChange={e => set("about_description", e.target.value)} rows={3} />
        </div>
      </SettingsSection>

      {/* Page Headers */}
      <SettingsSection
        title="📄 Page Headers — Rooms"
        description="Background image and text shown at the top of the Rooms & Suites page"
        onSave={() => saveSection(["rooms_header_image", "rooms_header_tagline", "rooms_header_title", "rooms_header_subtitle"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Header Background Image" settingKey="rooms_header_image" value={local.rooms_header_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>Tagline (small text above title)</Label>
          <Input value={local.rooms_header_tagline || ""} onChange={e => set("rooms_header_tagline", e.target.value)} placeholder="e.g. Exquisite Stays" />
        </div>
        <div className="space-y-2">
          <Label>Page Title</Label>
          <Input value={local.rooms_header_title || ""} onChange={e => set("rooms_header_title", e.target.value)} placeholder="e.g. Our Rooms & Suites" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea value={local.rooms_header_subtitle || ""} onChange={e => set("rooms_header_subtitle", e.target.value)} rows={2} placeholder="Short description shown below the title" />
        </div>
      </SettingsSection>

      <SettingsSection
        title="📄 Page Headers — Gallery"
        description="Background image and text shown at the top of the Gallery page"
        onSave={() => saveSection(["gallery_header_image", "gallery_header_tagline", "gallery_header_title", "gallery_header_subtitle"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Header Background Image" settingKey="gallery_header_image" value={local.gallery_header_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>Tagline (small text above title)</Label>
          <Input value={local.gallery_header_tagline || ""} onChange={e => set("gallery_header_tagline", e.target.value)} placeholder="e.g. Visual Journey" />
        </div>
        <div className="space-y-2">
          <Label>Page Title</Label>
          <Input value={local.gallery_header_title || ""} onChange={e => set("gallery_header_title", e.target.value)} placeholder="e.g. Our Gallery" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea value={local.gallery_header_subtitle || ""} onChange={e => set("gallery_header_subtitle", e.target.value)} rows={2} placeholder="Short description shown below the title" />
        </div>
      </SettingsSection>

      <SettingsSection
        title="📄 Page Headers — Contact"
        description="Background image and text shown at the top of the Contact page"
        onSave={() => saveSection(["contact_header_image", "contact_header_tagline", "contact_header_title", "contact_header_subtitle"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Header Background Image" settingKey="contact_header_image" value={local.contact_header_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>Tagline (small text above title)</Label>
          <Input value={local.contact_header_tagline || ""} onChange={e => set("contact_header_tagline", e.target.value)} placeholder="e.g. Connect With Us" />
        </div>
        <div className="space-y-2">
          <Label>Page Title</Label>
          <Input value={local.contact_header_title || ""} onChange={e => set("contact_header_title", e.target.value)} placeholder="e.g. Get in Touch" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea value={local.contact_header_subtitle || ""} onChange={e => set("contact_header_subtitle", e.target.value)} rows={2} placeholder="Short description shown below the title" />
        </div>
      </SettingsSection>

      {/* Contact Info */}
      <SettingsSection
        title="📞 Contact Information"
        description="Address, phone, and email displayed on the Contact page and Footer"
        onSave={() => saveSection(["contact_address", "contact_phone", "contact_email"])}
        isSaving={updateSettings.isPending}
      >
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={local.contact_address || ""} onChange={e => set("contact_address", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input value={local.contact_phone || ""} onChange={e => set("contact_phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={local.contact_email || ""} onChange={e => set("contact_email", e.target.value)} />
        </div>
      </SettingsSection>

      {/* Map Location */}
      <SettingsSection
        title="📍 Map Location"
        description="Latitude and longitude for the map shown on the Contact page. You can get coordinates from Google Maps by right-clicking a location."
        onSave={() => saveSection(["map_latitude", "map_longitude"])}
        isSaving={updateSettings.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input value={local.map_latitude || ""} onChange={e => set("map_latitude", e.target.value)} placeholder="e.g. 9.0054" />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input value={local.map_longitude || ""} onChange={e => set("map_longitude", e.target.value)} placeholder="e.g. 38.7893" />
          </div>
        </div>
      </SettingsSection>

      {/* Authentication Page */}
      <SettingsSection
        title="🔒 Authentication Page"
        description="Background image, title, and subtitle shown on the login and registration page"
        onSave={() => saveSection(["auth_image", "auth_title", "auth_subtitle"])}
        isSaving={updateSettings.isPending}
      >
        <SettingsImageField label="Login Background Image" settingKey="auth_image" value={local.auth_image || ""} onChange={set} />
        <div className="space-y-2">
          <Label>Login Title</Label>
          <Input value={local.auth_title || ""} onChange={e => set("auth_title", e.target.value)} placeholder="e.g. Modern Panda Hotel" />
        </div>
        <div className="space-y-2">
          <Label>Login Subtitle</Label>
          <Input value={local.auth_subtitle || ""} onChange={e => set("auth_subtitle", e.target.value)} placeholder="e.g. Experience Luxury & Comfort" />
        </div>
      </SettingsSection>

      {/* Social Links */}
      <SettingsSection
        title="🔗 Social Media & WhatsApp"
        description="Social media URLs and WhatsApp number shown on the website"
        onSave={() => saveSection(["facebook_url", "instagram_url", "twitter_url", "tiktok_url", "whatsapp_number"])}
        isSaving={updateSettings.isPending}
      >
        <div className="space-y-2">
          <Label>WhatsApp Number (enables floating chat button)</Label>
          <Input value={local.whatsapp_number || ""} onChange={e => set("whatsapp_number", e.target.value)} placeholder="e.g. 251911234567 (with country code, no +)" />
        </div>
        <div className="space-y-2">
          <Label>Facebook URL</Label>
          <Input value={local.facebook_url || ""} onChange={e => set("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
        </div>
        <div className="space-y-2">
          <Label>Instagram URL</Label>
          <Input value={local.instagram_url || ""} onChange={e => set("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
        </div>
        <div className="space-y-2">
          <Label>Twitter / X URL</Label>
          <Input value={local.twitter_url || ""} onChange={e => set("twitter_url", e.target.value)} placeholder="https://x.com/..." />
        </div>
        <div className="space-y-2">
          <Label>TikTok URL</Label>
          <Input value={local.tiktok_url || ""} onChange={e => set("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@..." />
        </div>
      </SettingsSection>

      {/* Email Settings */}
      <SettingsSection
        title="📧 Email Settings"
        description="Configure SMTP settings for booking and inquiry notifications. Note: You may need to use an 'App Password' for Gmail."
        onSave={() => saveSection(["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from", "admin_booking_email"])}
        isSaving={updateSettings.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>SMTP Host</Label>
            <Input value={local.smtp_host || ""} onChange={e => set("smtp_host", e.target.value)} placeholder="e.g. smtp.gmail.com" />
          </div>
          <div className="space-y-2">
            <Label>SMTP Port</Label>
            <Input value={local.smtp_port || ""} onChange={e => set("smtp_port", e.target.value)} placeholder="e.g. 587" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>SMTP Username</Label>
            <Input value={local.smtp_user || ""} onChange={e => set("smtp_user", e.target.value)} placeholder="e.g. your-email@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label>SMTP Password</Label>
            <Input type="password" value={local.smtp_pass || ""} onChange={e => set("smtp_pass", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From Email Header</Label>
            <Input value={local.smtp_from || ""} onChange={e => set("smtp_from", e.target.value)} placeholder="e.g. noreply@yourdomain.com" />
          </div>
          <div className="space-y-2">
            <Label>Admin Notification Email</Label>
            <Input value={local.admin_booking_email || ""} onChange={e => set("admin_booking_email", e.target.value)} placeholder="Email to receive alerts" />
          </div>
        </div>
      </SettingsSection>

      {/* Password Reset Section */}
      <Card className="mb-6 border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">🔑 Admin Password</CardTitle>
          <CardDescription>Change the password used to log into this admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={local.new_admin_password || ""} onChange={e => set("new_admin_password", e.target.value)} placeholder="Minimum 6 characters" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={local.confirm_admin_password || ""} onChange={e => set("confirm_admin_password", e.target.value)} placeholder="Retype new password" />
              </div>
            </div>
            <Button 
               variant="destructive"
               disabled={!local.new_admin_password || local.new_admin_password !== local.confirm_admin_password || local.new_admin_password.length < 6}
               onClick={async () => {
                 try {
                   const res = await fetch("/api/admin/password", {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ password: local.new_admin_password })
                   });
                   if (!res.ok) {
                     const data = await res.json();
                     throw new Error(data.message || "Failed to update password");
                   }
                   toast({ title: "Password changed successfully" });
                   set("new_admin_password", "");
                   set("confirm_admin_password", "");
                 } catch (err: any) {
                   toast({ title: "Failed to change password", description: err.message, variant: "destructive" });
                 }
               }}
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
