import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-primary transition-colors">
            {t("footer.privacy")}
          </Link>
          <Link to="/terms" className="hover:text-primary transition-colors">
            {t("footer.terms")}
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            {t("footer.contact")}
          </Link>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;