

---

# 🔹 الفكرة الأساسية

```text
Desktop (المكتب)
→ تفتح رسالة
→ تتخذ قرار
→ تظهر نتيجة
→ ترجع للمكتب
→ السيناريو التالي
→ في النهاية تقرير
```

---

# 🔹 1. شاشة المكتب (Desktop Screen) — الشاشة الرئيسية

## الشكل

```text
----------------------------------
🖥 Desktop

📧 Inbox (1)
💼 Wallet
👤 Profile

XP: 50 | Security: 60

----------------------------------
```

---

## السلوك

* المستخدم يضغط على:

```text
Inbox
```

→ يفتح السيناريو

---

# 🔹 2. شاشة البريد (Inbox)

```text
----------------------------------
Inbox

1. Salary Bonus Update
   From: hr@acme-bonus.com

----------------------------------

[ Open Message ]
```

---

## السلوك

```text
Click message → يفتح السيناريو
```

---

# 🔹 3. شاشة الرسالة (Message Screen)

```text
----------------------------------
From: hr@acme-bonus.com
Subject: Bonus Update

"You have received a bonus..."

----------------------------------

What will you do?

[ Continue ]
[ Ignore ]
```

---

# 🔹 4. اتخاذ القرار

المستخدم يضغط:

```text
Continue أو Ignore
```

---

# 🔹 5. شاشة النتيجة (Popup / Window)

تظهر كأنها نافذة على سطح المكتب:

```text
----------------------------------
❌ Incorrect

This message is not from your company.

XP: +0
Security: -30

----------------------------------

[ Close ]
```

أو:

```text
----------------------------------
✅ Correct

You avoided a suspicious message.

XP: +50

----------------------------------

[ Close ]
```

---

# 🔹 6. الرجوع للمكتب

```text
Click Close
→ يرجع للـ Desktop
```

---

# 🔹 7. السيناريو التالي

على الـ Desktop:

```text
📧 Inbox (1 new message)
```

→ نفس العملية تتكرر

---

# 🔹 8. نهاية الجلسة

بعد آخر رسالة:

Popup:

```text
----------------------------------
🎯 Session Complete

XP: 250
Security: 80

----------------------------------

[ View Report ]
```

---

# 🔹 9. شاشة التقرير

```text
----------------------------------
Session Report

XP: 250
Security: 80
Awareness: 75

----------------------------------

[ Restart ]
```

---

# 🔹 التدفق الكامل (بسيط جدًا)

```text
Desktop
→ Inbox
→ Message
→ Decision
→ Result Popup
→ Desktop
→ (repeat)
→ Final Report
```

---

# 🔹 المكونات (UI Components)

```text
DesktopLayout
AppIcons (Inbox, Wallet, Profile)
InboxWindow
MessageWindow
ResultPopup
FinalReportWindow
```

---

# 🔹 أهم قرار تصميمي

```text
كل شيء يصير داخل "نوافذ"
```

يعني:

```text
ما فيه صفحات كثيرة
بس:
Desktop + Windows
```

---

# 🔹 ليش هذا التصميم قوي

```text
- واقعي (يشبه الكمبيوتر)
- بسيط جدًا
- واضح للحكام
- سهل التنفيذ
```

---

# 🔹 الجملة اللي تقولها في العرض

> We designed the experience as a desktop environment, where scenarios appear as real messages, and users interact with them naturally as if they were using their own computer.

---

