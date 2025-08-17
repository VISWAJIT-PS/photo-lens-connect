import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/ui/navigation'
import useAccountStore from '@/stores/account-store'

const AccountDashboard = () => {
  const { profile, loadProfile, updateProfile, changePassword, loading, error, clearError } = useAccountStore()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setGender(profile?.gender ?? '')
    setAddress(profile?.address ?? '')
  }, [profile])

  const save = async () => {
    await updateProfile({ full_name: fullName || null, gender: gender || null, address: address || null })
    if (newPassword) {
      await changePassword(newPassword)
      setNewPassword('')
    }
    setEditing(false)
  }

  const cancel = () => {
    setFullName(profile?.full_name ?? '')
    setGender(profile?.gender ?? '')
    setAddress(profile?.address ?? '')
    setNewPassword('')
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
            <div className="space-y-4">
              <div>
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!editing} />
              </div>

              <div>
                <Label>Gender</Label>
                <Input value={gender ?? ''} onChange={(e) => setGender(e.target.value)} disabled={!editing} />
              </div>

              <div>
                <Label>Address</Label>
                <Input value={address ?? ''} onChange={(e) => setAddress(e.target.value)} disabled={!editing} />
              </div>

              <div>
                <Label>New password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={!editing} />
              </div>

              {error && <div className="text-red-600">{error}</div>}

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.orders && profile.orders.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {profile.orders.map((o, i) => (
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
