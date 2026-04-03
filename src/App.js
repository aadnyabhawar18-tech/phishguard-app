import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Shield, AlertTriangle, 
  Link as LinkIcon, FileText, LayoutDashboard, 
  History, LogOut, Activity, Search, Server, User, Loader2,
  Database, Cpu, Globe, Code
} from 'lucide-react';

const API_URL = "https://phishguard-backend-nwnc.onrender.com"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userEmail, setUserEmail] = useState("");
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(email) => {
      setIsLoggedIn(true);
      setUserEmail(email);
    }} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Shield className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-wider">PhishGuard</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Search size={20} />} label="New Scan" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
          <NavItem icon={<History size={20} />} label="Scan History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">User</div>
            <div className="text-sm truncate">
              <p className="font-medium truncate">{userEmail}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Security Dashboard'}
            {activeTab === 'scan' && 'AI Phishing Scanner'}
            {activeTab === 'history' && 'Scan History'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Server size={16} className="text-blue-500" /> API: Active</span>
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

// --- SUB-COMPONENTS (INHE HATA NA NAHI) ---

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      {icon} <span className="font-medium">{label}</span>
    </button>
  );
}

function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isSignUp ? "/api/signup" : "/api/login";
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userEmail", email);
        onLogin(email);
      } else {
        alert(data.message || "Error occurred");
      }
    } catch (error) {
      alert("Server is starting up... Please try again in 30 seconds.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{isSignUp ? "Join PhishGuard" : "Welcome Back"}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-600">
          {isSignUp ? "Have an account?" : "New here?"} 
          <button onClick={()=>setIsSignUp(!isSignUp)} className="text-blue-600 ml-1 font-bold underline">
            {isSignUp ? "Login" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
}

function ScannerView({ onScanComplete }) {
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if(!inputValue.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputValue }),
      });
      const data = await response.json();
      const finalResult = {
        id: Date.now(),
        input: inputValue,
        date: new Date().toLocaleString(),
        score: data.score || 0,
        status: data.prediction === 1 ? 'Phishing' : 'Safe'
      };
      setResult(finalResult);
      onScanComplete(finalResult);
    } catch (error) {
      alert("Scan failed. Backend is warming up.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
      {!result ? (
        <form onSubmit={handleScan}>
          <h3 className="text-lg font-bold mb-4 text-slate-800 text-center">AI URL Scanner</h3>
          <input type="text" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} placeholder="Enter URL to scan..." className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all">
            {isAnalyzing ? "Analyzing URL..." : "Check Security"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className={`p-4 rounded-xl mb-4 font-bold text-xl ${result.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {result.status.toUpperCase()}
          </div>
          <p className="mb-6">Threat Score: {result.score}/100</p>
          <button onClick={()=>setResult(null)} className="text-blue-600 font-bold underline">Scan Another</button>
        </div>
      )}
    </div>
  );
}

function DashboardView({ history, onNewScan }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Scans</p>
          <p className="text-3xl font-bold">{history.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Threats Detected</p>
          <p className="text-3xl font-bold text-red-600">{history.filter(s => s.status === 'Phishing').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Safety Rating</p>
          <p className="text-3xl font-bold text-green-600">Secure</p>
        </div>
      </div>
      <button onClick={onNewScan} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Start New Scan</button>
    </div>
  );
}

function HistoryView({ history }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-4 font-bold text-sm">URL</th>
            <th className="p-4 font-bold text-sm">Status</th>
            <th className="p-4 font-bold text-sm">Date</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr><td colSpan="3" className="p-8 text-center text-slate-400">No scans yet.</td></tr>
          ) : history.map(item => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="p-4 text-sm truncate max-w-xs">{item.input}</td>
              <td className={`p-4 text-sm font-bold ${item.status === 'Safe' ? 'text-green-600' : 'text-red-600'}`}>{item.status}</td>
              <td className="p-4 text-sm text-slate-500">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
