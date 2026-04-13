import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Database...');

  // 1. Create Categories
  const catElectronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      hsn_code: '8517', // Example for mobile phones
    },
  });

  const catFashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion',
      slug: 'fashion',
      hsn_code: '6109', // T-shirts
    },
  });

  const catHome = await prisma.category.upsert({
    where: { slug: 'home-kitchen' },
    update: {},
    create: {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      hsn_code: '7323', // Kitchenware
    },
  });

  // 2. Create Products
  const products = [
    // Electronics
    {
      name: { en: 'Smartphone Pro Max', hi: 'स्मार्टफोन प्रो मैक्स' },
      slug: 'smartphone-pro-max',
      category_id: catElectronics.id,
      brand: 'TechBrand',
      description: { en: 'Latest 5G smartphone with pure OS.', hi: 'विशुद्ध ओएस के साथ नवीनतम 5G स्मार्टफोन।' },
      hsn_code: '8517',
      gst_rate: 18.0,
      mrp_paise: 5999900, // ₹59,999.00
      price_paise: 4999900, // ₹49,999.00
      stock: 50,
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Phone'],
    },
    {
      name: { en: 'Wireless Earbuds', hi: 'वायरलेस ईयरबड्स' },
      slug: 'wireless-earbuds-anc',
      category_id: catElectronics.id,
      brand: 'SoundHub',
      description: { en: 'Active Noise Cancellation.', hi: 'एक्टिव नॉइज़ कैंसलेशन।' },
      hsn_code: '8518',
      gst_rate: 18.0,
      mrp_paise: 499900,
      price_paise: 249900,
      stock: 150,
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Earbuds'],
    },
    {
      name: { en: 'Smartwatch Series 5', hi: 'स्मार्टवॉच सीरीज 5' },
      slug: 'smartwatch-series-5',
      category_id: catElectronics.id,
      brand: 'WearOS',
      description: { en: 'Fitness tracking.', hi: 'फिटनेस ट्रैकिंग।' },
      hsn_code: '9102',
      gst_rate: 18.0,
      mrp_paise: 999900,
      price_paise: 699900,
      stock: 0, // out of stock
      images: ['https://dummyimage.com/600x600/0d9488/fff&text=Watch'],
    },

    // Fashion
    {
      name: { en: 'Men Cotton T-Shirt', hi: 'मेन्स कॉटन टी-शर्ट' },
      slug: 'men-cotton-tshirt',
      category_id: catFashion.id,
      brand: 'ThreadWear',
      description: { en: '100% pure organic cotton.', hi: '100% शुद्ध ऑर्गेनिक कॉटन।' },
      hsn_code: '6109',
      gst_rate: 5.0, // clothing under 1000
      mrp_paise: 99900,
      price_paise: 49900,
      stock: 200,
      images: ['https://dummyimage.com/600x600/f43f5e/fff&text=T-Shirt'],
    },
    {
      name: { en: 'Women Denim Jacket', hi: 'विमेंस डेनिम जैकेट' },
      slug: 'women-denim-jacket',
      category_id: catFashion.id,
      brand: 'DenimCo',
      description: { en: 'Classic blue denim jacket.', hi: 'क्लासिक ब्लू डेनिम जैकेट।' },
      hsn_code: '6202',
      gst_rate: 12.0, // clothing above 1000
      mrp_paise: 299900,
      price_paise: 159900,
      stock: 75,
      images: ['https://dummyimage.com/600x600/f43f5e/fff&text=Jacket'],
    },
    {
      name: { en: 'Running Shoes Pro', hi: 'रनिंग शूज प्रो' },
      slug: 'running-shoes-pro',
      category_id: catFashion.id,
      brand: 'AeroStep',
      description: { en: 'Lightweight running shoes.', hi: 'हल्के रनिंग जूते।' },
      hsn_code: '6404',
      gst_rate: 18.0,
      mrp_paise: 349900,
      price_paise: 199900,
      stock: 120,
      images: ['https://dummyimage.com/600x600/f43f5e/fff&text=Shoes'],
    },
    {
      name: { en: 'Traditional Kurta', hi: 'पारंपरिक कुर्ता' },
      slug: 'traditional-cotton-kurta',
      category_id: catFashion.id,
      brand: 'DesiLook',
      description: { en: 'Pure cotton Kurta for festive wear.', hi: 'उत्सव के लिए शुद्ध सूती कुर्ता।' },
      hsn_code: '6205',
      gst_rate: 5.0,
      mrp_paise: 129900,
      price_paise: 89900,
      stock: 60,
      images: ['https://dummyimage.com/600x600/f43f5e/fff&text=Kurta'],
    },

    // Home & Kitchen
    {
      name: { en: 'Non-Stick Cookware Set', hi: 'नॉन-स्टिक कुकवेयर सेट' },
      slug: 'non-stick-cookware',
      category_id: catHome.id,
      brand: 'KitchenMaster',
      description: { en: '3 piece non-stick set.', hi: '3 पीस नॉन-स्टिक सेट।' },
      hsn_code: '7323',
      gst_rate: 12.0,
      mrp_paise: 249900,
      price_paise: 149900,
      stock: 30,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Cookware'],
    },
    {
      name: { en: 'Blender 500W', hi: 'ब्लेंडर 500W' },
      slug: 'kitchen-blender-500w',
      category_id: catHome.id,
      brand: 'MixIt',
      description: { en: 'High power blender.', hi: 'हाई पावर ब्लेंडर।' },
      hsn_code: '8509',
      gst_rate: 18.0,
      mrp_paise: 199900,
      price_paise: 129900,
      stock: 100,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Blender'],
    },
    {
      name: { en: 'Cotton Bedsheet', hi: 'सूती बेडशीट' },
      slug: 'cotton-double-bedsheet',
      category_id: catHome.id,
      brand: 'SleepWell',
      description: { en: 'Double size premium bedsheet.', hi: 'डबल साइज़ प्रीमियम बेडशीट।' },
      hsn_code: '6302',
      gst_rate: 5.0,
      mrp_paise: 149900,
      price_paise: 79900,
      stock: 250,
      images: ['https://dummyimage.com/600x600/0f766e/fff&text=Bedsheet'],
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log('Seeding Complete! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
