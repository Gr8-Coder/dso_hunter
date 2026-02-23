const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/DEEPAKFERT/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(data);

        let found = false;
        $('button').each((i, btn) => {
            const onclick = $(btn).attr('onclick');
            if (onclick && onclick.includes('Other Assets')) {
                console.log("Found onclick:", onclick);
                found = true;
            }
        });

        if (!found) {
            console.log("Searching for any schedules url:");
            const match = data.match(/\/api\/company\/[^\s'"]+/g);
            console.log(match ? new Set(match) : "None found");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
