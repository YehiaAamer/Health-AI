// src/pages/EditProfile.tsx - نسخة جديدة بسيطة
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Camera, User, X } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";

export default function EditProfile() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(user?.profile_picture || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تحديث formData لما الـ user تتحدث
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: "",
      });
      if (user.profile_picture) {
        setProfilePicturePreview(user.profile_picture);
      }
    }
  }, [user]);

  // التحقق من Authentication
  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة صالح");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = async () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // إذا كان عنده صورة محفوظة، احذفها من السيرفر
    if (user?.profile_picture) {
      try {
        const storedTokens = localStorage.getItem("auth_tokens");
        const accessToken = storedTokens ? JSON.parse(storedTokens).access : "";
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/picture/`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (response.ok) {
          updateUser({ ...user, profile_picture: null });
          toast.success("تم حذف الصورة الشخصية");
        }
      } catch {
        toast.error("فشل حذف الصورة من السيرفر");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const storedTokens = localStorage.getItem("auth_tokens");
      let accessToken = "";
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        accessToken = tokens.access;
      }

      let response: Response;

      if (profilePicture) {
        // إرسال كـ FormData عند وجود صورة
        const formDataPayload = new FormData();
        formDataPayload.append("first_name", formData.first_name);
        formDataPayload.append("last_name", formData.last_name);
        formDataPayload.append("email", formData.email);
        if (formData.phone) formDataPayload.append("phone", formData.phone);
        formDataPayload.append("profile_picture", profilePicture);

        response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // لا تضيف Content-Type هنا — المتصفح يضيفها تلقائياً مع الـ boundary
          },
          body: formDataPayload,
        });
      } else {
        // إرسال كـ JSON عند عدم وجود صورة
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || "",
          }),
        });
      }

      const responseText = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || "فشل تحديث الملف الشخصي");
      }

      const result = JSON.parse(responseText);

      // تحديث بيانات المستخدم في الـ context والـ localStorage
      if (result.user) {
        updateUser(result.user);
      }

      toast.success(result.message || "تم تحديث الملف الشخصي بنجاح");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="dashboard" />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            عودة للوحة التحكم
          </Button>
          <h1 className="text-4xl font-bold mb-2">تعديل الملف الشخصي</h1>
          <p className="text-muted-foreground">
            قم بتحديث معلوماتك الشخصية وصورتك
          </p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
                {profilePicturePreview && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-4">
                اضغط على أيقونة الكاميرا لتغيير الصورة
              </p>
            </div>

            {/* Error */}
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <p className="text-red-800">{error}</p>
              </Alert>
            )}

            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">الاسم الأول</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="أحمد"
                  className="text-right"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">الاسم الأخير</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="محمد"
                  className="text-right"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ahmed@example.com"
                className="text-left"
                dir="ltr"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+20 123 456 7890"
                className="text-left"
                dir="ltr"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>

            {/* Forget Password Button */}
            <div className="pt-4 border-t">
              <Button
                type="button"
                variant="link"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/forgot-password")}
              >
                نسيت كلمة المرور؟
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
