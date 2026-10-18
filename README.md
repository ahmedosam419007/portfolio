# Portfolio — Ahmed Osam

الموقع الشخصي (Portfolio) بتاع أحمد أسام — صفحة واحدة بدون أي مكتبات خارجية (No frameworks, No build step)، بنسختين عربي/إنجليزي مع تبديل فوري (RTL)، وبتتنشر تلقائياً على **GitHub Pages** عن طريق **GitHub Actions**.

**الموقع Live:** https://ahmedosam.dev/

---

## الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` | كل محتوى الصفحة (السكاشن والأقسام) |
| `style.css` | التصميم بالكامل (Dark theme + Responsive) |
| `script.js` | تبديل اللغة (عربي/إنجليزي + RTL)، الـ Typing effect، السكرول، القائمة في الموبايل |
| `favicon.svg` | أيقونة الموقع |
| `avatar.jpg` | صورتك الشخصية (المقصوصة) — `avatar-full.jpg` نسخة كاملة احتياطية |
| `veloro-live.jpg` | شريط صور موقع VELORO اللايت اللي بيسكرول جوه الهولوجرام |
| `veloro-dark.jpg` | شريط صور موقع VELORO بالوضع الداكن اللي بيسكرول على وش الهولوجرام |
| `.github/workflows/deploy-pages.yml` | بيبني وينشر الموقع تلقائياً على GitHub Pages |

---

## تعديل المحتوى

- **النصوص والمشاريع:** افتح `index.html` وعدّل الأقسام مباشرة (كل قسم عليه كومنت واضح).
- **الألوان:** كل الألوان في أول ملف `style.css` جوه `:root`.
- **معلومات المشاريع:** دلوقتي كل لينكات المشاريع بتودّي على بروفايل GitHub.
  لما ترفع كل مشروع في repository خاص بيه، غيّر اللينك في `index.html` (دور على `project-links`).

### حاجات محتاجة تتأكد منها قبل النشر
- [ ] الاسم بالكامل (دلوقتي "Ahmed Osam" / "أحمد أسام")
- [ ] اللغة الافتراضية للموقع (دلوقتي إنجليزي — لو عايز العربي افتراضي، غيّر `"en"` لـ `"ar"` في أول `index.html`)
- [ ] الإيميل في قسم Contact: `ahmed.osam419007@gmail.com`
- [ ] لينك LinkedIn لو عايز تضيفه

---

## تشغيله محلياً

معندكش أي حاجة تعملها غير إنك تفتح `index.html` في المتصفح مباشرة. ولو عايز سيرفر محلي:

```bash
npx serve .
```

---

## النشر (GitHub Pages) — خطوة بخطوة أول مرة فقط

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
4. خلاص — أي `push` على `main` هينشر الموقع تلقائياً.

اللينك بقى: `https://ahmedosam.dev/` (واللينك القديم بيحوّل عليه تلقائياً)

---

## الدومين `ahmedosam.dev`

الموقع شغّال على دومين مخصص: **https://ahmedosam.dev/** — والدومين نفسه متسجل من **Name.com** بعرض GitHub Student Pack (سنة مجانية).

الـ DNS (على Name.com):

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  ahmedosam419007.github.io
```

- الشهادة (HTTPS) بتتولد تلقائياً من GitHub — و **Enforce HTTPS** مفعّل.
- اللينك القديم `ahmedosam419007.github.io/portfolio` بيحوّل تلقائياً للدومين الجديد.

---

## التقنيات

HTML · CSS · JavaScript (Vanilla) · GitHub Actions · GitHub Pages
