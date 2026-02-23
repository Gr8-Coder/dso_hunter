const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/RELIANCE/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(data);
        console.log("Other Assets URL:", $('button[onclick*="Other Assets"]').attr('onclick'));
        // Find all buttons that load schedules
        $('button.button-plain').each((i, el) => {
            console.log($(el).attr('onclick'));
        });
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
