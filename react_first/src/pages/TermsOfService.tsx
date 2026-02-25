import { AlertTriangle, Mail } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">شروط الخدمة</h1>
            <p className="text-lg text-muted-foreground">
              آخر تحديث: {new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">تنبيه هام</h3>
                <p className="text-yellow-700">
                  باستخدامك لـ HealthAI، فإنك توافق على هذه الشروط. إذا لم توافق، يرجى عدم استخدام المنصة.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">1. قبول الشروط</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>باستخدامك لمنصة HealthAI، فإنك:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>توافق على الالتزام بهذه الشروط والأحكام</li>
                  <li>تقر بأنك قرأت وفهمت سياسة الخصوصية</li>
                  <li>تلتزم باستخدام المنصة للأغراض المخصصة لها فقط</li>
                  <li>تقر بأنك مسؤول عن دقة المعلومات التي تقدمها</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">2. وصف الخدمة</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>HealthAI تقدم الخدمات التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تحليل خطر الإصابة بالسكري بناءً على بياناتك الصحية</li>
                  <li>مساعد طبي ذكي للإجابة على أسئلتك الصحية</li>
                  <li>حفظ سجل تحاليلك السابقة</li>
                  <li>توصيات صحية عامة</li>
                </ul>
                <p className="font-semibold text-primary">
                  ملاحظة: هذه الخدمات لأغراض إعلامية وتعليمية فقط وليست بديلاً عن الاستشارة الطبية.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">3. إخلاء المسؤولية الطبية</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-bold text-red-600">
                  ⚠️ HealthAI لا يقدم تشخيصاً طبياً أو علاجاً!
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>التحليلات المقدمة هي تقديرات إحصائية فقط</li>
                  <li>لا تعتمد على النتائج لاتخاذ قرارات علاجية دون استشارة طبيب</li>
                  <li>المنصة لا تتحمل مسؤولية أي ضرر ناتج عن استخدام المعلومات</li>
                  <li>يجب استشارة طبيب متخصص لأي مشكلة صحية</li>
                  <li>في حالة الطوارئ الطبية، اتصل بالإسعاف فوراً (123 في مصر)</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">4. واجباتك كمستخدم</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>عند استخدامك للمنصة، تلتزم بـ:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تقديم معلومات دقيقة وصحيحة</li>
                  <li>عدم استخدام المنصة لأغراض غير قانونية</li>
                  <li>عدم محاولة اختراق أو العبث بالمنصة</li>
                  <li>عدم انتحال شخصية أخرى</li>
                  <li>عدم استخدام المنصة لنشر معلومات مضللة</li>
                  <li>الحفاظ على سرية بيانات حسابك</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">5. الملكية الفكرية</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>جميع محتويات المنصة محمية بحقوق الملكية الفكرية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الشعارات والأسماء التجارية مملوكة لـ HealthAI</li>
                  <li>المحتوى الطبي محمي بحقوق النشر</li>
                  <li>الخوارزميات والنماذج مملوكة للمنصة</li>
                  <li>لا يجوز نسخ أو توزيع المحتوى دون إذن</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">6. تعديل الخدمة</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>نحتفظ بالحق في:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تعديل أو إيقاف الخدمة جزئياً أو كلياً</li>
                  <li>تغيير الميزات المتاحة</li>
                  <li>تحديث النماذج الطبية المستخدمة</li>
                  <li>تعديل هذه الشروط في أي وقت</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  سنحاول إخطارك بالتغييرات المهمة مسبقاً عندما يكون ذلك ممكناً.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">7. إنهاء الحساب</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>قد نعلق أو ننهي حسابك في الحالات التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>انتهاك هذه الشروط والأحكام</li>
                  <li>استخدام غير قانوني للمنصة</li>
                  <li>طلبك حذف حسابك</li>
                  <li>توقف الخدمة نهائياً</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">8. القانون الواجب التطبيق</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>تخضع هذه الشروط لـ:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>قوانين جمهورية مصر العربية</li>
                  <li>أي نزاع يُحل في المحاكم المختصة</li>
                  <li>في حالة تعارض أي بند مع القانون، يُعتبر البند باطلاً والباقي ساري</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-primary/10 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">لديك أسئلة؟</h2>
              <p className="text-muted-foreground mb-4">
                إذا كان لديك أي أسئلة حول شروط الخدمة، يرجى التواصل معنا
              </p>
              <a
                href="mailto:legal@healthai.com"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-5 w-5" />
                legal@healthai.com
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
