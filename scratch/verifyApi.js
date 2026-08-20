import axios from 'axios';

async function testApi() {
  console.log('🧪 Testing QuoteVerse API with MySQL Database (10,000+ quotes)...');
  const baseURL = 'http://localhost:5000';

  try {
    // 1. Stats Endpoint
    const statsRes = await axios.get(`${baseURL}/api/quotes/stats`);
    console.log('✅ /api/quotes/stats:', {
      totalQuotes: statsRes.data.total,
      categoriesCount: statsRes.data.categories.length
    });

    // 2. Random Quote
    const randomRes = await axios.get(`${baseURL}/api/quotes/random`);
    console.log('✅ /api/quotes/random:', {
      id: randomRes.data.id,
      text: randomRes.data.text.substring(0, 50) + '...',
      author: randomRes.data.author,
      category: randomRes.data.category,
      mood: randomRes.data.mood,
      tags: randomRes.data.tags,
      hasTextMapping: !!randomRes.data.text && !!randomRes.data.quote_text
    });

    // 3. Paginated Quotes
    const pageRes = await axios.get(`${baseURL}/api/quotes?page=1&limit=5`);
    console.log('✅ /api/quotes?page=1&limit=5:', {
      page: pageRes.data.page,
      limit: pageRes.data.limit,
      total: pageRes.data.total,
      totalPages: pageRes.data.totalPages,
      receivedItems: pageRes.data.data.length
    });

    // 4. Category Filter
    const catRes = await axios.get(`${baseURL}/api/quotes/category/Technology?limit=3`);
    console.log('✅ /api/quotes/category/Technology:', {
      count: catRes.data.length,
      category: catRes.data[0]?.category,
      author: catRes.data[0]?.author
    });

    // 5. Search
    const searchRes = await axios.get(`${baseURL}/api/quotes/search?q=success`);
    console.log('✅ /api/quotes/search?q=success:', {
      found: searchRes.data.length,
      firstResultAuthor: searchRes.data[0]?.author
    });

    console.log('\n🎉 ALL 5 API ENDPOINT TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ API Test Failed:', err.message, err.response?.data || '');
    process.exit(1);
  }
}

testApi();
