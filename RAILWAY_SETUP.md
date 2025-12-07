# 🚂 Налаштування деплою на Railway

## 📋 Необхідні змінні середовища (Environment Variables)

### Обов'язкові змінні:

#### 1. WordPress Backend URL
```bash
UPSTREAM_BASE=https://www.api.bfb.projection-learn.website
NEXT_PUBLIC_UPSTREAM_BASE=https://www.api.bfb.projection-learn.website
```
> ⚠️ **Важливо:** URL без trailing slash в кінці

#### 2. Admin креденшали для автологіну
```bash
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
```
> 🔐 Ці креденшали використовуються для автентифікації на WordPress через JWT

#### 3. WooCommerce API (опціонально, якщо використовуєте)
```bash
WC_CONSUMER_KEY=ck_your_consumer_key
WC_CONSUMER_SECRET=cs_your_consumer_secret
```

### Опціональні змінні:

```bash
NODE_ENV=production
```

---

## 🛠️ Інструкція з налаштування на Railway:

### Крок 1: Створіть новий проект
1. Зайдіть на [railway.app](https://railway.app)
2. Натисніть "New Project"
3. Оберіть "Deploy from GitHub repo"
4. Виберіть ваш репозиторій

### Крок 2: Налаштуйте змінні середовища
1. Відкрийте проект на Railway
2. Перейдіть у вкладку "Variables"
3. Додайте всі змінні з списку вище

### Крок 3: Налаштуйте Build Command (якщо потрібно)
Railway автоматично визначить, що це Next.js проект, але ви можете вручну налаштувати:
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm start`

### Крок 4: Додайте домен (опціонально)
1. Перейдіть у вкладку "Settings"
2. У розділі "Domains" додайте свій домен або використовуйте автоматично згенерований

---

## 🔍 Діагностика проблем:

### Проблема: 404 на `/api/proxy` або `/api/banners`
**Рішення:**
- Перевірте, чи правильно встановлено `UPSTREAM_BASE`
- Перевірте логи Railway: `railway logs`

### Проблема: Банери не відображаються (рожевий плейсхолдер)
**Можливі причини:**
1. ❌ `UPSTREAM_BASE` не налаштовано → Перевірте змінні середовища
2. ❌ `ADMIN_USER` або `ADMIN_PASS` неправильні → Перевірте креденшали
3. ❌ WordPress не повертає дані про банери → Перевірте, чи є custom post type `banner` на WordPress

**Як перевірити:**
```bash
# Перевірте логи Railway
railway logs

# Шукайте рядки з емодзі:
# 🎨 [/api/banners] - логи для банерів
# 🔀 [/api/proxy] - логи для проксі
```

### Проблема: 403 Forbidden на API запитах
**Рішення:**
- Переконайтесь, що JWT токен генерується коректно
- Перевірте, чи встановлено `ADMIN_USER` та `ADMIN_PASS`
- Перевірте логи автологіну: `🔐 [AdminAutoLogin]`

### Проблема: 500 Internal Server Error
**Рішення:**
1. Перевірте логи Railway: `railway logs`
2. Переконайтесь, що всі обов'язкові змінні середовища встановлені
3. Перевірте, чи WordPress доступний за URL з `UPSTREAM_BASE`

---

## 📊 Моніторинг логів:

### Типи логів та їх значення:

| Емодзі | Тип логу | Що означає |
|--------|----------|------------|
| 🎨 | `/api/banners` | Запити на отримання банерів |
| 🔀 | `/api/proxy` | Проксування WordPress API |
| 🔐 | `AdminAutoLogin` | Автологін адміна |
| ✅ | Успіх | Операція виконана успішно |
| ❌ | Помилка | Виникла проблема |

### Приклад успішних логів:
```
🎨 [/api/banners] → Запит на отримання банерів
🎨 [/api/banners] ✅ JWT токен отримано
🎨 [/api/banners] ✅ Отримано банерів: 3
```

### Приклад помилкових логів:
```
🎨 [/api/banners] ❌ UPSTREAM_BASE не налаштовано
```

---

## 🚀 Після налаштування:

1. Перевірте, чи сайт працює: відкрийте URL Railway
2. Перевірте консоль браузера (F12) на наявність помилок
3. Перевірте логи Railway: `railway logs`
4. Якщо все працює - готово! 🎉

---

## 📞 Потрібна допомога?

Якщо виникли проблеми:
1. Перевірте логи Railway
2. Перевірте консоль браузера (F12)
3. Переконайтесь, що всі змінні середовища встановлені
4. Перевірте, чи WordPress доступний за `UPSTREAM_BASE`

