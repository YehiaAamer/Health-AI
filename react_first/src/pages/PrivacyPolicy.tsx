import { Mail } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">سياسة الخصوصية</h1>
            <p className="text-lg text-muted-foreground">
              آخر تحديث: {new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">1. المعلومات التي نجمعها</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>نجمع المعلومات التالية لتقديم خدماتنا لك:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>المعلومات الشخصية:</strong> الاسم، البريد الإلكتروني، العمر</li>
                  <li><strong>البيانات الطبية:</strong> نتائج التحاليل، القياسات الصحية (الجلوكوز، ضغط الدم، BMI، إلخ)</li>
                  <li><strong>بيانات الاستخدام:</strong> كيفية استخدامك للمنصة</li>
                  <li><strong>سجل المحادثات:</strong> الأسئلة التي تطرحها على المساعد الطبي الذكي</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">2. كيف نستخدم معلوماتك</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>نستخدم معلوماتك للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تقديم تحليلات طبية دقيقة ومخصصة</li>
                  <li>تحسين خدماتنا وجودتها</li>
                  <li>توفير المساعد الطبي الذكي للإجابة على أسئلتك</li>
                  <li>حفظ سجل تحاليلك السابقة للرجوع إليها</li>
                  <li>إرسال تنبيهات مهمة تتعلق بصحتك (إذا وافقت على ذلك)</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">3. حماية بياناتك</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>نتخذ إجراءات أمنية صارمة لحماية بياناتك:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تشفير جميع البيانات الطبية الحساسة</li>
                  <li>تخزين البيانات على خوادم آمنة</li>
                  <li>الوصول محدود للموظفين المصرح لهم فقط</li>
                  <li>نسخ احتياطي دوري للبيانات</li>
                  <li>مراجعة دورية لإجراءات الأمان</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">4. مشاركة المعلومات</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>لا نبيع أو نؤجر معلوماتك الشخصية لأي طرف ثالث.</strong></p>
                <p>قد نشارك معلوماتك فقط في الحالات التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>بموافقتك الصريحة</li>
                  <li>مع مقدمي الخدمات الذين يعملون نيابة عنا (مع التزامهم بالسرية)</li>
                  <li>إذا تطلب القانون ذلك (أمر قضائي)</li>
                  <li>لحماية سلامتك أو سلامة الآخرين</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">5. حقوقك</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>لديك الحقوق التالية فيما يتعلق ببياناتك:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الوصول إلى بياناتك الشخصية</li>
                  <li>تصحيح أي معلومات غير دقيقة</li>
                  <li>حذف حسابك وبياناتك (مع ملاحظة أن هذا قد يؤثر على قدرتنا على تقديم الخدمات)</li>
                  <li>تصدير بياناتك في صيغة قابلة للقراءة</li>
                  <li>سحب الموافقة على معالجة بياناتك</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">6. إخلاء مسؤولية طبية</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>هام:</strong> HealthAI هو أداة مساعدة ولا يغني عن الاستشارة الطبية المهنية.</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>التحليلات المقدمة هي لأغراض إعلامية فقط</li>
                  <li>لا تُعتبر تشخيصاً طبياً نهائياً</li>
                  <li>يجب استشارة طبيب متخصص للتشخيص والعلاج</li>
                  <li>لا تتجاهل نصيحة طبيب بسبب معلومات حصلت عليها من المنصة</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">7. التغييرات على سياسة الخصوصية</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>قد نحدّث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>نشر السياسة المحدثة على المنصة</li>
                  <li>إرسال بريد إلكتروني إذا كانت التغييرات جوهرية</li>
                  <li>تحديث تاريخ "آخر تحديث" في أعلى الصفحة</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-primary/10 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">لديك أسئلة؟</h2>
              <p className="text-muted-foreground mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا
              </p>
              <a
                href="mailto:privacy@healthai.com"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-5 w-5" />
                privacy@healthai.com
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
