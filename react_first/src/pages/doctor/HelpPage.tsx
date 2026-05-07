import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Phone, Mail, BookOpen } from "lucide-react";

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('doctorDashboard.sidebar.help')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <HelpCircle className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t('doctorDashboard.help.faqs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('doctorDashboard.help.faqsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t('doctorDashboard.help.guides')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('doctorDashboard.help.guidesDesc')}</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <Phone className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t('doctorDashboard.help.contact')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@healthcare.ai
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 000-1234
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
