async function test() {
  try {
    const res = await fetch('http://localhost:3000/en/products');
    const text = await res.text();
    if (text.includes('Smartphone Pro Max')) {
      console.log('SUCCESS: Products found on Frontend UI!');
    } else {
      console.log('ERROR: Products not rendering on frontend', text.slice(0, 500));
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
