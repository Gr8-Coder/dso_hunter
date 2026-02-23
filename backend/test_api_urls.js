const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/DEEPAKFERT/consolidated/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const companyId = $('div[data-company-id]').attr('data-company-id');

        console.log("Fetching schedule for company:", companyId);

        const urls = [
            `https://www.screener.in/api/company/${companyId}/schedules/?parent=Other+Assets&section=Balance+Sheet`,
            `https://www.screener.in/api/company/${companyId}/schedules/?parent=Other%20Assets&section=Balance%20Sheet`,
            `https://www.screener.in/api/company/${companyId}/schedules/?parent=Other+Assets&section=balance-sheet`,
            `https://www.screener.in/api/company/${companyId}/schedules/?parent=Other%20Assets&section=balance-sheet`
        ]

        for (const u of urls) {
            try {
                const res = await axios.get(u, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': '*/*',
                        'Referer': 'https://www.screener.in/company/DEEPAKFERT/consolidated/'
                    }
                });
                console.log("Success with", u);
                console.log("Contains Trade Receivables?", res.data.includes('Trade Receivables'));
            } catch (e) {
                console.log("Failed", u, e.message);
            }
        }
    } catch (e) { console.log("Init Failed", e.message); }
}
test();
