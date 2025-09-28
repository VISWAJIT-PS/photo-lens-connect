import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, X, Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useEventRegistration, useBatchPhotoUpload } from '@/hooks/use-event-registration'
import { useAuth } from '@/hooks/use-auth'

interface Event {
  id: string
  name: string
  date: string
  location: string
  description?: string
  status: string
}

interface EventRegistrationDialogProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export const EventRegistrationDialog: React.FC<EventRegistrationDialogProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    userName: '',
    email: user?.email || '',
    phoneNumber: '',
    whatsappNumber: '',
    photos: [] as File[],
    preferences: {
      notificationsEnabled: true,
      photoSharingEnabled: true,
      marketingEmails: false
    }
  })

  const registrationMutation = useEventRegistration()
  const batchUploadMutation = useBatchPhotoUpload()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...acceptedFiles]
    }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024 // 10MB per file
  })

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('preferences.')) {
      const prefField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async () => {
    if (!event) return

    try {
      await registrationMutation.mutateAsync({
        eventId: event.id,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
        photos: formData.photos,
        preferences: formData.preferences
      })

      onClose()
      // Reset form
      setFormData({
        userName: '',
        email: user?.email || '',
        phoneNumber: '',
        whatsappNumber: '',
        photos: [],
        preferences: {
          notificationsEnabled: true,
          photoSharingEnabled: true,
          marketingEmails: false
        }
      })
      setCurrentStep(1)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleBatchUpload = async () => {
    if (!event || formData.photos.length === 0) return

    try {
      await batchUploadMutation.mutateAsync({
        eventId: event.id,
        photos: formData.photos
      })
    } catch (error) {
      console.error('Batch upload failed:', error)
    }
  }

  if (!event) return null

  const isFormValid = formData.userName && formData.email && formData.photos.length > 0
  const isLoading = registrationMutation.isPending || batchUploadMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {event.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Full Name *</Label>
                    <Input
                      id="userName"
                      value={formData.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Photo Upload */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-lg">Drop the photos here...</p>
                  ) : (
                    <div>
                      <p className="text-lg mb-2">Drag & drop photos here, or click to select</p>
                      <p className="text-sm text-muted-foreground">
                        Supports: JPEG, PNG, WebP (max 10MB each, up to 10 files)
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {batchUploadMutation.isPending && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading photos...</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(batchUploadMutation.uploadProgress)}%
                      </span>
                    </div>
                    <Progress value={batchUploadMutation.uploadProgress} />
                    {batchUploadMutation.currentFile && (
                      <p className="text-sm text-muted-foreground">
                        Uploading: {batchUploadMutation.currentFile}
                      </p>
                    )}
                  </div>
                )}

                {/* Uploaded Photos Preview */}
                {formData.photos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Photos ({formData.photos.length})</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg">
                            {(photo.size / 1024 / 1024).toFixed(1)}MB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.photos.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleBatchUpload}
                      disabled={batchUploadMutation.isPending}
                      variant="outline"
                    >
                      {batchUploadMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 mr-2" />
                      )}
                      Test Upload Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificationsEnabled">Event Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about event updates and photo matches
                    </p>
                  </div>
                  <Switch
                    id="notificationsEnabled"
                    checked={formData.preferences.notificationsEnabled}
                    onCheckedChange={(checked) => handleInputChange('preferences.notificationsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="photoSharingEnabled">Photo Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your photos to be shared with other event participants
                    </p>
                  </div>
                  <Switch
                    id="photoSharingEnabled"
                    checked={formData.preferences.photoSharingEnabled}
                    onCheckedChange={(checked) => handleInputChange('preferences.photoSharingEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails about future events
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={formData.preferences.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange('preferences.marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                disabled={currentStep === 1 && !formData.userName}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Complete Registration
              </Button>
            )}
          </div>

          {/* Event Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}