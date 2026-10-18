# 🚀 Portfolio — Ahmed Osama

الموقع الشخصي (Portfolio) بتاع أحمد أسامة — صفحة واحدة بدون أي مكتبات خارجية (No frameworks, No build step)، بتتنشر تلقائياً على **GitHub Pages** عن طريق **GitHub Actions**.

---

## 📁 الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` | كل محتوى الصفحة (السكاشن والأقسام) |
| `style.css` | التصميم بالكامل (Dark theme + Responsive) |
| `script.js` | الحركات: الـ Typing effect، السكرول، القائمة في الموبايل |
| `favicon.svg` | أيقونة الموقع |
| `.github/workflows/deploy-pages.yml` | بيبني وينشر الموقع تلقائياً على GitHub Pages |

---

## ✏️ تعديل المحتوى

- **النصوص والمشاريع:** افتح `index.html` وعدّل الأقسام مباشرة (كل قسم عليه كومنت واضح).
- **الألوان:** كل الألوان في أول ملف `style.css` جوه `:root`.
- **معلومات المشاريع:** دلوقتي كل لينكات المشاريع بتودّي على بروفايل GitHub.
  لما ترفع كل مشروع في repository خاص بيه، غيّر اللينك في `index.html` (دور على `project-links`).

### حاجات محتاجة تتأكد منها قبل النشر
- [ ] الاسم بالكامل (دلوقتي "Ahmed Osama")
- [ ] الإيميل في قسم Contact: `ahmed.osam419007@gmail.com`
- [ ] لينك LinkedIn لو عايز تضيفه

---

## 💻 تشغيله محلياً

معندكش أي حاجة تعملها غير إنك تفتح `index.html` في المتصفح مباشرة. ولو عايز سيرفر محلي:

```bash
npx serve .
```

---

## 🚀 النشر (GitHub Pages) — خطوة بخطوة أول مرة فقط

1. اعمل repository جديد على GitHub باسم `portfolio`.
2. من داخل الفولدر ده:

   ```bash
   git init -b main
   git add .
   git commit -m "feat: initial portfolio"
   git remote add origin https://github.com/ahmedosam419007/portfolio.git
   git push -u origin main
   ```

3. من صفحة الريبو على GitHub: **Settings → Pages → Source: GitHub Actions**.
4. خلاص ✅ — أي `push` على `main` هينشر الموقع تلقائياً.

اللينك هيبقى: `https://ahmedosam419007.github.io/portfolio/`

---

## 🌐 ربط دومين مجاني (من GitHub Student Pack)

1. اسحب عرض الـ Domain من [صفحة الـ benefits](https://github.com/settings/education/benefits)
   (Namecheap `.me` أو `.TECH` أو Name.com `.dev`/`.app`).
2. في الريبو: **Settings → Pages → Custom domain** واكتب الدومين.
3. من لوحة تحكم الدومين أضف سجلات DNS:

   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  ahmedosam419007.github.io
   ```

4. فعّل **Enforce HTTPS** بعد ما الشهادة تجهز (بتاخد شوية وقت).

---

## 🛠️ التقنيات

HTML · CSS · JavaScript (Vanilla) · GitHub Actions · GitHub Pages
