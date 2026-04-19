import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Search, History, LayoutDashboard, LogOut, Server, Loader2 } from 'lucide-react';

const API_URL = "https://phishguard-backend-nwnc.onrender.com"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userEmail, setUserEmail] = useState("");
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("userEmail");
    if (saved) { setIsLoggedIn(true); setUserEmail(saved); }
  }, []);

  if (!isLoggedIn) return <LoginScreen onLogin={(email) => { setIsLoggedIn(true); setUserEmail(email); }} />;

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-4">
        <div className="flex items-center gap-3 mb-8 p-2 border-b border-slate-800">
          <Shield className="text-blue-500" /> <span className="font-bold text-xl">PhishGuard</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex p-3 rounded-lg gap-3 ${activeTab === 'dashboard' ? 'bg-blue-600' : ''}`}><LayoutDashboard /> Dashboard</button>
          <button onClick={() => setActiveTab('scan')} className={`w-full flex p-3 rounded-lg gap-3 ${activeTab === 'scan' ? 'bg-blue-600' : ''}`}><Search /> New Scan</button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex p-3 rounded-lg gap-3 ${activeTab === 'history' ? 'bg-blue-600' : ''}`}><History /> History</button>
        </nav>
        <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); }} className="flex gap-3 p-3 text-slate-400 hover:text-white"><LogOut /> Logout</button>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="p-6 bg-white border-b flex justify-between">
          <h1 className="text-2xl font-bold uppercase">{activeTab}</h1>
          <span className="text-green-500 flex items-center gap-2"><Server size={16}/> API Online</span>
        </header>
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardView history={scanHistory} onScan={() => setActiveTab('scan')} />}
          {activeTab === 'scan' && <ScannerView onComplete={(res) => setScanHistory([res, ...scanHistory])} />}
          {activeTab === 'history' && <HistoryView history={scanHistory} />}
        </div>
      </main>
    </div>
  );
}

function ScannerView({ onComplete }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      const final = { id: Date.now(), input: url, date: new Date().toLocaleString(), ...data };
      setResult(final);
      onComplete(final);
    } catch (err) { alert("Error connecting to backend"); }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
      {!result ? (
        <form onSubmit={handleScan} className="space-y-4">
          <h2 className="text-center font-bold text-lg">ENTER URL TO ANALYZE</h2>
          <input type="text" value={url} onChange={(e)=>setUrl(e.target.value)} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="http://example.com" required />
          <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin" /> : "SCAN NOW"}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className={`p-6 rounded-xl font-bold text-2xl flex items-center justify-center gap-3 ${
            result.status === 'Phishing' ? 'bg-red-100 text-red-600' : result.status === 'Suspicious' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
          }`}>
            {result.status === 'Safe' ? <ShieldCheck size={32}/> : <ShieldAlert size={32}/>}
            {result.status.toUpperCase()}
          </div>
          <div className="text-5xl font-black">{result.score}% <span className="text-sm font-normal text-slate-400">Risk Score</span></div>
          {result.flags.length > 0 && (
            <div className="text-left bg-slate-50 p-4 rounded-lg border">
              <p className="font-bold text-slate-700 mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> Risk Factors:</p>
              {result.flags.map((f, i) => <p key={i} className="text-sm text-slate-600">• {f}</p>)}
            </div>
          )}
          <button onClick={()=>setResult(null)} className="text-blue-600 font-bold underline">Scan Another Link</button>
        </div>
      )}
    </div>
  );
}

// Minimal Dashboard and History Views for brevity
function DashboardView({ history, onScan }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border"><h3>Total Scans</h3><p className="text-3xl font-bold">{history.length}</p></div>
        <div className="bg-white p-6 rounded-xl shadow border"><h3>Threats Found</h3><p className="text-3xl font-bold text-red-500">{history.filter(h=>h.status === 'Phishing').length}</p></div>
      </div>
      <button onClick={onScan} className="w-full p-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">NEW SCAN</button>
    </div>
  );
}

function HistoryView({ history }) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 font-bold"><tr><th className="p-4">URL</th><th className="p-4">Status</th><th className="p-4">Score</th></tr></thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id} className="border-t"><td className="p-4 truncate max-w-xs">{h.input}</td><td className={`p-4 font-bold ${h.status === 'Phishing' ? 'text-red-500' : 'text-green-500'}`}>{h.status}</td><td className="p-4 font-bold">{h.score}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoginScreen({ onLogin }) {
    // ... Login logic as provided before ...
    return <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md text-center">
            <Shield className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-6">PhishGuard Access</h2>
            <input id="email" type="email" placeholder="Email" className="w-full p-3 border rounded mb-4 outline-none" />
            <button onClick={() => onLogin(document.getElementById('email').value)} className="w-full bg-blue-600 text-white p-3 rounded font-bold">Login</button>
        </div>
    </div>;
}
