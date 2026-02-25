import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock, Chrome, Users } from "lucide-react";
import { FaApple } from "react-icons/fa";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="auth" />

      <main className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Sign Up Form */}
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">HealthAI</span>
            </div>

            <h2 className="text-3xl font-bold mb-6 justify-self-center">Create Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground z-10" />
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login here.
                </Link>
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <FaApple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary to-cyan-600 rounded-2xl p-12 text-white">
            <div className="bg-cyan-500/30 rounded-lg p-8 mb-8 max-w-sm">
              <img
                src="./../../public/Doctoooorimg.png"
                alt="Doctor illustration"
                className="w-full h-auto"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">
              Join our AI-powered health platform.
            </h2>
            <p className="text-lg text-center opacity-90">
              Take control of your well-being with personalized insights and
              secure data management.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SignUp;
