import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/ui/navigation'
import useAccountStore from '@/stores/account-store'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { Profile } from '@/stores/account-store'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100).optional(),
  gender: z.string().max(50).optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  details: z.string().max(1000).optional().or(z.literal('')),
  avatar_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

const AccountDashboard = () => {
  const { profile, loadProfile, updateProfile, changePassword, loading, error, clearError } = useAccountStore()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const defaultValues = useMemo<ProfileForm>(() => ({
    full_name: (profile as Profile)?.full_name ?? '',
    gender: (profile as Profile)?.gender ?? '',
    address: (profile as Profile)?.address ?? '',
    details: (profile as Profile)?.details ?? '',
    avatar_url: (profile as Profile)?.avatar_url ?? '',
    newPassword: '',
  }), [profile])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    // reset form when profile loads
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = async (data: ProfileForm) => {
    clearError()
  const metadata: Record<string, unknown> = {
      ...(data.full_name ? { full_name: data.full_name } : {}),
      ...(data.gender ? { gender: data.gender } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.details ? { details: data.details } : {}),
      ...(data.avatar_url ? { avatar_url: data.avatar_url } : {}),
    }

    await updateProfile(metadata)

    if (data.newPassword && data.newPassword.length > 0) {
      await changePassword(data.newPassword)
    }

    setEditing(false)
  }

  const cancel = () => {
    reset(defaultValues)
    setEditing(false)
    clearError()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Account</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  {((profile as Profile)?.avatar_url) ? (
                      <Avatar>
                        <AvatarImage src={(profile as Profile).avatar_url ?? ''} />
                        <AvatarFallback />
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback />
                      </Avatar>
                    )}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Full name</Label>
                      <Input {...register('full_name')} disabled={!editing} />
                      {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <Input {...register('gender')} disabled={!editing} />
                      {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label>Address</Label>
                    <Input {...register('address')} disabled={!editing} />
                    {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              <div>
                <Label>Details</Label>
                <Textarea {...register('details')} disabled={!editing} />
                {errors.details && <p className="text-sm text-red-600">{errors.details.message}</p>}
              </div>

              <div>
                <Label>Avatar URL</Label>
                <Input {...register('avatar_url')} disabled={!editing} />
                {errors.avatar_url && <p className="text-sm text-red-600">{errors.avatar_url.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <Label>Email</Label>
                  <Input value={(profile as Profile & { email?: string })?.email ?? ''} disabled />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input value={(profile as Profile & { phone?: string })?.phone ?? ''} disabled />
                </div>

                <div>
                  <Label>Provider</Label>
                  <Input value={((profile as Profile & { provider?: string; } )?.provider ?? '')} disabled />
                </div>
              </div>

              <div>
                <Label>New password</Label>
                <Input type="password" {...register('newPassword')} disabled={!editing} />
                {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword.message}</p>}
              </div>

              {error && <div className="text-red-600">{error}</div>}

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="outline" type="button" onClick={cancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting || loading}>{isSubmitting || loading ? 'Saving...' : 'Save'}</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.orders && profile.orders.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {profile.orders.map((o: unknown, i: number) => (
                  <li key={i} className="text-sm">{String(o)}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No orders found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccountDashboard
