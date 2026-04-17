import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Database...');

  // ── Categories ──────────────────────────────────────────────
  const [catElectronics, catMen, catWomen, catKids, catHome] = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics', hsn_code: '8517' },
    }),
    prisma.category.upsert({
      where: { slug: 'men' },
      update: {},
      create: { name: 'Men', slug: 'men', hsn_code: '6109', image_url: 'https://dummyimage.com/400x400/1e40af/fff&text=Men' },
    }),
    prisma.category.upsert({
      where: { slug: 'women' },
      update: {},
      create: { name: 'Women', slug: 'women', hsn_code: '6104', image_url: 'https://dummyimage.com/400x400/be185d/fff&text=Women' },
    }),
    prisma.category.upsert({
      where: { slug: 'kids' },
      update: {},
      create: { name: 'Kids', slug: 'kids', hsn_code: '6111', image_url: 'https://dummyimage.com/400x400/d97706/fff&text=Kids' },
    }),
    prisma.category.upsert({
      where: { slug: 'home-kitchen' },
      update: {},
      create: { name: 'Home & Kitchen', slug: 'home-kitchen', hsn_code: '7323' },
    }),
  ]);

  // ── Products ─────────────────────────────────────────────────
  const products = [
    // Electronics
    {
      name: { en: 'Smartphone Pro Max', hi: 'स्मार्टफोन प्रो मैक्स' },
      slug: 'smartphone-pro-max',
      category_id: catElectronics.id,
      brand: 'TechBrand',
      description: { en: 'Latest 5G smartphone with 200MP camera and all-day battery.', hi: 'नवीनतम 5G स्मार्टफोन।' },
      hsn_code: '8517', gst_rate: 18.0,
      mrp_paise: 5999900, price_paise: 4999900, stock: 50,
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Phone'],
    },
    {
      name: { en: 'Wireless Earbuds ANC', hi: 'वायरलेस ईयरबड्स' },
      slug: 'wireless-earbuds-anc',
      category_id: catElectronics.id,
      brand: 'SoundHub',
      description: { en: 'Active Noise Cancellation with 30hr battery life.', hi: 'एक्टिव नॉइज़ कैंसलेशन।' },
      hsn_code: '8518', gst_rate: 18.0,
      mrp_paise: 499900, price_paise: 249900, stock: 150,
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Earbuds'],
    },
    {
      name: { en: 'Smartwatch Series 5', hi: 'स्मार्टवॉच सीरीज 5' },
      slug: 'smartwatch-series-5',
      category_id: catElectronics.id,
      brand: 'WearOS',
      description: { en: 'Fitness tracking with SpO2 and heart rate monitor.', hi: 'फिटनेस ट्रैकिंग।' },
      hsn_code: '9102', gst_rate: 18.0,
      mrp_paise: 999900, price_paise: 699900, stock: 0,
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Watch'],
    },

    // ── MEN ──
    {
      name: { en: "Men's Classic Oxford Shirt", hi: 'मेंस क्लासिक ऑक्सफोर्ड शर्ट' },
      slug: 'men-oxford-shirt',
      category_id: catMen.id,
      brand: 'UrbanThreads',
      description: { en: 'Premium 100% cotton Oxford weave shirt, perfect for office or casual wear. Available in S/M/L/XL.', hi: 'प्रीमियम कॉटन ऑक्सफोर्ड शर्ट।' },
      hsn_code: '6205', gst_rate: 5.0,
      mrp_paise: 179900, price_paise: 99900, stock: 180,
      images: ['https://dummyimage.com/600x600/1e40af/fff&text=Men+Shirt'],
    },
    {
      name: { en: "Men's Slim Fit Chinos", hi: 'मेंस स्लिम फिट चिनोस' },
      slug: 'men-slim-chinos',
      category_id: catMen.id,
      brand: 'UrbanThreads',
      description: { en: 'Stretch-cotton slim fit chinos for a modern tailored look. Machine washable.', hi: 'स्ट्रेच-कॉटन स्लिम फिट चिनोस।' },
      hsn_code: '6203', gst_rate: 12.0,
      mrp_paise: 299900, price_paise: 179900, stock: 120,
      images: ['https://dummyimage.com/600x600/1e3a8a/fff&text=Men+Chinos'],
    },
    {
      name: { en: "Men's Sports Polo", hi: 'मेंस स्पोर्ट्स पोलो' },
      slug: 'men-sports-polo',
      category_id: catMen.id,
      brand: 'SportFit',
      description: { en: 'Sweat-wicking performance polo shirt for gym and outdoor activites.', hi: 'परफॉर्मेंस पोलो शर्ट।' },
      hsn_code: '6105', gst_rate: 5.0,
      mrp_paise: 149900, price_paise: 79900, stock: 200,
      images: ['https://dummyimage.com/600x600/1d4ed8/fff&text=Men+Polo'],
    },
    {
      name: { en: "Men's Leather Chelsea Boots", hi: 'मेंस लेदर चेल्सी बूट्स' },
      slug: 'men-chelsea-boots',
      category_id: catMen.id,
      brand: 'SoleKing',
      description: { en: 'Genuine leather upper with elastic side panel. Durable rubber outsole.', hi: 'असली चमड़े के चेल्सी बूट्स।' },
      hsn_code: '6403', gst_rate: 18.0,
      mrp_paise: 599900, price_paise: 399900, stock: 65,
      images: ['https://dummyimage.com/600x600/0f2d6e/fff&text=Men+Boots'],
    },
    {
      name: { en: "Men's Hooded Sweatshirt", hi: 'मेंस हूडेड स्वेटशर्ट' },
      slug: 'men-hooded-sweatshirt',
      category_id: catMen.id,
      brand: 'CozyCraft',
      description: { en: 'Fleece-lined hoodie with kangaroo pocket. Machine washable, preshrunk fabric.', hi: 'फ्लीस-लाइन्ड हूडी।' },
      hsn_code: '6110', gst_rate: 12.0,
      mrp_paise: 249900, price_paise: 139900, stock: 95,
      images: ['https://dummyimage.com/600x600/172554/fff&text=Men+Hoodie'],
    },

    // ── WOMEN ──
    {
      name: { en: "Women's Floral Kurta Set", hi: 'महिला फ्लोरल कुर्ता सेट' },
      slug: 'women-floral-kurta-set',
      category_id: catWomen.id,
      brand: 'DesiGlam',
      description: { en: 'Printed cotton kurta with matching palazzos. Handblock print, breathable fabric.', hi: 'प्रिंटेड कॉटन कुर्ता सेट।' },
      hsn_code: '6211', gst_rate: 5.0,
      mrp_paise: 249900, price_paise: 149900, stock: 140,
      images: ['https://dummyimage.com/600x600/be185d/fff&text=Women+Kurta'],
    },
    {
      name: { en: "Women's Wrap Midi Dress", hi: 'महिला रैप मिडी ड्रेस' },
      slug: 'women-wrap-midi-dress',
      category_id: catWomen.id,
      brand: 'FemiStyle',
      description: { en: 'Elegant wrap-around midi dress in flowy chiffon fabric. Perfect for parties.', hi: 'एलिगेंट रैप-अराउंड मिडी ड्रेस।' },
      hsn_code: '6204', gst_rate: 12.0,
      mrp_paise: 399900, price_paise: 249900, stock: 80,
      images: ['https://dummyimage.com/600x600/9d174d/fff&text=Women+Dress'],
    },
    {
      name: { en: "Women's Yoga Leggings", hi: 'महिला योगा लेगिंग्स' },
      slug: 'women-yoga-leggings',
      category_id: catWomen.id,
      brand: 'FlexFit',
      description: { en: 'High-waist, 4-way stretch leggings with moisture-wicking technology.', hi: 'हाई-वेस्ट योगा लेगिंग्स।' },
      hsn_code: '6114', gst_rate: 5.0,
      mrp_paise: 129900, price_paise: 69900, stock: 220,
      images: ['https://dummyimage.com/600x600/831843/fff&text=Women+Yoga'],
    },
    {
      name: { en: "Women's Block Heel Sandals", hi: 'महिला ब्लॉक हील सैंडल' },
      slug: 'women-block-heel-sandals',
      category_id: catWomen.id,
      brand: 'HeelHaven',
      description: { en: 'Comfortable 3-inch block heels with cushioned footbed and adjustable ankle strap.', hi: 'ब्लॉक हील सैंडल।' },
      hsn_code: '6402', gst_rate: 18.0,
      mrp_paise: 349900, price_paise: 199900, stock: 55,
      images: ['https://dummyimage.com/600x600/701a75/fff&text=Women+Heels'],
    },
    {
      name: { en: "Women's Embroidered Blazer", hi: 'महिला एम्ब्रॉयडर्ड ब्लेज़र' },
      slug: 'women-embroidered-blazer',
      category_id: catWomen.id,
      brand: 'BoutiqueByDesign',
      description: { en: 'Statement embroidered blazer — wear it over a dress or jeans for an elevated look.', hi: 'एम्ब्रॉयडर्ड ब्लेज़र।' },
      hsn_code: '6104', gst_rate: 12.0,
      mrp_paise: 699900, price_paise: 449900, stock: 30,
      images: ['https://dummyimage.com/600x600/581c87/fff&text=Women+Blazer'],
    },

    // ── KIDS ──
    {
      name: { en: "Kids' Dino Print Tee", hi: 'किड्स डायनो प्रिंट टी-शर्ट' },
      slug: 'kids-dino-print-tee',
      category_id: catKids.id,
      brand: 'TinyTrends',
      description: { en: 'Fun dinosaur print round-neck tee in soft cotton blend. Ages 2–12. Easy-care fabric.', hi: 'डायनो प्रिंट टी-शर्ट।' },
      hsn_code: '6111', gst_rate: 5.0,
      mrp_paise: 79900, price_paise: 39900, stock: 300,
      images: ['https://dummyimage.com/600x600/d97706/fff&text=Kids+Dino'],
    },
    {
      name: { en: "Kids' Jogger Set", hi: 'किड्स जॉगर सेट' },
      slug: 'kids-jogger-set',
      category_id: catKids.id,
      brand: 'TinyTrends',
      description: { en: 'Matching hoodie and jogger pants set. Cozy fleece, perfect for winters. Ages 3–10.', hi: 'बच्चों का जॉगर सेट।' },
      hsn_code: '6111', gst_rate: 5.0,
      mrp_paise: 149900, price_paise: 89900, stock: 160,
      images: ['https://dummyimage.com/600x600/b45309/fff&text=Kids+Jogger'],
    },
    {
      name: { en: "Kids' Light-Up Sneakers", hi: 'किड्स लाइट-अप स्नीकर्स' },
      slug: 'kids-light-up-sneakers',
      category_id: catKids.id,
      brand: 'LittleSteps',
      description: { en: 'LED light-up soles that flash with every step! Velcro closure for easy wear. Size 20–34.', hi: 'LED लाइट-अप सोल्स के साथ स्नीकर्स।' },
      hsn_code: '6404', gst_rate: 18.0,
      mrp_paise: 199900, price_paise: 129900, stock: 90,
      images: ['https://dummyimage.com/600x600/92400e/fff&text=Kids+Shoes'],
    },
    {
      name: { en: "Kids' School Backpack", hi: 'किड्स स्कूल बैकपैक' },
      slug: 'kids-school-backpack',
      category_id: catKids.id,
      brand: 'PackMate',
      description: { en: 'Ergonomic moulded back panel. Multiple compartments, water-resistant material. Ages 5–12.', hi: 'स्कूल बैकपैक।' },
      hsn_code: '4202', gst_rate: 18.0,
      mrp_paise: 169900, price_paise: 99900, stock: 110,
      images: ['https://dummyimage.com/600x600/78350f/fff&text=Kids+Bag'],
    },
    {
      name: { en: "Kids' Rainbow Sweater", hi: 'किड्स रेनबो स्वेटर' },
      slug: 'kids-rainbow-sweater',
      category_id: catKids.id,
      brand: 'CozyCraft',
      description: { en: 'Vibrant rainbow stripe knit sweater. Warm acrylic blend, machine washable. Ages 2–10.', hi: 'रेनबो स्ट्राइप स्वेटर।' },
      hsn_code: '6110', gst_rate: 5.0,
      mrp_paise: 119900, price_paise: 69900, stock: 140,
      images: ['https://dummyimage.com/600x600/d97706/fff&text=Kids+Sweater'],
    },

    // Home & Kitchen
    {
      name: { en: 'Non-Stick Cookware Set', hi: 'नॉन-स्टिक कुकवेयर सेट' },
      slug: 'non-stick-cookware',
      category_id: catHome.id,
      brand: 'KitchenMaster',
      description: { en: '3-piece induction-compatible non-stick set with glass lids.', hi: '3 पीस कुकवेयर सेट।' },
      hsn_code: '7323', gst_rate: 12.0,
      mrp_paise: 249900, price_paise: 149900, stock: 30,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Cookware'],
    },
    {
      name: { en: 'Blender 500W', hi: 'ब्लेंडर 500W' },
      slug: 'kitchen-blender-500w',
      category_id: catHome.id,
      brand: 'MixIt',
      description: { en: 'High-speed 500W blender with 5 speed settings and stainless jars.', hi: 'हाई-स्पीड ब्लेंडर।' },
      hsn_code: '8509', gst_rate: 18.0,
      mrp_paise: 199900, price_paise: 129900, stock: 100,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Blender'],
    },
    {
      name: { en: 'Cotton Bedsheet Double', hi: 'सूती डबल बेडशीट' },
      slug: 'cotton-double-bedsheet',
      category_id: catHome.id,
      brand: 'SleepWell',
      description: { en: '300 thread-count pure Egyptian cotton double bedsheet with 2 pillow covers.', hi: 'डबल बेडशीट।' },
      hsn_code: '6302', gst_rate: 5.0,
      mrp_paise: 149900, price_paise: 79900, stock: 250,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Bedsheet'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    console.log(`  ✅ ${(p.name as any).en}`);
  }

  console.log('\n🎉 Seeding Complete! Total:', products.length, 'products across 5 categories.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
