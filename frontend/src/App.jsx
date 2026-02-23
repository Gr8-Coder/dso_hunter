import { useState } from 'react'

function App() {
  const [tickersInput, setTickersInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!tickersInput.trim()) return

    setLoading(true)
    setError('')

    const tickersList = tickersInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (tickersList.length === 0) {
      setLoading(false)
      return
    }

    setTickersInput('')

    try {
      const response = await fetch('http://localhost:5001/scrape/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: tickersList })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to start batch extraction')
        setLoading(false)
        return
      }

      // Read streaming NDJSON response
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        // Value might contain multiple JSON lines if chunks get batched
        const lines = value.split('\n').filter(l => l.trim().length > 0)

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            setResults(prev => [data, ...prev])
          } catch (e) {
            console.error('Error parsing line: ', line)
          }
        }
      }

    } catch (err) {
      setError('Network error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val) => {
    if (!val) return '₹-';
    // Format in Rupees for the Indian context (using En-IN)
    return '₹' + new Intl.NumberFormat('en-IN', {
      notation: "compact",
      compactDisplay: "short"
    }).format(val)
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Tier 1': return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
      case 'Tier 2': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case 'Tier 3': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Premium Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">DSO Hunter</h1>
              <p className="text-xs text-slate-500 font-medium">FINANCIAL INTELLIGENCE</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              System Online
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Search Section */}
        <section className="mb-12 max-w-2xl mx-auto">
          <div className="glass p-8 rounded-3xl shadow-xl shadow-black/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>

            <h2 className="text-2xl font-semibold mb-2 text-white">Target Acquisition</h2>
            <p className="text-slate-400 mb-6 text-sm">Enter a company ticker to scrape financial data and calculate Days Sales Outstanding (DSO).</p>

            <form onSubmit={handleSearch} className="group flex flex-col gap-4">
              <textarea
                value={tickersInput}
                onChange={(e) => setTickersInput(e.target.value.toUpperCase())}
                placeholder="Paste company tickers here (e.g., AAPL, MSFT) one per line..."
                className="w-full bg-slate-900/80 border border-slate-700/50 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner min-h-[150px] resize-y"
              />
              <button
                type="submit"
                disabled={loading || !tickersInput.trim()}
                className="self-end bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl px-8 py-3 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Extracting</span>
                  </>
                ) : 'Extract Data'}
              </button>
            </form>

            {loading && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Scraping Financials...</span>
                  <span className="animate-pulse text-blue-400">Processing</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden border border-slate-700/30">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-1.5 rounded-full relative w-full origin-left animate-[progress_2s_ease-in-out_infinite]">
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[2px] animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3 text-orange-400 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Results Table Section */}
        {results.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Intelligence Report
              </h3>
              <span className="text-sm font-medium text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50">{results.length} targets</span>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-xl border border-slate-800/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="px-6 py-5">Ticker</th>
                      <th className="px-6 py-5">Days Sales Out (DSO)</th>
                      <th className="px-6 py-5">Priority Tier</th>
                      <th className="px-6 py-5 text-right">Avg. Receivables</th>
                      <th className="px-6 py-5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {results.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300 group-hover:bg-slate-700 transition-colors border border-slate-700/50">
                              {item.ticker.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <a
                                href={`https://www.screener.in/company/${item.ticker}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-blue-400 tracking-wide hover:text-blue-300 transition-colors hover:underline flex items-center gap-1"
                              >
                                {item.ticker}
                                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              {item.isMockedFallback && (
                                <span title="Fallback Data" className="text-orange-500/70 text-[10px] uppercase tracking-tighter">MOCK</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold bg-white text-transparent bg-clip-text">
                              {item.dso}
                            </span>
                            <span className="text-xs text-slate-500 mb-1 font-medium">days</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getTierColor(item.tier)}`}>
                            {item.tier}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium text-slate-300">
                          {formatCurrency(item.receivables)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium text-slate-400">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                          No intelligence data extracted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes progress {
          0% { transform: scaleX(0); opacity: 0.1; }
          20% { transform: scaleX(0.2); opacity: 0.5; }
          40% { transform: scaleX(0.4); opacity: 1; }
          60% { transform: scaleX(0.6); opacity: 1; }
          80% { transform: scaleX(0.8); opacity: 0.5; }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}} />
    </div>
  )
}

export default App
