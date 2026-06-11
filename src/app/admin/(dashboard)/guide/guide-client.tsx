"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "overview",
    title: "۱. نمای کلی (داشبورد)",
    content: (
      <div className="space-y-3 text-sm leading-7">
        <p>صفحه اول بعد از ورود، <strong>داشبورد</strong> است. این صفحه یک نگاه کلی به وضعیت کسب‌وکار می‌دهد.</p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li><strong className="text-foreground">کل رزروها:</strong> تعداد کل رزروهای ثبت‌شده در سیستم</li>
          <li><strong className="text-foreground">در انتظار:</strong> رزروهایی که هنوز تأیید نشده‌اند</li>
          <li><strong className="text-foreground">تأیید شده:</strong> رزروهایی که پذیرفته شده‌اند</li>
          <li><strong className="text-foreground">انجام شده:</strong> رزروهایی که سرویس ارائه شده</li>
          <li><strong className="text-foreground">لغو شده:</strong> رزروهای کنسل‌شده</li>
          <li><strong className="text-foreground">حاضر نشده:</strong> مشتری در وقت مقرر نیامده</li>
        </ul>
        <p>در پایین صفحه، <strong>رزروهای اخیر</strong> نمایش داده می‌شود. برای دیدن همه رزروها روی «مشاهده همه» کلیک کنید.</p>
      </div>
    ),
  },
  {
    id: "appointments",
    title: "۲. رزروها",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>صفحه رزروها لیست کامل تمام درخواست‌ها و رزروهای مشتریان را نشان می‌دهد.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">جستجو و فیلتر</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>از کادر جستجو برای پیدا کردن مشتری یا خدمت استفاده کنید</li>
            <li>با دکمه‌های فیلتر (همه / در انتظار / تأیید شده / ...) رزروها را دسته‌بندی کنید</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">تأیید رزرو ✓</h4>
          <p className="text-muted">برای رزروهایی که وضعیت «در انتظار» دارند، دکمه سبز <strong className="text-foreground">تأیید</strong> نمایش داده می‌شود. با کلیک روی آن، رزرو تأیید شده و ایمیل اطلاع‌رسانی به مشتری ارسال می‌شود.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">رد کردن رزرو ✕</h4>
          <p className="text-muted">دکمه قرمز <strong className="text-foreground">رد</strong> یک فرم کوچک باز می‌کند. می‌توانید دلیل رد کردن را بنویسید (اختیاری) و سپس تأیید رد را بزنید. مشتری ایمیل اطلاع‌رسانی دریافت می‌کند.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش رزرو ✏️</h4>
          <p className="text-muted">روی آیکون مداد کلیک کنید. در صفحه ویرایش می‌توانید تغییر دهید: مشتری، خدمت، وضعیت، زمان شروع، یادداشت مشتری، یادداشت داخلی.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف رزرو 🗑️</h4>
          <p className="text-muted">روی آیکون سطل زباله کلیک کنید. یک پیام تأیید نمایش داده می‌شود. پس از تأیید، رزرو برای همیشه حذف می‌شود.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">رزرو جدید</h4>
          <p className="text-muted">دکمه <strong className="text-foreground">رزرو جدید</strong> در بالای صفحه. مشتری، خدمت، زمان و وضعیت را انتخاب کنید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">صفحه‌بندی</h4>
          <p className="text-muted">اگر رزروها زیاد باشند، در پایین صفحه دکمه‌های قبلی/بعدی نمایش داده می‌شوند.</p>
        </div>
      </div>
    ),
  },
  {
    id: "calendar",
    title: "۳. تقویم",
    content: (
      <div className="space-y-3 text-sm leading-7">
        <p>صفحه تقویم رزروهای آینده (تأیید شده و در انتظار) را به ترتیب تاریخ نمایش می‌دهد.</p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>رزروها به ترتیب زمانی نمایش داده می‌شوند</li>
          <li>روز، ساعت، نام مشتری، خدمت و وضعیت هر رزرو نمایش داده می‌شود</li>
          <li>اگر رزرو آینده‌ای وجود نداشته باشد پیام مربوطه نمایش داده می‌شود</li>
        </ul>
        <p>این صفحه برای برنامه‌ریزی روزانه مناسب است — قبل از شروع روز کاری اینجا را چک کنید.</p>
      </div>
    ),
  },
  {
    id: "clients",
    title: "۴. مشتریان",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>لیست کامل تمام مشتریان ثبت‌شده در سیستم.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">جستجو</h4>
          <p className="text-muted">با کادر جستجو می‌توانید بر اساس نام یا ایمیل مشتری جستجو کنید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">مشتری جدید</h4>
          <p className="text-muted">دکمه <strong className="text-foreground">مشتری جدید</strong> در بالای صفحه. فیلدها: نام، نام خانوادگی، ایمیل، تلفن، زبان ترجیحی، برچسب‌ها، VIP، یادداشت.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش مشتری ✏️</h4>
          <p className="text-muted">روی آیکون مداد کنار هر مشتری کلیک کنید. می‌توانید تمام اطلاعات مشتری را تغییر دهید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف مشتری 🗑️</h4>
          <p className="text-muted">توجه: اگر مشتری رزرو داشته باشد، پیامی نشان می‌دهد که چند رزرو نیز حذف خواهد شد. این عملیات برگشت‌پذیر نیست.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">برچسب VIP</h4>
          <p className="text-muted">با فعال کردن تیک VIP، نشان ویژه برای آن مشتری نمایش داده می‌شود.</p>
        </div>
      </div>
    ),
  },
  {
    id: "services",
    title: "۵. خدمات",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>مدیریت خدماتی که در سیستم رزرو قابل انتخاب هستند.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">خدمت جدید</h4>
          <p className="text-muted">دکمه <strong className="text-foreground">خدمت جدید</strong>. فیلدهای مهم:</p>
          <ul className="list-disc list-inside space-y-1 text-muted mt-1">
            <li><strong className="text-foreground">اسلاگ:</strong> شناسه یکتا مثل «bridal-makeup» (فقط انگلیسی و خط تیره)</li>
            <li><strong className="text-foreground">مدت زمان (دقیقه):</strong> طول سرویس مثلاً ۱۲۰</li>
            <li><strong className="text-foreground">زمان فاصله (دقیقه):</strong> زمان استراحت بعد از سرویس برای آماده‌سازی</li>
            <li><strong className="text-foreground">ترتیب:</strong> ترتیب نمایش در لیست</li>
            <li><strong className="text-foreground">فعال:</strong> اگر غیرفعال باشد در رزرو آنلاین نمایش داده نمی‌شود</li>
            <li><strong className="text-foreground">محتوای آلمانی/انگلیسی:</strong> عنوان، توضیح کوتاه و توضیحات کامل را هم به آلمانی هم انگلیسی پر کنید</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش خدمت ✏️</h4>
          <p className="text-muted">روی آیکون مداد کلیک کنید و هر فیلد را تغییر دهید. تغییر مدت زمان روی رزروهای جدید تأثیر می‌گذارد.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف خدمت 🗑️</h4>
          <p className="text-muted">خدماتی که رزرو فعال دارند را حذف نکنید — ابتدا وضعیت را غیرفعال کنید.</p>
        </div>
      </div>
    ),
  },
  {
    id: "portfolio",
    title: "۶. پورتفولیو",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>مدیریت گالری تصاویر نمونه کارها. دو بخش دارد: دسته‌بندی‌ها و آیتم‌ها.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">دسته‌بندی جدید</h4>
          <p className="text-muted">ابتدا دسته‌بندی بسازید (مثلاً «عروسی»، «مجلسی»). فیلدها: اسلاگ، ترتیب، نام آلمانی، نام انگلیسی.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">افزودن آیتم پورتفولیو</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>اسلاگ یکتا انتخاب کنید</li>
            <li>دسته‌بندی را انتخاب کنید</li>
            <li>در صورت تمایل، خدمت مرتبط را لینک کنید</li>
            <li>تصویر را آپلود کنید (با دکمه انتخاب فایل)</li>
            <li>عنوان و توضیحات را به آلمانی و انگلیسی وارد کنید</li>
            <li>تیک «ویژه» برای نمایش در بخش featured سایت</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش آیتم ✏️</h4>
          <p className="text-muted">روی آیکون مداد روی کارت تصویر کلیک کنید. می‌توانید تصویر، عنوان، دسته‌بندی و همه فیلدها را تغییر دهید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف آیتم / دسته‌بندی 🗑️</h4>
          <p className="text-muted">حذف دسته‌بندی که آیتم دارد، همه آیتم‌های آن را هم حذف می‌کند. پیام هشدار این موضوع را نشان می‌دهد.</p>
        </div>
      </div>
    ),
  },
  {
    id: "testimonials",
    title: "۷. نظرات",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>مدیریت نظرات و توصیه‌نامه‌های مشتریان که در سایت نمایش داده می‌شوند.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">افزودن نظر جدید</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li><strong className="text-foreground">نام مشتری:</strong> اسم نمایشی</li>
            <li><strong className="text-foreground">نوع رویداد:</strong> مثلاً «عروسی» یا «مهمانی»</li>
            <li><strong className="text-foreground">نوع:</strong> متن، عکس یا ویدیو</li>
            <li><strong className="text-foreground">امتیاز:</strong> عدد ۱ تا ۵</li>
            <li><strong className="text-foreground">ترتیب:</strong> ترتیب نمایش</li>
            <li><strong className="text-foreground">ویژه:</strong> نمایش در بخش برجسته سایت</li>
            <li><strong className="text-foreground">متن آلمانی و انگلیسی:</strong> محتوای نظر به هر دو زبان</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش نظر ✏️</h4>
          <p className="text-muted">روی آیکون مداد کنار هر نظر کلیک کنید و هر فیلد را تغییر دهید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف نظر 🗑️</h4>
          <p className="text-muted">نظر برای همیشه از سیستم حذف می‌شود.</p>
        </div>
      </div>
    ),
  },
  {
    id: "blog",
    title: "۸. وبلاگ",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>مدیریت مطالب وبلاگ سایت. مثل پورتفولیو، دو بخش دارد: دسته‌بندی‌ها و مطالب.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">دسته‌بندی جدید</h4>
          <p className="text-muted">اسلاگ، ترتیب، نام آلمانی و انگلیسی را وارد کنید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">مطلب جدید</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li><strong className="text-foreground">تصویر کاور:</strong> تصویر افقی (پیشنهاد ۱۲۰۰×۶۳۰)</li>
            <li><strong className="text-foreground">اسلاگ:</strong> آدرس مطلب در سایت</li>
            <li><strong className="text-foreground">دسته‌بندی:</strong> اختیاری</li>
            <li><strong className="text-foreground">وضعیت:</strong> پیش‌نویس (فقط شما می‌بینید) / منتشر شده (عمومی) / بایگانی</li>
            <li><strong className="text-foreground">برچسب‌ها:</strong> با کاما جدا کنید مثلاً «آرایش,عروسی,مو»</li>
            <li><strong className="text-foreground">ویژه:</strong> نمایش در بخش اول سایت</li>
            <li><strong className="text-foreground">محتوا:</strong> متن کامل به آلمانی و انگلیسی</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش / حذف مطلب</h4>
          <p className="text-muted">آیکون مداد برای ویرایش، آیکون سطل زباله برای حذف دائمی.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">نکته مهم</h4>
          <p className="text-muted">مطلبی که وضعیت «پیش‌نویس» دارد در سایت عمومی نمایش داده نمی‌شود. قبل از انتشار وضعیت را به «منتشر شده» تغییر دهید.</p>
        </div>
      </div>
    ),
  },
  {
    id: "media",
    title: "۹. کتابخانه رسانه",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>مدیریت تمام تصاویر و فایل‌های آپلود شده در سیستم.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">آپلود تصویر جدید</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>روی «انتخاب فایل» کلیک کنید و تصویر را انتخاب کنید</li>
            <li>نوار پیشرفت آپلود را نشان می‌دهد</li>
            <li><strong className="text-foreground">متن جایگزین:</strong> توضیح تصویر برای موتورهای جستجو (SEO)</li>
            <li><strong className="text-foreground">پوشه:</strong> برای دسته‌بندی مثلاً «portfolio»، «blog»، «uploads»</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ویرایش رسانه ✏️</h4>
          <p className="text-muted">می‌توانید تصویر، متن جایگزین و پوشه را تغییر دهید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف رسانه 🗑️</h4>
          <p className="text-muted">توجه: اگر این تصویر در جای دیگری از سایت استفاده شده باشد، بعد از حذف آن بخش تصویر نخواهد داشت. قبل از حذف مطمئن شوید که در جای دیگری استفاده نشده.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">فرمت‌های پشتیبانی شده</h4>
          <p className="text-muted">JPEG، PNG، WebP، GIF — توصیه می‌شود از WebP استفاده کنید چون حجم کمتری دارد.</p>
        </div>
      </div>
    ),
  },
  {
    id: "settings",
    title: "۱۰. تنظیمات",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <p>تنظیمات کلی کسب‌وکار در سه بخش: اطلاعات کسب‌وکار، ساعات کاری، تاریخ‌های مسدود.</p>

        <div>
          <h4 className="font-semibold text-foreground mb-1">اطلاعات کسب‌وکار</h4>
          <p className="text-muted">نام، ایمیل، تلفن، موقعیت مکانی و آدرس اینستاگرام را وارد کنید. این اطلاعات در سایت و ایمیل‌های اتوماتیک استفاده می‌شوند.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ساعات کاری</h4>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>برای هر روز هفته یک قانون جداگانه اضافه کنید</li>
            <li>روز، ساعت شروع و پایان را وارد کنید (فرمت ۲۴ ساعته مثلاً ۱۰:۰۰ تا ۱۹:۰۰)</li>
            <li>تیک «فعال» را بردارید تا آن روز در رزرو آنلاین غیرفعال شود</li>
            <li>روی آیکون مداد کنار هر قانون می‌توانید آن را ویرایش کنید</li>
            <li>روی آیکون سطل زباله می‌توانید قانون را حذف کنید</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">تاریخ‌های مسدود</h4>
          <p className="text-muted">برای تعطیلات، سفر یا هر روزی که نمی‌توانید کار کنید، یک تاریخ مسدود اضافه کنید. مشتریان نمی‌توانند برای آن روز رزرو کنند.</p>
          <ul className="list-disc list-inside space-y-1 text-muted mt-1">
            <li><strong className="text-foreground">تاریخ:</strong> روز مسدود</li>
            <li><strong className="text-foreground">دلیل:</strong> اختیاری، برای یادداشت شخصی</li>
            <li><strong className="text-foreground">تمام روز:</strong> اگر تیک باشد، کل روز مسدود است</li>
            <li>می‌توانید فقط بخشی از روز را مسدود کنید با وارد کردن ساعت شروع و پایان</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">یکپارچه‌سازی‌ها</h4>
          <p className="text-muted">وضعیت اتصال به سرویس‌های خارجی (Resend برای ایمیل، Cloudinary برای تصاویر، Google Calendar) نمایش داده می‌شود. این بخش فقط اطلاعاتی است.</p>
        </div>
      </div>
    ),
  },
  {
    id: "seo",
    title: "۱۱. سئو",
    content: (
      <div className="space-y-3 text-sm leading-7">
        <p>صفحه سئو اطلاعات فنی مربوط به بهینه‌سازی موتورهای جستجو را نشان می‌دهد.</p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li><strong className="text-foreground">آدرس سایت:</strong> دامنه اصلی سایت</li>
          <li><strong className="text-foreground">زبان پیش‌فرض:</strong> زبان اصلی سایت</li>
          <li><strong className="text-foreground">داده‌های ساختاریافته:</strong> Schema.org هایی که در سایت پیاده‌سازی شده‌اند (LocalBusiness، Person، FAQ، Article، Breadcrumb)</li>
        </ul>
        <p>این صفحه فقط اطلاعاتی است و نیازی به تغییر ندارد.</p>
      </div>
    ),
  },
  {
    id: "tips",
    title: "۱۲. نکات مهم و بهترین روش‌ها",
    content: (
      <div className="space-y-4 text-sm leading-7">
        <div>
          <h4 className="font-semibold text-foreground mb-1">ترتیب توصیه‌شده برای شروع</h4>
          <ol className="list-decimal list-inside space-y-1 text-muted">
            <li>ابتدا خدمات را وارد کنید</li>
            <li>ساعات کاری را در تنظیمات تنظیم کنید</li>
            <li>مشتریان فعلی را اضافه کنید</li>
            <li>دسته‌بندی‌های پورتفولیو بسازید و تصاویر اضافه کنید</li>
            <li>نظرات مشتریان را اضافه کنید</li>
          </ol>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">حذف دائمی است</h4>
          <p className="text-muted">همه عملیات حذف (رزرو، مشتری، خدمت، آیتم پورتفولیو و ...) <strong className="text-foreground">برگشت‌پذیر نیستند</strong>. قبل از حذف مطمئن شوید.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">زبان محتوا</h4>
          <p className="text-muted">سایت به زبان آلمانی و انگلیسی است. برای تمام محتواها (خدمات، پورتفولیو، وبلاگ، نظرات) هر دو زبان را پر کنید تا مشتریان هر دو نسخه زبانی محتوا را ببینند.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">آپلود تصویر</h4>
          <p className="text-muted">قبل از آپلود، تصاویر را فشرده کنید. برای پورتفولیو تصاویر عمودی (۳:۴) بهتر هستند. برای وبلاگ تصاویر افقی (۱۶:۹ یا ۱۲۰۰×۶۳۰) مناسب‌تر است.</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">ایمیل‌های اتوماتیک</h4>
          <p className="text-muted">هنگام تأیید یا رد رزرو، سیستم به صورت خودکار ایمیل اطلاع‌رسانی به مشتری می‌فرستد. لازم نیست دستی ایمیل بزنید.</p>
        </div>
      </div>
    ),
  },
];

export function GuideClient() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((s) => {
      const titleMatch = s.title.toLowerCase().includes(q);
      const contentText = typeof s.content === "object"
        ? JSON.stringify(s.content).toLowerCase()
        : "";
      return titleMatch || contentText.includes(q);
    });
  }, [search]);

  return (
    <div className="space-y-8 font-fa" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-foreground">
          آموزش صفر تا صد
        </h1>
        <p className="mt-1 text-sm text-muted">راهنمای کامل استفاده از پنل مدیریت</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در راهنما..."
          dir="rtl"
          className="w-full border border-border bg-background-secondary py-4 ps-4 pe-11 text-sm focus:outline-none focus:ring-1 focus:ring-gold rounded-sm"
        />
      </div>

      {/* Sections */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">نتیجه‌ای یافت نشد.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((section) => (
            <details key={section.id} className="group border border-border bg-background rounded-sm" open={search.trim() !== ""}>
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-semibold text-foreground hover:bg-background-secondary transition-colors rounded-sm list-none">
                {section.title}
                <span className="text-muted text-lg group-open:rotate-180 transition-transform">
                  ›
                </span>
              </summary>
              <div className="border-t border-border px-6 py-5">
                {section.content}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
