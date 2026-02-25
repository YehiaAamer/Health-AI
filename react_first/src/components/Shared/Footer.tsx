import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact Support
          </Link>
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          © 2024 HealthAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
