import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Smartphone,
  LogOut,
  Camera
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const isArabic = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            {t('doctorDashboard.sidebar.settings')}
          </h1>
          <p className="text-slate-500 font-bold text-sm">
            {isArabic ? "إدارة حسابك المهني وتفضيلات المنصة" : "Manage your professional account and platform preferences"}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="rounded-2xl border-red-100 text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t('dashboard.logout')}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-8 border border-slate-50 overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent h-14 w-full justify-start gap-2">
            <TabsTrigger value="profile" className="rounded-2xl h-10 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">
              <User className="h-4 w-4 mr-2" />
              {isArabic ? "الملف الشخصي" : "Profile"}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-2xl h-10 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">
              <Bell className="h-4 w-4 mr-2" />
              {isArabic ? "التنبيهات" : "Notifications"}
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-2xl h-10 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">
              <Shield className="h-4 w-4 mr-2" />
              {isArabic ? "الأمان" : "Security"}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-2xl h-10 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all">
              <Palette className="h-4 w-4 mr-2" />
              {isArabic ? "المظهر" : "Appearance"}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.profileTitle')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('doctorDashboard.settings.profileDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-8 ring-slate-50">
                      <AvatarImage src={user?.profile?.profile_picture} />
                      <AvatarFallback className="bg-slate-100 text-slate-400 text-3xl font-black uppercase">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        {user?.last_name?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 h-10 w-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-110 transition-transform">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t('doctorDashboard.settings.fullName')}</Label>
                      <Input 
                        defaultValue={`${user?.first_name} ${user?.last_name}`} 
                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t('doctorDashboard.settings.email')}</Label>
                      <Input 
                        defaultValue={user?.email} 
                        disabled 
                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t('doctorDashboard.settings.phone')}</Label>
                      <Input 
                        defaultValue={user?.profile?.phone || "+1 (555) 000-0000"} 
                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{isArabic ? "التخصص" : "Specialization"}</Label>
                      <Input 
                        defaultValue="Endocrinology" 
                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t('doctorDashboard.settings.bio')}</Label>
                  <Textarea 
                    defaultValue={user?.profile?.bio || ""} 
                    placeholder={isArabic ? "اكتب نبذة مهنية عنك..." : "Tell us about your professional background..."}
                    className="min-h-[120px] bg-slate-50 border-none rounded-3xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all p-6"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all">
                    {t('doctorDashboard.settings.saveChanges')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden h-fit">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.accountTitle')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{isArabic ? "معلومات الحساب والحالة" : "Account status and identifier"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isArabic ? "رقم التعريف" : "User ID"}</span>
                    <span className="text-xs font-black text-slate-900">#D-{user?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isArabic ? "الحالة" : "Status"}</span>
                    <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none font-black text-[9px] uppercase px-3 py-1 rounded-lg tracking-widest">
                      {user?.profile?.doctor_status || "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isArabic ? "عضو منذ" : "Joined"}</span>
                    <span className="text-xs font-black text-slate-900">
                      {user?.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed text-center px-4">
                  {isArabic 
                    ? "يتم التحقق من حسابك كطبيب معتمد. يرجى الاتصال بالمسؤول لتغيير حالة الاعتماد." 
                    : "Your account is verified as a licensed practitioner. Contact admin to change certification status."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden max-w-3xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.notificationTitle')}</CardTitle>
              <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('doctorDashboard.settings.notificationDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              {[
                { id: 'email', icon: Globe, title: t('doctorDashboard.settings.emailNotifications'), desc: "Receive summary reports and critical alerts via email" },
                { id: 'sms', icon: Smartphone, title: t('doctorDashboard.settings.smsNotifications'), desc: "Immediate SMS alerts for high-risk patient indicators" },
                { id: 'push', icon: Bell, title: t('doctorDashboard.settings.pushNotifications'), desc: "In-browser and mobile push notifications for new messages" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-lg transition-all group border-2 border-transparent hover:border-blue-50">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight mb-1">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={item.id !== 'sms'} className="data-[state=checked]:bg-blue-600" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="mt-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.passwordChange')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{isArabic ? "قم بتحديث كلمة مرورك بانتظام" : "Update your password regularly for better security"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{isArabic ? "كلمة المرور الحالية" : "Current Password"}</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{isArabic ? "كلمة المرور الجديدة" : "New Password"}</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all" />
                  </div>
                </div>
                <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[1.25rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all">
                  <Key className="h-4 w-4 mr-2" />
                  {t('doctorDashboard.settings.passwordChange')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.twoFactor')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{isArabic ? "أضف طبقة أمان إضافية" : "Add an extra layer of security to your account"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8 text-center">
                <div className="h-32 w-32 bg-slate-50 rounded-[3rem] mx-auto flex items-center justify-center mb-4">
                  <Smartphone className="h-12 w-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">{isArabic ? "المصادقة الثنائية غير مفعلة" : "Two-factor Authentication is OFF"}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-8">
                    {isArabic 
                      ? "نوصي بشدة بتفعيل المصادقة الثنائية لحماية بيانات المرضى الحساسة." 
                      : "We highly recommend enabling 2FA to protect sensitive patient clinical data."}
                  </p>
                </div>
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-blue-100 text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-widest">
                  {isArabic ? "تفعيل الآن" : "Enable Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.themeTitle')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{isArabic ? "اختر مظهر الواجهة" : "Choose your preferred interface style"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 grid grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', color: 'bg-white border-slate-100' },
                  { id: 'dark', label: 'Dark', color: 'bg-slate-900 border-slate-800' },
                  { id: 'system', label: 'System', color: 'bg-slate-200 border-slate-100' }
                ].map((theme) => (
                  <button key={theme.id} className="flex flex-col gap-3 group">
                    <div className={cn("aspect-square w-full rounded-2xl border-4 transition-all group-hover:scale-105", theme.color, theme.id === 'light' ? "ring-4 ring-blue-600/10 border-blue-600" : "")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">{theme.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.settings.languageTitle')}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{isArabic ? "تغيير لغة المنصة" : "Change platform interface language"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-4">
                {[
                  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
                  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' }
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={cn(
                      "w-full p-6 rounded-3xl flex items-center justify-between border-2 transition-all",
                      i18n.language === lang.code ? "bg-blue-50/50 border-blue-600/20 shadow-sm" : "bg-slate-50 border-transparent hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm font-black text-slate-900 tracking-tight">{lang.label}</span>
                    </div>
                    {i18n.language === lang.code && <div className="h-3 w-3 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50" />}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
