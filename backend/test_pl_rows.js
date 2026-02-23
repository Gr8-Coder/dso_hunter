const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/company/DEEPAKFERT/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const plTable = $('#profit-loss table.data-table');
        if (plTable.length > 0) {
            plTable.find('tr').each((i, el) => {
                const rowHeader = $(el).find('td').first().text().trim();
                console.log("P&L Row:", rowHeader);
            });
        }
    } catch (e) { }
}
test();
