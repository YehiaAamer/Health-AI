import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setIsLoading(true);

    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsLoading(false);
    }, 1500);

    // TODO: Add actual API call here
    // await apiCall('/api/contact/', { method: 'POST', body: JSON.stringify(formData) })
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "support@healthai.com",
      href: "mailto:support@healthai.com",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "+20 123 456 7890",
      href: "tel:+201234567890",
      color: "text-green-500",
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "القاهرة، مصر",
      href: "#",
      color: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
            <p className="text-lg text-muted-foreground">
              نحن هنا لمساعدتك. لا تتردد في الاتصال بنا!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
                <CardDescription>
                  املأ النموذج وسنتواصل معك في أقرب وقت
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أحمد محمد"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الموضوع
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="استفسار عام"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الرسالة <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا..."
                      className="min-h-[150px]"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    ⏱️ نرد عادةً خلال 24 ساعة عمل
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Info Cards */}
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <a
                      href={info.href}
                      className="flex items-center gap-4 group"
                    >
                      <div className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors`}>
                        <info.icon className={`h-7 w-7 ${info.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}

              {/* FAQ Link */}
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">هل تبحث عن إجابة سريعة؟</h3>
                  <p className="text-muted-foreground mb-4">
                    تصفح الأسئلة الشائعة قد تجد إجابتك هناك!
                  </p>
                  <a href="/help" className="text-primary hover:underline font-semibold">
                    الذهاب لمركز المساعدة ←
                  </a>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">ساعات العمل</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الأحد - الخميس</span>
                      <span className="font-medium">9:00 ص - 5:00 م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجمعة - السبت</span>
                      <span className="font-medium">مغلق</span>
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs text-muted-foreground">
                        ⏰ الدعم عبر البريد الإلكتروني متاح 24/7
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Notice */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-800 mb-2">
                        حالة طوارئ طبية؟
                      </h3>
                      <p className="text-red-700 text-sm mb-2">
                        إذا كانت لديك حالة طوارئ طبية، لا تنتظر - اتصل بالإسعاف فوراً
                      </p>
                      <a href="tel:123" className="text-red-600 font-bold hover:underline">
                        📞 123 (الإسعاف في مصر)
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section (Optional - placeholder) */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>موقعنا</CardTitle>
                <CardDescription>زُرنا في مكتبنا</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    🗺️ خريطة تفاعلية (يمكن إضافتها لاحقاً)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
