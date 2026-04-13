async function test() {
  try {
    const resBE = await fetch('http://127.0.0.1:3001/api/products');
    const dataBE = await resBE.json();
    console.log('Backend Products Found:', dataBE?.data?.length);
    console.log('First Product Name:', dataBE?.data?.[0]?.name?.en);
  } catch (err) {
    console.error('Backend Fetch error:', err.message);
  }

  try {
    const resFE = await fetch('http://127.0.0.1:3000/en/products');
    const textFE = await resFE.text();
    if (textFE.includes('Smartphone Pro Max') || textFE.includes('Explore Collection')) {
       console.log('Frontend rendered successfully!');
    } else {
       console.log('Frontend missing data:', textFE.slice(0, 100));
    }
  } catch (err) {
    console.error('Frontend Fetch error:', err.message);
  }
}
test();
