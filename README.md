# PREDIABET — Prediyabet Sağlık Takip Uygulaması

Prediyabet ve tip-2 diyabet riskini izlemeye yönelik geliştirilmiş, mobil öncelikli bir sağlık takip uygulamasıdır. React Native (Expo) tabanlı mobil istemci ile Node.js + MongoDB tabanlı REST API'den oluşmaktadır.

---

## Proje Yapısı

```
prediyabet-app/
├── app/          # React Native (Expo) mobil uygulama
├── api/          # Node.js + Express REST API
└── panel/        # Yönetim paneli
```

---

## Özellikler

| Modül | Açıklama |
|---|---|
| Kimlik Doğrulama | JWT tabanlı kayıt / giriş sistemi |
| FINDRISK Anketi | Finlandiya Tip-2 Diyabet Risk Anketi — puanlama ve risk seviyesi |
| BKİ Hesaplama | Vücut Kitle İndeksi hesaplama ve geçmiş kayıt takibi |
| Besin Takibi | Günlük kalori ve besin girişi |
| Adımsayar | Expo Sensors ile adım sayma ve günlük hedef takibi |
| Ön / Son Testler | Eğitim öncesi ve sonrası bilgi testleri |
| Sağlık Bilgilendirme | Prediyabet hakkında içerik sayfaları |
| SSS & İletişim | Sık sorulan sorular ve iletişim bilgileri |
| Karanlık Mod | Sistem temasına uyumlu açık / koyu tema desteği |

---

## Teknolojiler

### Mobil Uygulama (`app/`)
- **React Native** 0.81 + **Expo** 54
- **React Navigation** v7 (Native Stack)
- **Expo Sensors** — adımsayar
- **Expo Font / Asset** — font ve görsel yönetimi
- **Axios** — HTTP istekleri
- **AsyncStorage** — oturum kalıcılığı

### API (`api/`)
- **Node.js** + **Express** 4
- **MongoDB** + **Mongoose** 8
- **JWT** (jsonwebtoken) — kimlik doğrulama
- **bcryptjs** — parola hashleme
- **dotenv** — ortam değişkenleri

---

## Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (yerel veya Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Android / iOS cihaz veya emülatör

---

### 1. API Sunucusunu Başlatın

```bash
cd api
npm install
```

`.env` dosyasını düzenleyin:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/prediyabet
JWT_SECRET=gizli_anahtar
```

Veritabanını seed verileriyle doldurun (isteğe bağlı):

```bash
npm run seed
```

Sunucuyu başlatın:

```bash
# Geliştirme (nodemon ile)
npm run dev

# Üretim
npm start
```

API varsayılan olarak `http://localhost:5000` adresinde çalışır.

---

### 2. Mobil Uygulamayı Başlatın

```bash
cd app
npm install
```

`src/services/api.js` dosyasında API adresini cihazınıza göre ayarlayın:

```js
// Android emülatör
baseURL: 'http://10.0.2.2:5000/api'

// iOS simülatör
baseURL: 'http://localhost:5000/api'

// Fiziksel cihaz (yerel ağ IP'nizi yazın)
baseURL: 'http://192.168.x.x:5000/api'
```

Expo'yu başlatın:

```bash
npx expo start -c
```

QR kodu Expo Go uygulamasıyla tarayın veya emülatörde `a` (Android) / `i` (iOS) tuşuna basın.

---

## API Uç Noktaları

| Yöntem | Uç Nokta | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş — JWT döner |
| GET / POST / DELETE | `/api/bmi` | BKİ kayıtları |
| GET / POST | `/api/findrisk` | FINDRISK anket kayıtları |
| GET | `/api/findrisk/questions` | Anket soruları |
| GET / POST / DELETE | `/api/food` | Besin girişleri |
| GET / POST | `/api/steps` | Adım kayıtları |
| GET / POST | `/api/tests` | Ön / son test kayıtları |
| GET | `/api/health-info` | Sağlık bilgilendirme içerikleri |
| GET | `/api/faq` | SSS listesi |
| GET | `/api/contact` | İletişim bilgileri |
| GET | `/api/about` | Hakkımızda içeriği |

Kimlik doğrulama gerektiren tüm uç noktalara istek başlığında `Authorization: Bearer <token>` eklenmesi gerekir.

---

## Ekran Görüntüleri

> Ana ekran, FINDRISK anketi, BKİ hesaplama ve adımsayar modülleri hem açık hem koyu tema desteğiyle sunulmaktadır.

---

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
