import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Camera, User, Mail, Lock, UserCheck } from "lucide-react";
import { Badge } from "./badge";

interface AuthModalProps {
  children: React.ReactNode;
  defaultTab?: "login" | "register";
}

export const AuthModal = ({ children, defaultTab = "login" }: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<"customer" | "photographer">("customer");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to PhotoLens
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="w-full btn-hero">Sign In</Button>
              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Forgot your password?
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label>I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUserType("customer")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    userType === "customer"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <User className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">Customer</div>
                  <div className="text-xs text-muted-foreground">Looking to hire</div>
                </button>
                <button
                  onClick={() => setUserType("photographer")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    userType === "photographer"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Camera className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">Photographer</div>
                  <div className="text-xs text-muted-foreground">Offering services</div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10"
                  />
                </div>
              </div>
              {userType === "photographer" && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Photographer Profile</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll be able to set up your portfolio and pricing after registration.
                  </p>
                </div>
              )}
              <Button className="w-full btn-hero">
                Create Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};