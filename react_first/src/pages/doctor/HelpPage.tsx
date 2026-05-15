import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  LifeBuoy,
  ChevronRight,
  ExternalLink,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const faqs = [
    {
      question: isArabic ? "كيف يتم حساب درجة خطورة السكري؟" : "How is the diabetes risk score calculated?",
      answer: isArabic 
        ? "يستخدم محرك الذكاء الاصطناعي لدينا نموذج XGBoost المتقدم الذي تم تدريبه على آلاف السجلات السريرية. يقوم بتحليل 8 مؤشرات رئيسية بما في ذلك مستويات الجلوكوز، ومؤشر كتلة الجسم، والضغط، والتاريخ الوراثي لتوليد احتمالية مئوية."
        : "Our AI engine uses an advanced XGBoost model trained on thousands of clinical records. It analyzes 8 key indicators including glucose levels, BMI, blood pressure, and pedigree history to generate a percentage probability."
    },
    {
      question: isArabic ? "ما مدى دقة توقعات الذكاء الاصطناعي؟" : "How accurate are the AI predictions?",
      answer: isArabic
        ? "حقق النموذج دقة تزيد عن 92% في اختبارات التحقق المستقلة. ومع ذلك، فهو مصمم كأداة لدعم القرار السريري وليس كبديل للتشخيص الطبي المهني."
        : "The model achieved over 92% accuracy in independent validation tests. However, it is designed as a clinical decision support tool and not a replacement for professional medical diagnosis."
    },
    {
      question: isArabic ? "كيف يمكنني إضافة مريض جديد للمتابعة؟" : "How do I add a new patient for monitoring?",
      answer: isArabic
        ? "يمكنك دعوة المرضى عبر بريدهم الإلكتروني من صفحة 'المرضى'. بمجرد قبولهم للدعوة، سيتم ربط حساباتهم بلوحة التحكم الخاصة بك تلقائياً."
        : "You can invite patients via their email from the 'Patients' page. Once they accept the invitation, their accounts will be automatically linked to your dashboard."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {t('doctorDashboard.sidebar.help')}
        </h1>
        <p className="text-slate-500 font-bold text-sm">
          {isArabic ? "مركز الدعم والتوثيق التقني لـ Health-AI" : "Health-AI Support Center and Technical Documentation"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Help Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* FAQ Section */}
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.help.faqs')}</CardTitle>
              </div>
              <CardDescription className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('doctorDashboard.help.faqsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-none bg-slate-50 px-6 rounded-3xl transition-all data-[state=open]:bg-white data-[state=open]:shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-blue-50">
                    <AccordionTrigger className="hover:no-underline py-5 text-sm font-black text-slate-900 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] font-medium text-slate-600 leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* AI Explanation Section */}
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-slate-900 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Cpu className="h-32 w-32 text-white" />
            </div>
            <CardHeader className="p-10 relative z-10">
              <CardTitle className="text-2xl font-black text-white tracking-tight mb-2">{t('doctorDashboard.help.aiExplanation')}</CardTitle>
              <CardDescription className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{t('doctorDashboard.help.aiExplanationDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-black text-sm mb-2">{isArabic ? "الشفافية الكاملة" : "Full Transparency"}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{isArabic ? "نحن نستخدم تقنيات 'Explainable AI' لتقديم أسباب واضحة لكل توقع نقوم به." : "We use Explainable AI techniques to provide clear reasoning for every prediction we make."}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-black text-sm mb-2">{isArabic ? "التحديث المستمر" : "Continuous Learning"}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{isArabic ? "يتم إعادة تدريب نماذجنا دورياً لضمان أعلى مستويات الدقة والموثوقية." : "Our models are periodically retrained to ensure the highest levels of accuracy and reliability."}</p>
                </div>
              </div>
              <Button variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                {isArabic ? "قراءة التوثيق التقني" : "Read Technical Documentation"}
                <ExternalLink className={cn("h-4 w-4", isArabic ? "mr-2" : "ml-2")} />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Help Widgets */}
        <div className="space-y-8">
          {/* Support Channels */}
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4 text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
                <LifeBuoy className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.help.contact')}</CardTitle>
              <CardDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{isArabic ? "نحن هنا لمساعدتك على مدار الساعة" : "We're here to help you 24/7"}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-3">
              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/10">
                <MessageCircle className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
                {isArabic ? "محادثة فورية" : "Live Chat"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100">
                  <Mail className="h-4 w-4 text-blue-600" />
                </Button>
                <Button variant="outline" className="h-14 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100">
                  <Phone className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guides */}
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-slate-900 tracking-tight">{t('doctorDashboard.help.guides')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-2">
              {[
                { title: isArabic ? "بدء المراجعة السريرية" : "Starting a Clinical Review", icon: ShieldCheck },
                { title: isArabic ? "إدارة وصفات الأدوية" : "Managing Prescriptions", icon: BookOpen },
                { title: isArabic ? "تخصيص تنبيهات الذكاء الاصطناعي" : "Customizing AI Alerts", icon: Bell },
              ].map((guide, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group hover:bg-blue-50 transition-all text-left">
                  <div className={cn("flex items-center gap-3", isArabic && "flex-row-reverse")}>
                    <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm">
                      <guide.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700">{guide.title}</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-all", isArabic && "rotate-180")} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <div className="p-6 bg-green-50 rounded-[2.5rem] border border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{t('doctorDashboard.help.systemStatus')}</span>
            </div>
            <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">{isArabic ? "يعمل بشكل مثالي" : "Operational"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
