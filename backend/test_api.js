const axios = require('axios');

async function test() {
    try {
        const { data } = await axios.get('https://www.screener.in/api/company/2726/schedules/?parent=Other+Assets&section=Balance+Sheet', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        console.log("With 2726:", data.includes('Trade Receivables'));
    } catch (e) { console.log("2726 failed", e.message); }

    try {
        const { data: d2 } = await axios.get('https://www.screener.in/api/company/811/schedules/?parent=Other+Assets&section=Balance+Sheet', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        console.log("With 811:", d2.includes('Trade Receivables'));
    } catch (e) { console.log("811 failed", e.message); }
}
test();
