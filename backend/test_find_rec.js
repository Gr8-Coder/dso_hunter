const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/RELIANCE/consolidated/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        $('tr').each((i, row) => {
            const h = $(row).text();
            if (h.includes('Receivables')) {
                console.log("Found row:", h.trim().replace(/\s+/g, ' '));
            }
        });
        console.log("Search done.");
    } catch (e) { console.log("Failed", e.message); }
}
test();
