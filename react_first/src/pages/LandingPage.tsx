import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  FileText,
  Zap,
  Shield,
  Clock,
  Stethoscope,
  Star,
} from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useIsVisible } from "@/hooks/useIsVisible";

const AnimatedSection = ({ children }) => {
  const ref = useRef();
  const isVisible = useIsVisible(ref);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-accent px-4 bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden">
        <div className="container mx-auto h-screen items-center justify-center flex">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold pb-3 mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              AI-Powered Medical Diagnosis at Your Fingertips
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get fast, accurate, and confidential health insights with our
              AI-driven diagnostic tool.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Your Checkup
              </Button>
            </Link>
            <div className="flex justify-center items-center p-10">
              <a
                href="#How"
                className="animate-bounce"
                title="Scroll to Next Section"
              >
                <svg
                  className="w-10 h-10 text-gray-500 border rounded-full p-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="How" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A simple, three-step process to get your personalized health report.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="WOW text-center rounded p-3 hover:shadow-lg transition-all duration-200">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  1. Input Symptoms
                </h3>
                <p className="text-muted-foreground">
                  Describe your symptoms in detail using our intuitive
                  interface.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW text-center rounded p-3 hover:shadow-lg transition-all duration-200">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your input using advanced algorithms and
                  medical data.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW text-center rounded p-3 hover:shadow-lg transition-all duration-200">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  3. Personalized Report
                </h3>
                <p className="text-muted-foreground">
                  Receive a comprehensive report with insights and
                  recommendations.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Key Benefits</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the power of AI in healthcare with our advanced features.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Fast & Accurate Results
                </h3>
                <p className="text-muted-foreground">
                  Get results in minutes with high accuracy.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure & Confidential Data
                </h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and kept private.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Easy-to-Use Interface
                </h3>
                <p className="text-muted-foreground">
                  Simple and intuitive design for all users.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Supports Multiple Conditions
                </h3>
                <p className="text-muted-foreground">
                  Diagnose a wide range of health issues.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  24/7 Availability
                </h3>
                <p className="text-muted-foreground">
                  Access our service anytime, anywhere.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Doctor Verified</h3>
                <p className="text-muted-foreground">
                  Information is reviewed by professionals.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            What Our Users Say
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Real stories from patients and doctors who trust HealthAI.
          </p>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "HealthAI revolutionized my practice. It provides quick and
                  reliable insights, making diagnosis faster for my patients."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="../../public/person.png"
                    className="w-10 h-10 bg-accent rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Dr. Sam Carter</p>
                    <p className="text-sm text-muted-foreground">
                      General Practitioner
                    </p>
                  </div>
                </div>
              </div>
              <div className="WOW bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "I was amazed by the accuracy and speed of the diagnosis. It
                  gave me peace of mind and helped me understand my health
                  better."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="../../public/person2.png"
                    className="w-10 h-10 bg-accent rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Mark Thompson</p>
                    <p className="text-sm text-muted-foreground">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/30 to-primary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Take control of your health today.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making smarter health decisions with
            AI-powered insights.
          </p>
          <Link to="/signup">
            <AnimatedSection>
              <Button size="lg" className="WOW text-lg px-8">
                Start Diagnosis Now
              </Button>
            </AnimatedSection>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
