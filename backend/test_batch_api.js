const axios = require('axios');

async function test() {
    try {
        const { data } = await axios.post('http://localhost:5001/scrape/batch', {
            tickers: ['RELIANCE', 'DEEPAKFERT', 'HDFCBANK']
        }, { responseType: 'stream' });

        data.on('data', chunk => {
            const lines = chunk.toString().split('\n').filter(Boolean);
            lines.forEach(l => {
                const res = JSON.parse(l);
                console.log(`${res.ticker} - DSO: ${res.dso}, Revenue: ${res.revenue}, Rec: ${res.receivables}, Mock: ${res.isMockedFallback}`);
            });
        });

    } catch (e) {
        console.error("Error", e.message);
    }
}
test();
