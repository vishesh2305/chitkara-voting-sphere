import React, { useState } from "react";
import { Mail, Lock, Shield, University, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuthLoginProps {
  onLogin: (email: string, role: string) => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isChitkaraEmail = (email: string) => {
    return email.endsWith("@chitkara.edu.in");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isChitkaraEmail(email)) {
      setError("Please use your Chitkara University email (@chitkara.edu.in)");
      return;
    }

    if (!role) {
      setError("Please select your role");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email, role);
    }, 1000);
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
            <University className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              VoteVerse
            </h1>
            <p className="text-muted-foreground mt-2">
              Chitkara University Voting Platform
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Chitkara Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@chitkara.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {email && !isChitkaraEmail(email) && (
                    <div className="flex items-center space-x-2 text-sm text-warning">
                      <AlertCircle className="w-4 h-4" />
                      <span>Please use your Chitkara University email</span>
                    </div>
                  )}
                  {email && isChitkaraEmail(email) && (
                    <div className="flex items-center space-x-2 text-sm text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span>Valid Chitkara email</span>
                    </div>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="judge">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary">Judge</Badge>
                          <span>Faculty/Judge Panel</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="leader">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-accent/10 text-accent">Leader</Badge>
                          <span>Team Leader/Senior</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="audience">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-success/10 text-success">Audience</Badge>
                          <span>Student/Audience</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-destructive/10 text-destructive">Admin</Badge>
                          <span>System Administrator</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={!isChitkaraEmail(email) || !role || isLoading}
                >
                  {isLoading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                {/* OTP Verification */}
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                  <p className="text-sm text-muted-foreground">
                    OTP sent to <span className="font-medium text-primary">{email}</span>
                  </p>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    variant="default"
                    className="flex-1"
                    disabled={otp.length !== 6 || isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("email")}
                >
                  ← Back to Email
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3 text-sm">
              <Shield className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Secure & Verified</p>
                <p className="text-muted-foreground">
                  Only verified Chitkara University emails are allowed to access VoteVerse.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};