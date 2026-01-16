# 🎯 TaskFlow - Görev Takip Paneli

<div align="center">

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-v1.0-primary?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?style=for-the-badge&logo=prisma)

**Modern, ölçeklenebilir ve güvenli görev yönetim sistemi**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [API](#-api-dokümantasyonu)

</div>

---

## 📖 İçindekiler

- [📖 Hakkında](#-hakkında)
- [✨ Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [📋 Ön Hazırlık](#-ön-hazırlık)
- [🚀 Kurulum](#-kurulum)
- [⚙️ Çevre Değişkenleri](#️-çevre-değişkenleri)
- [💾 Veritabanı Kurulumu](#-veritabanı-kurulumu)
- [🏃 Uygulamayı Çalıştırma](#-uygulamayı-çalıştırma)
- [👥 Kullanıcı Rolleri ve Yetkiler](#-kullanıcı-rolleri-ve-yetkiler)
- [🎮 Kullanım Kılavuzu](#-kullanım-kılavuzu)
- [🔌 API Dokümantasyonu](#-api-dokümantasyonu)
- [🐛 Sorun Giderme](#-sorun-giderme)
- [📸 Ekran Görüntüleri](#-ekran-görüntüleri)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

---

## 💡 Hakkında

**TaskFlow**, takımların görevlerini ve projelerini etkili bir şekilde yönetebilmeleri için geliştirilmiş, modern web tabanlı bir görev yönetim uygulamasıdır. JWT tabanlı kimlik doğrulama, rol bazlı yetkilendirme (RBAC) ve takım odaklı veri erişim kontrolü ile güvenli ve ölçeklenebilir bir çözüm sunar.

### 🎯 Temel Amaç

- ✅ Takımlar arası işbirliğini kolaylaştırmak
- ✅ Proje ve görevleri merkezi bir yerden yönetmek
- ✅ Rol bazlı yetkilendirme ile güvenli ortam sağlamak
- ✅ Modern ve responsive kullanıcı deneyimi sunmak

---

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Güvenlik
- ✅ **JWT Tabanlı Authentication** - httpOnly cookies ile güvenli oturum yönetimi
- ✅ **Rol Bazlı Yetkilendirme (RBAC)** - Admin, Manager, Employee rolleri
- ✅ **İlk Girişte Zorunlu Şifre Değiştirme** - Yeni kullanıcılar için güvenlik önlemi
- ✅ **Profil Yönetimi** - Her kullanıcı kendi bilgilerini düzenleyebilir
- ✅ **Şifre Değiştirme** - Güvenli şifre güncelleme işlemi

### 👥 Kullanıcı ve Takım Yönetimi
- ✅ **Takım Oluşturma** - Admin ve Manager takım oluşturabilir
- ✅ **Takım Silme** - Admin takımları silebilir (içinde kullanıcı/proje olmamalı)
- ✅ **Kullanıcı Oluşturma** - Admin ve Manager kullanıcı ekleyebilir
- ✅ **Kullanıcı Silme** - Admin kullanıcı silebilir (kendini silemez)
- ✅ **Kullanıcı Atama** - Kullanıcıları takımlara atama
- ✅ **Takım Bazlı Veri Erişimi** - Manager/Employee sadece kendi takımının verilerini görür

### 📁 Proje Yönetimi
- ✅ **Proje Oluşturma** - Admin için takım seçimi, Manager için otomatik atama
- ✅ **Proje Düzenleme** - Proje adını güncelleme
- ✅ **Proje Silme** - Admin/Manager projeleri silebilir (içinde görev olmamalı)
- ✅ **Proje Listesi** - Tüm projeleri görüntüleme
- ✅ **Görev Sayısı** - Her projedeki görev sayısını gösterme

### ✅ Görev Yönetimi
- ✅ **Görev Oluşturma** - Başlık, açıklama, atama, tahmini süre
- ✅ **Görev Düzenleme** - Tüm görev bilgilerini güncelleme
- ✅ **Görev Silme** - Görevleri silme (yetki kontrolü ile)
- ✅ **Durum Takibi** - Yapılacak → Sürüyor → Tamamlandı
- ✅ **Kullanıcı Atama** - Görevleri kullanıcılara atama
- ✅ **Tahmini Süre** - Saat, Gün, Hafta cinsinden tahmin
- ✅ **Gelişmiş Filtreleme** - Durum, proje, atanan kişi, arama
- ✅ **Sayfalama** - 20'erli görev listesi
- ✅ **Sıralama** - Oluşturulma tarihine göre sıralama

### 📊 Dashboard ve Analitik
- ✅ **Overview Paneli** - Toplam görev, proje, kullanıcı istatistikleri
- ✅ **Durum Dağılımı** - Yapılacak, Sürüyor, Tamamlandı görev sayıları
- ✅ **KPI Kartları** - Önemli metriklerin görsel gösterimi
- ✅ **Responsive Tasarım** - Mobil, tablet, desktop uyumlu

### 🎨 Kullanıcı Arayüzü
- ✅ **Modern UI** - Tailwind CSS ile şık ve temiz tasarım
- ✅ **Modal Formlar** - Oluşturma ve düzenleme işlemleri için
- ✅ **Onay Dialog'ları** - Silme işlemleri için güvenlik
- ✅ **Loading States** - Yüklenme göstergeleri
- ✅ **Hata Mesajları** - Kullanıcı dostu hata bildirimleri
- ✅ **Dark Mode Ready** - Gelecekte dark mode desteği için hazır

---

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 15.5.9** - React framework (App Router)
- **React 19** - UI kütüphanesi
- **TypeScript 5.x** - Tip güvenliği
- **Tailwind CSS 3.x** - Styling
- **Lucide React** - İkonlar

### Backend
- **Next.js API Routes** - Server-side API
- **Prisma 6.19.2** - ORM
- **PostgreSQL** - Veritabanı (Neon hosting)

### Authentication & Security
- **JWT (jsonwebtoken)** - Token tabanlı auth
- **bcryptjs** - Şifre hashleme
- **httpOnly Cookies** - Güvenli oturum yönetimi
- **Zod** - Input validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📋 Ön Hazırlık

### Gerekli Araçlar

Kurulumdan önce aşağıdaki araçların bilgisayarınızda yüklü olduğundan emin olun:

1. **Node.js** (v18.x veya üzeri)
   ```bash
   node --version  # v18.x.x veya üzeri olmalı
   ```

2. **npm** (Node.js ile birlikte gelir)
   ```bash
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **PostgreSQL Veritabanı** (Neon kullanacağız, ücretsiz)

---

## 🚀 Kurulum

### Adım 1: Repo'yu Klonlayın

```bash
git clone https://github.com/birhatmf/to-do-app.git
cd to-do-app
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

Bu işlem aşağıdaki paketleri kuracaktır:
- `next`
- `react`
- `@prisma/client`
- `bcryptjs`
- `jsonwebtoken`
- `zod`
- `lucide-react`
- Ve diğer tüm bağımlılıklar...

### Adım 3: Neon Veritabanı Oluşturun

1. [Neon](https://neon.tech/signup)'a üye olun (ücretsiz)
2. Yeni bir proje oluşturun
3. Connection string'i kopyalayın (şu formatta olmalı):
   ```
   postgresql://username:password@hostname/database
   ```

### Adım 4: Çevre Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Veritabanı Connection String (Neon'dan aldığınız)
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# JWT Secret Token (Güçlü bir şifre oluşturun)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
```

⚠️ **Önemli:** `JWT_SECRET` değerini production'da kesinlikle değiştirin!

### Adım 5: Prisma Kurulumu

```bash
# Prisma Client'i oluşturun
npx prisma generate

# Veritabanı şemasını senkronize edin
npx prisma db push

# İsteğe bağlı: Seed data ile örnek veri yükleyin
npm run db:seed
```

### Adım 6: Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda açın: **http://localhost:3000**

---

## ⚙️ Çevre Değişkenleri

| Değişken | Açıklama | Zorunlu | Örnek |
|----------|----------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | Evet | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | JWT imzalama anahtarı | Evet | `min-32-karakter-güvenli-anahtar` |
| `NODE_ENV` | Ortam (development/production) | Hayır | `development` (varsayılan) |

### JWT Secret Oluşturma

Güvenli bir JWT secret oluşturmak için:

```bash
# Linux/Mac
openssl rand -base64 32

# Veya Node.js kullanarak
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 💾 Veritabanı Kurulumu

### Veritabanı Şeması

```
┌─────────────────────────────────────────────────────────────┐
│                         DATABASE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐        │
│  │   Team   │──────<│  User    │──────<│  Task    │        │
│  └──────────┘       └──────────┘       └──────────┘        │
│         │                   │                                  │
│         v                   v                                  │
│  ┌──────────┐                                                   │
│  │ Project  │                                                   │
│  └──────────┘                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Modeller ve İlişkiler

#### 1. **Team** (Takım)
- `id` - Benzersiz tanımlayıcı
- `name` - Takım adı (unique)
- `users[]` - Takımdaki kullanıcılar
- `projects[]` - Takımdaki projeler
- `createdAt` - Oluşturulma tarihi

#### 2. **User** (Kullanıcı)
- `id` - Benzersiz tanımlayıcı
- `name` - İsim
- `email` - Email (unique)
- `password` - Hashlenmiş şifre
- `role` - ADMIN, MANAGER, EMPLOYEE
- `teamId` - Takım ID (foreign key)
- `mustChangePassword` - İlk girişte şifre değiştirme zorunluluğu
- `createdTasks[]` - Oluşturduğu görevler
- `assignedTasks[]` - Kendisine atanan görevler
- `createdAt`, `updatedAt` - Tarih bilgileri

#### 3. **Project** (Proje)
- `id` - Benzersiz tanımlayıcı
- `name` - Proje adı
- `teamId` - Takım ID (foreign key)
- `tasks[]` - Proje görevleri
- `createdAt` - Oluşturulma tarihi
- Unique constraint: `(teamId, name)`

#### 4. **Task** (Görev)
- `id` - Benzersiz tanımlayıcı
- `projectId` - Proje ID (foreign key)
- `title` - Görev başlığı
- `description` - Görev açıklaması (opsiyonel)
- `status` - TODO, IN_PROGRESS, DONE
- `estimateValue` - Tahmini süre değeri
- `estimateUnit` - HOUR, DAY, WEEK
- `createdById` - Oluşturan kullanıcı
- `assigneeId` - Atanan kullanıcı (opsiyonel)
- `createdAt`, `updatedAt` - Tarih bilgileri

### Seed Data (Örnek Veri)

Seed script'i şu verileri oluşturur:

**2 Takım:**
- Pazarlama Ekibi
- Yazılım Ekibi

**6 Kullanıcı:**
- 1 Admin (admin@taskflow.com)
- 2 Manager (ahmet@taskflow.com, mehmet@taskflow.com)
- 3 Employee (ayse@taskflow.com, fatma@taskflow.com, ali@taskflow.com)

**4 Proje:**
- Her takım için 2 proje

**8 Görev:**
- Farklı durumlarda görevler

---

## 🏃 Uygulamayı Çalıştırma

### Development Modu

```bash
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışır.

Hot reload aktiftir - dosya değişiklikleri otomatik olarak yansır.

### Production Build

```bash
# Build al
npm run build

# Production'da çalıştır
npm start
```

### Diğer Komutlar

```bash
# Lint kontrolü
npm run lint

# Veritabanını seed et (örnek veri yükle)
npm run db:seed

# Prisma Studio (veritabanı görsel arayüzü)
npx prisma studio
```

### 🚀 Production'da PM2 ile Çalıştırma

PM2, Node.js uygulamalarını production'da yönetmek için güçlü bir process manager'dır. Uygulamanızı sürekli çalışır durumda tutar, otomatik yeniden başlatır ve cluster mode ile performansı artırır.

#### PM2 Kurulumu

```bash
# PM2 global olarak kurun (önerilen)
npm install -g pm2

# Veya projeye dahil edin (zaten package.json'da mevcut)
npm install pm2
```

#### PM2 ile Başlatma

```bash
# Build al ve PM2 ile başlat
npm run pm2:start

# Veya manuel olarak
npm run build
pm2 start ecosystem.config.js
```

#### PM2 Komutları

```bash
# Uygulamayı başlat
npm run pm2:start

# Uygulamayı durdur
npm run pm2:stop

# Uygulamayı yeniden başlat
npm run pm2:restart

# Uygulamayı sil (durdur ve PM2'den kaldır)
npm run pm2:delete

# Logları görüntüle
npm run pm2:logs

# Real-time monitoring
npm run pm2:monit

# Diğer PM2 komutları
pm2 list              # Tüm uygulamaları listele
pm2 show taskflow     # Uygulama detaylarını göster
pm2 flush             # Tüm logları temizle
pm2 reload taskflow   # Sıfır downtime ile yeniden yükle
pm2 startup           # Sunucu restartında otomatik başlatma
```

#### PM2 Ecosystem Yapılandırması

`ecosystem.config.js` dosyası PM2 ayarlarını içerir:

```javascript
module.exports = {
  apps: [
    {
      name: 'taskflow',              // Uygulama adı
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',         // Port 3000
      instances: 1,                  // Cluster mode (CPU sayısına göre artırılabilir)
      exec_mode: 'cluster',          // Cluster mode
      autorestart: true,             // Otomatik yeniden başlatma
      max_memory_restart: '1G',      // Bellek limiti
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',  // Hata logları
      out_file: './logs/out.log',    # Çıktı logları
      log_file: './logs/combined.log',
      time: true,                    // Loglara zaman damgası
    },
  ],
};
```

#### Özelleştirme

**Cluster Mode (Çoklu CPU Kullanımı):**

```javascript
// ecosystem.config.js
instances: 'max',  // veya CPU sayısı (örn: 4)
exec_mode: 'cluster',
```

**Port Değiştirme:**

```javascript
// ecosystem.config.js
args: 'start -p 8080',  // Port 8080
```

**Environment Değişkenleri:**

```javascript
// ecosystem.config.js
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  DATABASE_URL: 'postgresql://...',
  JWT_SECRET: 'your-secret-key',
}
```

#### Log Yönetimi

```bash
# Logları görüntüle (son 100 satır)
pm2 logs taskflow --lines 100

# Logları temizle
pm2 flush taskflow

# Log dosyaları
./logs/err.log      # Hata logları
./logs/out.log      # Standart çıktı
./logs/combined.log # Birleştirilmiş loglar
```

#### Sunucu Restart Sonrası Otomatik Başlatma

Sunucu yeniden başlatıldığında uygulamanın otomatik başlaması için:

```bash
# Startup script oluştur
pm2 startup

# Çıktıdaki komutu çalıştır (sudo ile)
# Örnek: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user

# Mevcut uygulamaları kaydet
pm2 save
```

#### Monitor ve Yönetim

```bash
# Web-based monitoring (açık kaynak)
pm2 plus

# Keymetrics monitoring (ücretsiz plan mevcut)
pm2 link <secret_key> <public_key>

# Terminal'de real-time monitoring
pm2 monit
```

#### Deployment Örneği

```bash
# 1. Son değişiklikleri çekin
git pull origin main

# 2. Bağımlılıkleri yükleyin
npm install

# 3. Veritabanını güncelleyin (gerekirse)
npx prisma db push

# 4. Build alın
npm run build

# 5. PM2 ile yeniden başlatın
pm2 restart taskflow

# Veya zero-downtime reload
pm2 reload taskflow
```

#### PM2 ile Production Troubleshooting

**Soru: Uygulama başlamıyor**

```bash
# Detaylı hata mesajları için
pm2 logs taskflow --err

# Yapılandırmayı kontrol edin
pm2 show taskflow

# Uygulamayı silip yeniden başlatın
pm2 delete taskflow
npm run pm2:start
```

**Soru: Yüksek CPU/RAM kullanımı**

```bash
# Kaynak kullanımını görüntüleyin
pm2 monit

# Bellek limitini düşürün
max_memory_restart: '512M',

# Instance sayısını azaltın
instances: 1,
```

**Soru: Loglar çok yer kaplıyor**

```bash
# Log rotation (pm2-logrotate modülü kurun)
pm2 install pm2-logrotate

# Log rotation ayarları
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## 👥 Kullanıcı Rolleri ve Yetkiler

### 🛡️ Admin (Yönetici)

**Tam yetkiye sahip, tüm sistemi yönetebilir.**

✅ **Yapabilir:**
- Tüm takımları görüntüleme
- Takım oluşturma, silme
- Tüm kullanıcıları görüntüleme
- Kullanıcı oluşturma (herhangi bir role), silme
- Herhangi bir takıma proje oluşturma
- Tüm projeleri görüntüleme, düzenleme, silme
- Tüm görevleri görüntüleme, düzenleme, silme
- Kendi profilini düzenleme

❌ **Yapamaz:**
- Kendini silme

### 👨‍💼 Manager (Yönetici)

**Takım yöneticisi, sadece kendi takımını yönetebilir.**

✅ **Yapabilir:**
- Sadece kendi takımını görüntüleme
- Takım oluşturabilir (var olan takıma eklenir)
- Sadece kendi takımındaki kullanıcıları görüntüleme
- Sadece Employee rolünde kullanıcı oluşturma
- Kendi takımına proje oluşturma
- Sadece kendi takımının projelerini görüntüleme, düzenleme, silme
- Sadece kendi takımının görevlerini görüntüleme
- Kendi takımındaki görevleri düzenleme, silme
- Tüm görevleri görüntüleme (filtreleme ile)
- Kendi profilini düzenleme

❌ **Yapamaz:**
- Takım silme
- Manager veya Admin rolünde kullanıcı oluşturma
- Kullanıcı silme
- Başka takımların projelerini düzenleme/silme

### 👤 Employee (Üye)

**Takım üyesi, atanan görevleri yerine getirir.**

✅ **Yapabilir:**
- Sadece kendi takımını görüntüleme
- Sadece kendi takımındaki kullanıcıları görüntüleme
- Kendi takımının projelerini görüntüleme
- Tüm görevleri görüntüleme (filtreleme ile)
- Kendi oluşturduğu görevleri düzenleme, silme
- Kendine atanan görevleri güncelleme (durum değiştirme)
- Kendi profilini düzenleme, şifre değiştirme

❌ **Yapamaz:**
- Takım oluşturma, silme
- Kullanıcı oluşturma, silme
- Proje oluşturma, düzenleme, silme
- Başka kullanıcıların görevlerini düzenleme/silme

### 🔑 Yetki Matrisi

| İşlem | Admin | Manager | Employee |
|-------|-------|---------|----------|
| Takım Oluşturma | ✅ | ✅ | ❌ |
| Takım Silme | ✅ | ❌ | ❌ |
| Kullanıcı Oluşturma | ✅ | ✅ (sadece Employee) | ❌ |
| Kullanıcı Silme | ✅ | ❌ | ❌ |
| Proje Oluşturma | ✅ | ✅ | ❌ |
| Proje Düzenleme | ✅ | ✅ (kendi takımı) | ❌ |
| Proje Silme | ✅ | ✅ (kendi takımı) | ❌ |
| Görev Oluşturma | ✅ | ✅ | ✅ |
| Görev Düzenleme | ✅ | ✅ (kendi takımı) | ✅ (sadece kendi) |
| Görev Silme | ✅ | ✅ (kendi takımı) | ✅ (sadece kendi) |
| Profil Düzenleme | ✅ | ✅ | ✅ |

---

## 🎮 Kullanım Kılavuzu

### 🔑 İlk Giriş

#### Demo Hesaplar (Seed Data ile Oluşturulan)

| Rol | Email | Şifre |
|-----|-------|-------|
| **Admin** | admin@taskflow.com | password123 |
| **Manager** | ahmet@taskflow.com | password123 |
| **Employee** | ayse@taskflow.com | password123 |

⚠️ **İlk girişte şifrenizi değiştirmeniz istenecektir!**

#### Giriş Adımları

1. **Login Sayfası**
   - Email ve şifrenizi girin
   - "Giriş Yap" butonuna tıklayın
   - İlk girişinizse şifre değiştirme sayfasına yönlendirileceksiniz

2. **Şifre Değiştirme (İlk Giriş)**
   - Mevcut şifrenizi girin
   - Yeni şifrenizi belirleyin (min. 6 karakter)
   - Yeni şifreyi tekrar girin
   - "Değiştir" butonuna tıklayın

3. **Dashboard**
   - Özet istatistikleri görüntüleyin
   - Güncel görevlerinizi kontrol edin

### 📋 Görev Yönetimi

#### Görev Oluşturma

1. **Görevler** sayfasına gidin
2. **"+ Yeni Görev"** butonuna tıklayın
3. Formu doldurun:
   - **Proje** - Proje seçin (zorunlu)
   - **Başlık** - Görev başlığı (zorunlu)
   - **Açıklama** - Detaylı açıklama (opsiyonel)
   - **Atanan Kişi** - Kullanıcı seçin (opsiyonel)
   - **Tahmini Süre** - Sayı ve birim girin (opsiyonel)
   - **Durum** - Yapılacak/Sürüyor/Tamamlandı seçin
4. **"Oluştur"** butonuna tıklayın

#### Görev Düzenleme

1. Görev listesinde **"Düzenle"** butonuna tıklayın
2. Bilgileri güncelleyin
3. **"Güncelle"** butonuna tıklayın

#### Görev Silme

1. Görev listesinde **"Sil"** butonuna tıklayın
2. Onay dialog'unda **"Tamam"** diyerek onaylayın

⚠️ **Dikkat:** Silinen görevler geri alınamaz!

#### Durum Değiştirme

1. Görev listesinde durum dropdown'ına tıklayın
2. Yeni durumu seçin:
   - **Yapılacak (TODO)** - Henüz başlanmadı
   - **Sürüyor (IN_PROGRESS)** - Çalışılıyor
   - **Tamamlandı (DONE)** - Bitti
3. Değişiklik otomatik kaydedilir

### 📁 Proje Yönetimi

#### Proje Oluşturma

1. **Projeler** sayfasına gidin
2. **"+ Yeni Proje"** butonuna tıklayın
3. Formu doldurun:
   - **Proje Adı** - Proje ismi (zorunlu)
   - **Takım** - Admin için takım seçimi zorunlu
4. **"Oluştur"** butonuna tıklayın

#### Proje Düzenleme

1. Proje kartındaki **✏️** butonuna tıklayın
2. Proje adını güncelleyin
3. **"Güncelle"** butonuna tıklayın

#### Proje Silme

1. Proje kartındaki **"Sil"** butonuna tıklayın
2. Onaylayın

⚠️ **Kısıt:** İçinde görev olan projeler silinemez!

### 👥 Kullanıcı Yönetimi

#### Kullanıcı Oluşturma

1. **Ekip Üyeleri** sayfasına gidin
2. **"+ Yeni Ekip Üyesi"** butonuna tıklayın
3. Formu doldurun:
   - **İsim** - Kullanıcı adı (zorunlu)
   - **Email** - Benzersiz email (zorunlu)
   - **Şifre** - Başlangıç şifresi (zorunlu, min. 6 karakter)
   - **Rol** - Admin/Manager/Employee seçin (Admin için)
   - **Takım** - Takım atayın (Admin için)
4. **"Oluştur"** butonuna tıklayın

⚠️ **Önemli:** Yeni oluşturulan kullanıcılar ilk girişte şifre değiştirmek zorundadır!

#### Kullanıcı Takıma Atama

1. **Takımlar** sayfasına gidin
2. İlgili takım kartındaki **"+"** butonuna tıklayın
3. Kullanıcı seçin
4. **"Ekle"** butonuna tıklayın

#### Kullanıcı Silme

1. **Ekip Üyeleri** sayfasına gidin
2. Kullanıcının yanındaki **"Sil"** butonuna tıklayın
3. Onaylayın

⚠️ **Kısıt:** Kendinizi silemezsiniz!

### 🏢 Takım Yönetimi

#### Takım Oluşturma

1. **Takımlar** sayfasına gidin
2. **"+ Yeni Takım"** butonuna tıklayın
3. Takım adını girin
4. **"Oluştur"** butonuna tıklayın

#### Takım Silme

1. Takım kartındaki **"Sil"** butonuna tıklayın
2. Onaylayın

⚠️ **Kısıt:** İçinde kullanıcı veya proje olan takımlar silinemez!

### 📊 Filtreleme ve Arama

#### Görev Filtreleme

**Görevler** sayfasında şu filtreleri kullanabilirsiniz:

- **Durum** - Yapılacak, Sürüyor, Tamamlandı
- **Proje** - Spesifik proje seçimi
- **Atanan Kişi** - Kullanıcıya göre filtreleme
- **Arama** - Başlıkta metin araması

**Temizle** butonu tüm filtreleri sıfırlar.

### 🔐 Profil Yönetimi

#### Profil Düzenleme

1. **Profil** sayfasına gidin (sidebar'dan)
2. **"Düzenle"** butonuna tıklayın
3. İsim ve/veya email'i güncelleyin
4. **"Güncelle"** butonuna tıklayın

#### Şifre Değiştirme

1. **Profil** sayfasına gidin
2. **"Şifre Değiştir"** butonuna tıklayın
3. Formu doldurun:
   - **Mevcut Şifre** - Şu anki şifreniz
   - **Yeni Şifre** - Yeni şifreniz (min. 6 karakter)
   - **Yeni Şifre (Tekrar)** - Onay için
4. **"Değiştir"** butonuna tıklayın

---

## 🔌 API Dokümantasyonu

### Authentication

Tüm API endpoint'leri JWT token gerektirir. Token `httpOnly` cookie üzerinden gönderilir.

```
Cookie: auth_token=<your-jwt-token>
```

### Endpoints

#### Auth

##### POST `/api/auth/login`
Kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "admin@taskflow.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Admin User",
    "email": "admin@taskflow.com",
    "role": "ADMIN",
    "teamId": null,
    "mustChangePassword": false
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Email veya şifre hatalı"
}
```

---

##### POST `/api/auth/logout`
Kullanıcı çıkışı yapar.

**Response (200):**
```json
{
  "success": true,
  "message": "Çıkış başarılı"
}
```

---

##### GET `/api/auth/me`
Mevcut kullanıcı bilgisini döner.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Admin User",
    "email": "admin@taskflow.com",
    "role": "ADMIN",
    "teamId": null,
    "mustChangePassword": false
  }
}
```

---

#### Projects

##### GET `/api/projects`
Tüm projeleri listeler (rol bazlı filtreleme ile).

**Query Params:**
- `teamId` (opsiyonel) - Takım ID'si

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxxx",
      "name": "E-Ticaret Platformu",
      "teamId": "clxxxxxx",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "team": {
        "id": "clxxxxxx",
        "name": "Yazılım Ekibi"
      },
      "_count": {
        "tasks": 5
      }
    }
  ]
}
```

---

##### POST `/api/projects`
Yeni proje oluşturur.

**Request Body:**
```json
{
  "name": "E-Ticaret Platformu",
  "teamId": "clxxxxxx"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "E-Ticaret Platformu",
    "teamId": "clxxxxxx",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "team": {
      "id": "clxxxxxx",
        "name": "Yazılım Ekibi"
    }
  }
}
```

---

##### PATCH `/api/projects/:id`
Proje günceller.

**Request Body:**
```json
{
  "name": "Yeni Proje Adı"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Yeni Proje Adı",
    "teamId": "clxxxxxx",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "team": {
      "id": "clxxxxxx",
      "name": "Yazılım Ekibi"
    }
  }
}
```

---

##### DELETE `/api/projects/:id`
Proje siler.

**Response (200):**
```json
{
  "success": true,
  "message": "Proje silindi"
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Proje içinde görevler olduğu için silinemez"
}
```

---

#### Tasks

##### GET `/api/tasks`
Görevleri listeler (filtreleme ve sayfalama ile).

**Query Params:**
- `status` (opsiyonel) - TODO, IN_PROGRESS, DONE
- `assigneeId` (opsiyonel) - Kullanıcı ID
- `projectId` (opsiyonel) - Proje ID
- `q` (opsiyonel) - Arama metni
- `page` (opsiyonel, varsayılan: 1) - Sayfa numarası
- `pageSize` (opsiyonel, varsayılan: 20) - Sayfa başı öğe sayısı
- `sort` (opsiyonel) - createdAt_asc, createdAt_desc

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clxxxxxx",
        "projectId": "clxxxxxx",
        "title": "Kullanıcı girişi ekranı",
        "description": "Login formu tasarlanacak",
        "status": "TODO",
        "estimateValue": 2,
        "estimateUnit": "DAY",
        "createdById": "clxxxxxx",
        "assigneeId": "clxxxxxx",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z",
        "project": {
          "id": "clxxxxxx",
          "name": "E-Ticaret Platformu",
          "teamId": "clxxxxxx"
        },
        "createdBy": {
          "id": "clxxxxxx",
          "name": "Admin User",
          "email": "admin@taskflow.com"
        },
        "assignee": {
          "id": "clxxxxxx",
          "name": "Ahmet Yılmaz",
          "email": "ahmet@taskflow.com"
        }
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2
  }
}
```

---

##### POST `/api/tasks`
Yeni görev oluşturur.

**Request Body:**
```json
{
  "projectId": "clxxxxxx",
  "title": "Kullanıcı girişi ekranı",
  "description": "Login formu tasarlanacak",
  "assigneeId": "clxxxxxx",
  "estimateValue": 2,
  "estimateUnit": "DAY",
  "status": "TODO"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "projectId": "clxxxxxx",
    "title": "Kullanıcı girişi ekranı",
    "description": "Login formu tasarlanacak",
    "status": "TODO",
    "estimateValue": 2,
    "estimateUnit": "DAY",
    "createdById": "clxxxxxx",
    "assigneeId": "clxxxxxx",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  }
}
```

---

##### PATCH `/api/tasks/:id`
Görev günceller.

**Request Body:**
```json
{
  "title": "Güncellenmiş başlık",
  "description": "Güncellenmiş açıklama",
  "assigneeId": "clxxxxxx",
  "status": "IN_PROGRESS",
  "estimateValue": 3,
  "estimateUnit": "DAY"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "title": "Güncellenmiş başlık",
    "status": "IN_PROGRESS",
    ...
  }
}
```

---

##### PATCH `/api/tasks/:id/status`
Görev durumunu günceller.

**Request Body:**
```json
{
  "status": "DONE"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "status": "DONE",
    ...
  }
}
```

---

##### DELETE `/api/tasks/:id`
Görev siler.

**Response (200):**
```json
{
  "success": true,
  "message": "Görev silindi"
}
```

---

#### Users

##### GET `/api/users`
Kullanıcıları listeler (rol bazlı filtreleme ile).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxxx",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@taskflow.com",
      "role": "MANAGER",
      "teamId": "clxxxxxx",
      "team": {
        "id": "clxxxxxx",
        "name": "Yazılım Ekibi"
      },
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

---

##### POST `/api/users`
Yeni kullanıcı oluşturur.

**Request Body:**
```json
{
  "name": "Ayşe Demir",
  "email": "ayse@taskflow.com",
  "password": "password123",
  "role": "EMPLOYEE",
  "teamId": "clxxxxxx"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Ayşe Demir",
    "email": "ayse@taskflow.com",
    "role": "EMPLOYEE",
    "teamId": "clxxxxxx",
    "team": {
      "id": "clxxxxxx",
      "name": "Yazılım Ekibi"
    },
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
}
```

---

##### DELETE `/api/users/:userId`
Kullanıcı siler (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Kullanıcı silindi"
}
```

---

##### PATCH `/api/users/:userId/team`
Kullanıcıyı takıma atar.

**Request Body:**
```json
{
  "teamId": "clxxxxxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Kullanıcı takıma atandı"
}
```

---

#### Teams

##### GET `/api/teams`
Tüm takımları listeler.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxxx",
      "name": "Yazılım Ekibi",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "_count": {
        "users": 5,
        "projects": 3
      }
    }
  ]
}
```

---

##### POST `/api/teams`
Yeni takım oluşturur.

**Request Body:**
```json
{
  "name": "Pazarlama Ekibi"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Pazarlama Ekibi",
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
}
```

---

##### DELETE `/api/teams/:teamId`
Takım siler (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Takım silindi"
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Takımda kullanıcılar veya projeler olduğu için silinemez"
}
```

---

#### User Profile

##### PATCH `/api/user/profile`
Mevcut kullanıcının profilini günceller.

**Request Body:**
```json
{
  "name": "Yeni İsim",
  "email": "yeni@email.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "name": "Yeni İsim",
    "email": "yeni@email.com",
    "role": "ADMIN",
    "teamId": null,
    "mustChangePassword": false
  },
  "message": "Profil güncellendi"
}
```

---

##### PATCH `/api/user/change-password`
Mevcut kullanıcının şifresini değiştirir.

**Request Body:**
```json
{
  "currentPassword": "eski-sifre",
  "newPassword": "yeni-sifre"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifre değiştirildi"
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Mevcut şifre hatalı"
}
```

---

### HTTP Status Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | BAŞARILI |
| 201 | OLUŞTURULDU |
| 400 | HATALI İSTEK |
| 401 | YETKİSİZ |
| 403 | YASAK |
| 404 | BULUNAMADI |
| 500 | SUNUCU HATASI |

---

## 🐛 Sorun Giderme

### Sorun: "npm install" başarısız oluyor

**Çözüm:**
```bash
# Node.js sürümünü kontrol edin
node --version  # v18.x.x olmalı

# Eski node_modules'i silin
rm -rf node_modules package-lock.json

# Yeniden yükleyin
npm install
```

---

### Sorun: "Database connection failed"

**Çözüm:**
```bash
# .env dosyasını kontrol edin
cat .env | grep DATABASE_URL

# Connection string formatı doğru olmalı:
# postgresql://username:password@hostname/database?sslmode=require

# Neon'da projenin aktif olduğunu kontrol edin
# "Branches" sekmesinden active branch'i kontrol edin
```

---

### Sorun: "prisma: command not found"

**Çözüm:**
```bash
# Prisma CLI'yi yükleyin
npm install -D prisma

# Veya npx kullanın
npx prisma db push
npx prisma generate
```

---

### Sorun: Login olmuyor, sürekli login sayfasına yönlendiriliyor

**Çözüm:**
```bash
# 1. Browser'da cookie'leri temizleyin
# 2. .env dosyasında JWT_SECRET tanımlı olduğundan emin olun

# 3. Prisma schema'yı güncelleyin
npx prisma db push

# 4. Uygulamayı yeniden başlatın
npm run dev
```

---

### Sorun: İlk girişte şifre değiştirmiyor

**Çözüm:**
```bash
# Veritabanında mustChangePassword alanını kontrol edin
npx prisma studio

# Eğer alan yoksa schema güncelleyin
npx prisma db push

# Seed data'yı yeniden yükleyin
npm run db:seed
```

---

### Sorun: Proje oluşturulamıyor

**Çözüm:**
```bash
# Admin için takım ID'si gereklidir
# Takımlar sayfasından bir takım oluşturun
# Veya seed data yükleyin:
npm run db:seed
```

---

### Sorun: "Cannot find module" hatası

**Çözüm:**
```bash
# Bağımlılıkları yeniden yükleyin
rm -rf node_modules package-lock.json
npm install

# Prisma'yı yeniden oluşturun
npx prisma generate
```

---

### Sorun: Port 3000 zaten kullanımda

**Çözüm:**
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Veya farklı port kullanın
PORT=3001 npm run dev
```

---

## 📸 Ekran Görüntüleri

### Login Sayfası
- Temiz ve modern giriş arayüzü
- Demo hesap bilgileri
- Hata mesajları

### Dashboard (Overview)
- KPI kartları
- Görev istatistikleri
- Proje ve kullanıcı özeti

### Görevler Sayfası
- Tablo görünümü
- Filtreleme paneli
- Durum değiştirme
- Düzenleme ve silme butonları

### Projeler Sayfası
- Kart görünümü
- Proje oluşturma modalı
- Düzenleme ve silme işlemleri

### Profil Sayfası
- Kullanıcı bilgileri
- Şifre değiştirme
- Profil güncelleme

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen aşağıdaki adımları takip edin:

### Fork ve Clone

1. Repo'yu fork edin
2. Lokalinize klonlayın:
   ```bash
   git clone https://github.com/your-username/to-do-app.git
   cd to-do-app
   ```

### Branch Oluşturun

```bash
git checkout -b feature/ozellik-adiniz
# veya
git checkout -b fix/hata-adiniz
```

### Değişikliklerinizi Yapın

- Kodunuzu yazın
- Test edin
- Commit edin:
  ```bash
  git add .
  git commit -m "Anlaşılır commit mesajı"
  ```

### Push Edin ve PR Oluşturun

```bash
git push origin feature/ozellik-adiniz
```

GitHub'da Pull Request oluşturun.

### Kod Standartları

- ✅ TypeScript kullanın
- ✅ Kodunuza comment ekleyin
- ✅ Component'leri küçük tutun
- ✅ Okunabilir değişken isimleri kullanın
- ✅ Hata yönetimi ekleyin
- ✅ Test edin

---

## 📄 Lisans

Bu proje **MIT** lisansı altındadır.

```
MIT License

Copyright (c) 2026 TaskFlow

İzni verilir, bu yazılımın ve ilgili dokümantasyon dosyalarının
"kopyalarının" herhangi bir kişiye bedelsiz verilmesine, kısıtlama
olmaksızın, dahil ancak bununla sınırlı olmamak üzere kullanma,
kopyalama, değiştirme, birleştirme, yayınlama, dağıtma, alt lisanslama
ve/veya kopyalarının satılması işlemlerine tabi tutulmasına,
yukarıdaki telif hakkı bildirimi ve bu izin bildiriminin tüm
kopyalarda veya önemli bölümlerde bulunması koşuluyla.
```

---

## 📞 İletişim

Sorularınız için:
- **GitHub Issues:** https://github.com/birhatmf/to-do-app/issues
- **Email:** birhatmf@example.com

---

## 🙏 Teşekkürler

Bu projeyi geliştirmek için kullanılan açık kaynak projelere teşekkürler:

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neon](https://neon.tech/)

---

<div align="center">

**⭐ Eğer bu projeyi beğendiyseniz, yıldız vermeyi unutmayın!**

Made with ❤️ by [birhatmf](https://github.com/birhatmf)

</div>
