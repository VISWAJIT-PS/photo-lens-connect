import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './select'
import { useAccountStore } from '@/stores/account-store'

type Props = {
  trigger?: React.ReactNode
}

export const ProfileDialog = ({ trigger }: Props) => {
  const { profile, loadProfile, updateProfile, changePassword, loading } = useAccountStore()
  const [open, setOpen] = useState(false)

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [gender, setGender] = useState(profile?.gender ?? '')
  const [address, setAddress] = useState(profile?.address ?? '')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    if (open) loadProfile()
  }, [open, loadProfile])

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
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      {trigger ? <DialogTrigger>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div>
            <Label>Gender</Label>
            <Select onValueChange={(v) => setGender(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div>
            <Label>Order Details (read-only)</Label>
            <div className="p-2 border rounded">
              {profile?.orders && profile.orders.length > 0 ? (
                <ul className="list-disc pl-5">
                  {profile.orders.map((o, i) => (
                    <li key={i}>{String(o)}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No orders</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog
