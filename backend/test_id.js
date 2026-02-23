const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/RELIANCE/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(data);
        const companyId = $('div[data-company-id]').attr('data-company-id');
        console.log("Company ID div:", companyId);

        // Also look for warehouse id
        const bodyId = $('body').attr('data-company-id');
        console.log("Body ID:", bodyId);

        const bId = $('#company-info').attr('data-warehouse-id') || $('[data-warehouse-id]').attr('data-warehouse-id');
        console.log("Warehouse ID:", bId);

    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
