import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationFormData {
  name: string;
  whatsappNumber: string;
  phoneNumber: string;
}

const EventRegistration = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const form = useForm<RegistrationFormData>({
    defaultValues: {
      name: "",
      whatsappNumber: "",
      phoneNumber: "",
    },
  });

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photos.length + files.length > 4) {
      alert("You can only upload up to 4 photos");
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const onSubmit = (data: RegistrationFormData) => {
    if (photos.length < 3) {
      alert("Please upload at least 3 photos");
      return;
    }

    // Store data in localStorage for demo purposes
    const registrationData = {
      ...data,
      photos: photoPreviews,
      eventId,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    const existingRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    existingRegistrations.push(registrationData);
    localStorage.setItem('eventRegistrations', JSON.stringify(existingRegistrations));

    // Navigate to waiting screen
    navigate(`/event/${eventId}/waiting`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Event Photo Registration
            </CardTitle>
            <CardDescription className="text-center">
              Register for the event and upload your photos to find matching faces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  rules={{
                    required: "WhatsApp number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Please enter a valid phone number"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Please enter a valid phone number"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <div>
                    <FormLabel>Upload Photos (3-4 required)</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      Take live photos or upload existing ones to find your face in event photos
                    </p>
                  </div>

                  {/* Photo Grid */}
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  {photos.length < 4 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Add Photos</p>
                          <p className="text-xs text-muted-foreground">
                            Take live photos or upload from gallery
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          capture="environment"
                          onChange={handlePhotoCapture}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {photos.length === 0 ? 'Upload Photos' : 'Add More Photos'}
                        </Button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {photos.length}/4 photos uploaded
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={photos.length < 3}
                >
                  Submit Registration
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventRegistration;