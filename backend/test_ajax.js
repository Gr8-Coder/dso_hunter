const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/RELIANCE/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const companyId = $('div[data-company-id]').attr('data-company-id');

        console.log("Fetching schedule for company:", companyId);

        const res = await axios.get(`https://www.screener.in/api/company/${companyId}/schedules/?parent=Other+Assets&section=Balance+Sheet`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.screener.in/company/RELIANCE/'
            }
        });

        console.log("Success! Data includes Trade Receivables?", res.data.includes('Trade Receivables'));
    } catch (e) { console.log("Failed", e.message); }
}
test();
