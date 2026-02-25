# api/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """
    نموذج الملف الشخصي للمستخدم
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
        verbose_name='صورة الملف الشخصي'
    )
    bio = models.TextField(blank=True, null=True, verbose_name='نبذة')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='رقم الهاتف')
    
    class Meta:
        verbose_name = 'الملف الشخصي'
        verbose_name_plural = 'الملفات الشخصية'
    
    def __str__(self):
        return f"Profile: {self.user.username}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """إنشاء UserProfile تلقائياً عند إنشاء مستخدم جديد"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """حفظ UserProfile تلقائياً عند حفظ المستخدم"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class Prediction(models.Model):
    # المستخدم (اختياري في البداية – nullable)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="predictions"
    )

    # الـ 8 حقول اللي دخلها المستخدم
    pregnancies = models.PositiveIntegerField(default=0)
    glucose = models.FloatField(default=85.0)
    blood_pressure = models.FloatField(default=70.0)
    skin_thickness = models.FloatField(default=20.0)
    insulin = models.FloatField(default=0.0)
    bmi = models.FloatField(default=25.0)
    diabetes_pedigree_function = models.FloatField(default=0.5)
    age = models.PositiveIntegerField(default=35)

    # النتيجة من XGBoost
    probability = models.FloatField()           # من 0.00 إلى 100.00
    risk_level = models.CharField(max_length=50)  # "منخفض", "متوسط", "مرتفع", "مرتفع جدًا"
    message = models.TextField(blank=True)       # الرسالة اللي رجعت من الموديل

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # أحدث التحاليل الأول
        verbose_name = "تحليل"
        verbose_name_plural = "التحاليل"

    def __str__(self):
        return f"تحليل #{self.id} - {self.probability:.2f}% - {self.created_at.date()}"


class ChatMessage(models.Model):
    """
    نموذج لرسائل Chatbot الطبي
    """
    conversation_id = models.IntegerField(db_index=True)  # معرف المحادثة
    prediction = models.ForeignKey(
        Prediction,
        on_delete=models.CASCADE,
        related_name='chat_messages',
        null=True,
        blank=True
    )
    role = models.CharField(max_length=20)  # 'user' أو 'assistant'
    content = models.TextField()  # محتوى الرسالة
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "رسالة Chatbot"
        verbose_name_plural = "رسائل Chatbot"

    def __str__(self):
        role_ar = "المريض" if self.role == 'user' else "الطبيب"
        return f"{role_ar} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"