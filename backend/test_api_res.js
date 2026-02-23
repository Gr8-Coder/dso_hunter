const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const companyId = '785';

        const res = await axios.get(`https://www.screener.in/api/company/${companyId}/schedules/?parent=Other+Assets&section=balance-sheet`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("Failed", e.message);
    }
}
test();
