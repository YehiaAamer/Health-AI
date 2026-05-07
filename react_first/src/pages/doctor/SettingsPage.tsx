import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('doctorDashboard.sidebar.settings')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('doctorDashboard.settings.profileTitle')}</CardTitle>
            <CardDescription>{t('doctorDashboard.settings.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('doctorDashboard.settings.fullName')}</Label>
              <Input id="name" defaultValue={`${user?.first_name} ${user?.last_name}`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('doctorDashboard.settings.email')}</Label>
              <Input id="email" defaultValue={user?.email} disabled />
            </div>
            <Button>{t('doctorDashboard.settings.saveChanges')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('doctorDashboard.settings.notificationTitle')}</CardTitle>
            <CardDescription>{t('doctorDashboard.settings.notificationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('doctorDashboard.settings.emailNotifications')}</Label>
              <Input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('doctorDashboard.settings.smsNotifications')}</Label>
              <Input type="checkbox" className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
