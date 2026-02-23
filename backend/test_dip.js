const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/DEEPAKFERT/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(data);
        console.log("DEEPAKFERT has Trade Receivables?", data.includes('Trade Receivables'));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
