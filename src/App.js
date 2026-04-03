import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Shield, AlertTriangle, 
  Link as LinkIcon, FileText, LayoutDashboard, 
  History, LogOut, Activity, Search, Server, User, Loader2,
  Database, Cpu, Globe, Code
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App State
  const [scanHistory, setScanHistory] = useState([
    { id: 1, type: 'url', input: 'http://192.168.1.1/update-bank-details', score: 95, level: 'High', status: 'Phishing', date: '2026-03-20 14:30' },
    { id: 2, type: 'text', input: 'URGENT: Your account has been suspended. Click here to verify.', score: 85, level: 'High', status: 'Phishing', date: '2026-03-21 09:15' },
    { id: 3, type: 'url', input: 'https://www.google.com', score: 5, level: 'Low', status: 'Safe', date: '2026-03-21 11:45' }
  ]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-wider">PhishGuard</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="New Scan" 
            isActive={activeTab === 'scan'} 
            onClick={() => setActiveTab('scan')} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Scan History" 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="text-sm">
              <p className="font-medium">Demo User</p>
              <p className="text-slate-400 text-xs">user@example.com</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Security Dashboard'}
            {activeTab === 'scan' && 'AI Phishing Scanner'}
            {activeTab === 'history' && 'Scan History'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Server size={16} className="text-blue-500" /> Flask API: Online</span>
            <span className="flex items-center gap-1"><Database size={16} className="text-green-500" /> MongoDB: Connected</span>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView history={scanHistory} onNewScan={() => setActiveTab('scan')} />}
          {activeTab === 'scan' && <ScannerView onScanComplete={(result) => setScanHistory([result, ...scanHistory])} />}
          {activeTab === 'history' && <HistoryView history={scanHistory} />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">PhishGuard AI</h1>
          <p className="text-blue-100">Intelligent Phishing Detection System</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="demo@phishguard.ai"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Dashboard'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Demo Mode: Just click Login.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function DashboardView({ history, onNewScan }) {
  const totalScans = history.length;
  const phishingFound = history.filter(h => h.level === 'High').length;
  const safeFound = history.filter(h => h.level === 'Low').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Scans" value={totalScans} icon={<Activity className="text-blue-500" />} color="bg-blue-50" />
        <StatCard title="Phishing Detected" value={phishingFound} icon={<ShieldAlert className="text-red-500" />} color="bg-red-50" />
        <StatCard title="Safe Links/Text" value={safeFound} icon={<ShieldCheck className="text-green-500" />} color="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Analyze New Threat</h3>
            <p className="text-slate-500 text-sm mb-6">
              Paste a suspicious URL, email content, or SMS message to run it through our AI detection engine.
            </p>
          </div>
          <button 
            onClick={onNewScan}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            <Search size={18} /> Run New Scan
          </button>
        </div>

        {/* Recent Activity Mini */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4 truncate">
                  <div className={`p-2 rounded-full ${item.level === 'High' ? 'bg-red-100 text-red-600' : item.level === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {item.level === 'High' ? <ShieldAlert size={20} /> : item.level === 'Medium' ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-xs">{item.input}</p>
                    <p className="text-xs text-slate-500">{item.date} • {item.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Badge level={item.level} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tech Stack Info Card */}
        <div className="lg:col-span-3 bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 mt-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Cpu size={20} className="text-blue-400"/> System Architecture</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-slate-800 rounded-xl">
              <Globe className="text-blue-400 mb-2" size={24} />
              <p className="font-semibold text-slate-200">Frontend (Vercel)</p>
              <p className="text-slate-400 text-xs mt-1">React.js & Tailwind CSS</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl">
              <Server className="text-green-400 mb-2" size={24} />
              <p className="font-semibold text-slate-200">Backend (Render)</p>
              <p className="text-slate-400 text-xs mt-1">Python, Flask / FastAPI</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl">
              <Code className="text-purple-400 mb-2" size={24} />
              <p className="font-semibold text-slate-200">AI Model</p>
              <p className="text-slate-400 text-xs mt-1">Scikit-learn, NLTK, Pandas</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl">
              <Database className="text-yellow-400 mb-2" size={24} />
              <p className="font-semibold text-slate-200">Database (Atlas)</p>
              <p className="text-slate-400 text-xs mt-1">MongoDB (NoSQL)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ScannerView({ onScanComplete }) {
  const [inputType, setInputType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeThreat = (text, type) => {
    let score = 0;
    let flags = [];
    const lowerText = text.toLowerCase();

    if (type === 'url') {
      if (lowerText.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)) { score += 40; flags.push("IP address used instead of domain name"); }
      if (lowerText.split('.').length > 3 && !lowerText.includes('www')) { score += 25; flags.push("Multiple suspicious subdomains"); }
      if (lowerText.includes('-')) { score += 10; flags.push("Hyphenated domain structure"); }
      if (lowerText.match(/\.(xyz|top|club|loan|click)$/)) { score += 35; flags.push("Uncommon/Suspicious Top-Level Domain (TLD)"); }
      if (!lowerText.startsWith('https')) { score += 20; flags.push("Missing SSL Certificate (No HTTPS)"); }
      if (lowerText.includes('login') || lowerText.includes('verify') || lowerText.includes('secure')) { score += 15; flags.push("Deceptive keywords in URL"); }
    } else {
      const suspiciousWords = ['urgent', 'win', 'free', 'suspended', 'verify', 'password', 'bank', 'account', 'click here', 'prize', 'lottery', 'invoice', 'action required'];
      let keywordCount = 0;
      suspiciousWords.forEach(word => {
        if (lowerText.includes(word)) {
          score += 15;
          keywordCount++;
          flags.push(`Suspicious keyword detected: "${word}"`);
        }
      });
      if (keywordCount > 3) score += 20;
      if (text.includes('http')) { score += 20; flags.push("Contains embedded links"); }
    }

    score = Math.min(score, 99);
    if(score === 0 && text.length > 5) score = Math.floor(Math.random() * 10) + 1;

    let level = 'Low';
    let status = 'Safe';
    if (score > 35) { level = 'Medium'; status = 'Suspicious'; }
    if (score > 70) { level = 'High'; status = 'Phishing'; }

    return { score, level, status, flags };
  };

  const handleScan = (e) => {
    e.preventDefault();
    if(!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const analysis = analyzeThreat(inputValue, inputType);
      const finalResult = {
        id: Date.now(),
        type: inputType,
        input: inputValue,
        date: new Date().toLocaleString('sv-SE').slice(0,16).replace('T', ' '),
        ...analysis
      };
      
      setResult(finalResult);
      onScanComplete(finalResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetScanner = () => {
    setResult(null);
    setInputValue('');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      
      {!result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${inputType === 'url' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setInputType('url')}
            >
              <LinkIcon size={18} /> URL Link
            </button>
            <button 
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${inputType === 'text' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setInputType('text')}
            >
              <FileText size={18} /> Email / SMS Text
            </button>
          </div>

          <form onSubmit={handleScan} className="p-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {inputType === 'url' ? 'Paste Suspicious URL' : 'Paste Email or Message Content'}
            </label>
            
            {inputType === 'url' ? (
              <input 
                type="text" 
                placeholder="e.g., http://login-update-secure-bank.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6"
                disabled={isAnalyzing}
              />
            ) : (
              <textarea 
                rows="5"
                placeholder="e.g., URGENT: Your account will be locked. Click here to update your billing details immediately."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6 resize-none"
                disabled={isAnalyzing}
              />
            )}

            {isAnalyzing ? (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">AI is Analyzing Content...</h3>
                <p className="text-slate-500 text-sm mt-2">Checking heuristics, comparing against threat databases, and running NLP models.</p>
                <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-2 mt-6 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                </div>
              </div>
            ) : (
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 text-lg"
              >
                <Search size={22} /> Analyze Now
              </button>
            )}
          </form>
        </div>
      )}

      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className={`p-6 border-b flex items-center gap-4 ${
              result.level === 'High' ? 'bg-red-50 border-red-200 text-red-800' : 
              result.level === 'Medium' ? 'bg-orange-50 border-orange-200 text-orange-800' : 
              'bg-green-50 border-green-200 text-green-800'
            }`}>
              <div className="p-3 bg-white rounded-full shadow-sm">
                {result.level === 'High' ? <ShieldAlert className="w-8 h-8 text-red-600" /> : 
                 result.level === 'Medium' ? <AlertTriangle className="w-8 h-8 text-orange-500" /> : 
                 <ShieldCheck className="w-8 h-8 text-green-500" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-wide">
                  {result.status}
                </h2>
                <p className="opacity-80 font-medium">Risk Level: {result.level}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-slate-700">Threat Score</span>
                  <span className="text-2xl font-bold text-slate-900">{result.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ease-out ${
                    result.level === 'High' ? 'bg-red-500' : 
                    result.level === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                  }`} style={{ width: `${result.score}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Safe (0-35)</span>
                  <span>Suspicious (36-70)</span>
                  <span>Phishing (71-100)</span>
                </div>
              </div>

              <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Input Analyzed</h4>
                <p className="text-slate-800 break-all">{result.input}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Analysis & Flags</h4>
                {result.flags.length > 0 ? (
                  <ul className="space-y-2">
                    {result.flags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    <ShieldCheck size={20} />
                    <span>No suspicious patterns or signatures detected.</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
               <button 
                onClick={resetScanner}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Search size={18} /> Scan Another
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}

function HistoryView({ history }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Date</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Type</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Input Analysed</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Score</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-500 whitespace-nowrap text-sm">{row.date}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-slate-600 text-sm bg-slate-100 w-max px-2 py-1 rounded-md uppercase font-medium">
                    {row.type === 'url' ? <LinkIcon size={14}/> : <FileText size={14}/>} {row.type}
                  </span>
                </td>
                <td className="p-4 text-slate-800 max-w-xs truncate font-medium" title={row.input}>
                  {row.input}
                </td>
                <td className="p-4 text-slate-700 font-bold">{row.score}</td>
                <td className="p-4">
                  <Badge level={row.level} />
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No scans performed yet. Go to New Scan to test a link.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- UTILITY COMPONENTS ---

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function Badge({ level }) {
  const styles = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-orange-100 text-orange-700 border-orange-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[level]}`}>
      {level} Risk
    </span>
  );
}