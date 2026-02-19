const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const HealthInfo = require('./models/HealthInfo');
const Faq = require('./models/Faq');
const FoodItem = require('./models/FoodItem');
const SurveyQuestion = require('./models/SurveyQuestion');
const ContactInfo = require('./models/ContactInfo');
const AboutContent = require('./models/AboutContent');

const seed = async () => {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@prediabet.com' });
    if (!existingAdmin) {
        await User.create({
            name: 'Admin',
            surname: 'Prediabet',
            email: 'admin@prediabet.com',
            phone: '0545 664 76 62',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✅ Admin user created (admin@prediabet.com / admin123)');
    }

    // Seed Health Info
    const healthCount = await HealthInfo.countDocuments();
    if (healthCount === 0) {
        await HealthInfo.insertMany([
            { title: 'Prediyabe-TR mobil uygulaması nedir?', content: 'PREDIABE-TR mobil uygulaması, prediyabetli bireylerin sağlık takibi yapmasına yardımcı olan kapsamlı bir mobil uygulamadır. Uygulama, kullanıcıların adım sayısı, BKİ değeri, beslenme alışkanlıkları ve diyabet risk değerlendirmesi gibi önemli sağlık parametrelerini takip etmelerini sağlar.', order: 1 },
            { title: 'Prediyabe-TR mobil uygulamasının hedefleri nelerdir?', content: 'Uygulamanın temel hedefleri: prediyabetli bireylere sağlıklı yaşam biçimi davranışları kazandırmak, düzenli fiziksel aktivite alışkanlığı oluşturmak, sağlıklı beslenme konusunda farkındalık yaratmak ve diyabet riskini azaltmaktır.', order: 2 },
            { title: 'Prediyabe-TR mobil uygulamasının tasarımcıları kimlerdir?', content: 'Uygulama, Kütahya Sağlık Bilimleri Üniversitesi bünyesinde sağlık profesyonelleri ve yazılım geliştiriciler tarafından tasarlanmıştır.', order: 3 },
            { title: 'Sağlıklı Yaşam', content: 'Sağlıklı yaşam; düzenli fiziksel aktivite, dengeli beslenme, yeterli uyku ve stres yönetimi gibi temel bileşenlerden oluşur. Günde en az 30 dakika orta yoğunlukta fiziksel aktivite yapılması, haftanın en az beş günü olmak kaydıyla önerilmektedir.', order: 4 },
            { title: 'Prediyabeti Öğrenelim', content: 'Prediyabet, kan şekeri düzeylerinin normalin üzerinde olduğu ancak diyabet tanısı konulacak kadar yüksek olmadığı bir durumdur. Prediyabet, Tip 2 diyabetin öncüsü olarak kabul edilir ve yaşam tarzı değişiklikleriyle kontrol altına alınabilir.', order: 5 },
            { title: 'Prediyabetin Komplikasyonları', content: 'Prediyabet kontrol altına alınmazsa Tip 2 diyabete ilerleyebilir. Diyabet; kalp hastalıkları, böbrek yetmezliği, görme kaybı, sinir hasarı ve ayak problemleri gibi ciddi komplikasyonlara yol açabilir.', order: 6 },
            { title: 'Tanı ve Tedavi Yöntemleri', content: 'Prediyabet tanısı açlık kan şekeri testi, oral glukoz tolerans testi veya HbA1c testi ile konulur. Tedavide ilk adım yaşam tarzı değişiklikleridir: sağlıklı beslenme, düzenli egzersiz ve kilo kontrolü önerilir.', order: 7 },
        ]);
        console.log('✅ Health info articles seeded');
    }

    // Seed FAQs
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
        await Faq.insertMany([
            { question: 'Kan şekerinizi evde ölçebileceğinizi biliyor musunuz?', answer: 'Kan şekerinizi glükometre ile ev ortamında ölçebilirsiniz. Yaklaşık 5 saniye içerisinde dijital alanda sonuç görünmektedir. Kan şekeri ölçerken ilk gelen kanı pamukla silmeli devamında gelen kanı ölçüm için kullanmalısınız.', order: 1 },
            { question: 'Prediyabet (gizli şeker) tehlikeli bir hastalık mıdır?', answer: 'Kontrol altına alındıktan sonra prediyabet tehlikeli bir hastalık değildir. Hastalığı kontrol altında tutmanın bir diğer avantajı diyabete geçiş sürecinin önlenmek önemlenir. Yaşam tarzı değişiklikleri prediyabet riskinin düşürülmesinde önemlidir. Dünya Sağlık Örgütü erişkinler için günde en az 30 dakika, haftanın en az beş günü olmak kaydıyla haftada minimum 150 dakika fiziksel aktivite yapılmasını önermektedir.', order: 2 },
            { question: 'Prediyabeti (gizli şeker) nasıl kontrol altına alabilirim?', answer: 'Hastalığın kontrol altında tutulması sağlıklı yaşam biçimi davranışlarına uyum gösterme ile mümkündür. Düzenli egzersiz, sağlıklı beslenme ve düzenli kan şekeri takibi en önemli adımlardır.', order: 3 },
        ]);
        console.log('✅ FAQs seeded');
    }

    // Seed Food Items
    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
        await FoodItem.insertMany([
            { name: 'Çavdar unu ve kepekli ekmeğin yanı sıra buğday unu', category: 'unlu_mamuller' },
            { name: 'Balık Havyarı', category: 'balik' },
            { name: 'Et ve mantar et suyu, yanı sıra bunlara dayalı yemekler', category: 'et' },
            { name: 'Yüksek yağ içerikli süt ürünleri', category: 'sut_urunleri' },
            { name: 'Siyah ve yeşil çay, bitkisel çaylar ve soğanlar, yabani gül suyu', category: 'icecek' },
            { name: 'Az yağlı balıklar (pollock, walleye, turna, hake vs.) - fırında kaynatin veya fırında pişirin', category: 'balik' },
            { name: 'Yağda konserve balık', category: 'balik' },
            { name: 'Füme, kurutulmuş ve tuzlu balık', category: 'balik' },
            { name: 'Sütlü tatlılar', category: 'tatli' },
            { name: 'İç yağ', category: 'yag' },
            { name: 'Dondurma, reçeller, kremler, tatlılar', category: 'tatli' },
            { name: 'Herhangi bir formda yağlı balık türleri', category: 'balik' },
        ]);
        console.log('✅ Food items seeded');
    }

    // Seed FINDRISK Questions
    const questionCount = await SurveyQuestion.countDocuments({ category: 'findrisk' });
    if (questionCount === 0) {
        await SurveyQuestion.insertMany([
            {
                questionText: 'Yaşınız',
                category: 'findrisk',
                order: 1,
                options: [
                    { text: '<45 yaş', score: 0 },
                    { text: '45-54 yaş', score: 2 },
                    { text: '55-64 yaş', score: 3 },
                    { text: '>64 yaş', score: 4 },
                ],
            },
            {
                questionText: 'BKİ (Bilmiyorsanız Hesaplayın)',
                category: 'findrisk',
                order: 2,
                options: [
                    { text: '<25 kg/m²', score: 0 },
                    { text: '25-30 kg/m²', score: 1 },
                    { text: '>30 kg/m²', score: 3 },
                ],
            },
            {
                questionText: 'Bel Çevresi (Gebelik öncesi bel çevresi tahmini olarak sorulacaktır)',
                category: 'findrisk',
                order: 3,
                options: [
                    { text: '<80 cm', score: 0 },
                    { text: '80-88 cm', score: 3 },
                    { text: '>88 cm', score: 4 },
                ],
            },
            {
                questionText: 'Günde en az 30 dakika fiziksel aktivite yapıyor musunuz?',
                category: 'findrisk',
                order: 4,
                options: [
                    { text: 'Evet', score: 0 },
                    { text: 'Hayır', score: 2 },
                ],
            },
            {
                questionText: 'Ne sıklıkla sebze ve meyve yiyorsunuz?',
                category: 'findrisk',
                order: 5,
                options: [
                    { text: 'Her gün', score: 0 },
                    { text: 'Her gün değil', score: 1 },
                ],
            },
            {
                questionText: 'Hiç kan basıncı ilacı kullandınız mı?',
                category: 'findrisk',
                order: 6,
                options: [
                    { text: 'Hayır', score: 0 },
                    { text: 'Evet', score: 2 },
                ],
            },
            {
                questionText: 'Daha önce yüksek kan şekeri tespit edildi mi?',
                category: 'findrisk',
                order: 7,
                options: [
                    { text: 'Hayır', score: 0 },
                    { text: 'Evet', score: 5 },
                ],
            },
            {
                questionText: 'Aile bireylerinde diyabet tanısı alan var mı?',
                category: 'findrisk',
                order: 8,
                options: [
                    { text: 'Hayır', score: 0 },
                    { text: 'Evet, ikinci derece akraba', score: 3 },
                    { text: 'Evet, birinci derece akraba', score: 5 },
                ],
            },
        ]);
        console.log('✅ FINDRISK survey questions seeded');
    }

    // Seed Contact Info
    const contactCount = await ContactInfo.countDocuments();
    if (contactCount === 0) {
        await ContactInfo.create({
            phone: '0545 664 76 62',
            email: 'ibrahim.topuz@ksbu.edu.tr',
            website: 'www.prediabet-tr.com',
            whatsapp: '+905456647662',
        });
        console.log('✅ Contact info seeded');
    }

    // Seed About
    const aboutCount = await AboutContent.countDocuments();
    if (aboutCount === 0) {
        await AboutContent.create({
            content: 'PREDIABE-TR mobil uygulamasının geliştirilmesi ve kullanılabilirliğinin değerlendirilmesidir. Bu mobil uygulama prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içermektedir.',
            images: [],
        });
        console.log('✅ About content seeded');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
