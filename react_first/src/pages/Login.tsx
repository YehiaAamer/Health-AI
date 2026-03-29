import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Chrome, Activity } from "lucide-react";
import { FaApple } from "react-icons/fa";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="auth" />

      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-accent/30 to-background">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Login Form */}
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Welcome Back
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign Up
                    </Link>
                  </p>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        OR CONTINUE WITH
                      </span>
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
              </TabsContent>

              <TabsContent value="signup">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Create a new account
                  </p>
                  <Link to="/signup">
                    <Button>Go to Sign Up</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Info Section */}
          <div className="hidden md:block bg-gradient-to-br from-accent to-primary/10 rounded-2xl p-12">
            <h1 className="text-4xl font-bold mb-4">
              Your health, powered by AI.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get fast, reliable, and secure health insights anytime, anywhere.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Confidential & Secure Data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your privacy is our priority. All data is encrypted and
                    stored securely.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Quick AI-Powered Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Leverage cutting-edge AI for rapid analysis and health
                    diagnostics.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Accessible Anytime, Anywhere
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Access your health information on any device, 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
