import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Shield, AlertTriangle, 
  Link as LinkIcon, FileText, LayoutDashboard, 
  History, LogOut, Activity, Search, Server, User, Loader2,
  Database, Cpu, Globe, Code
} from 'lucide-react';

// --- APNA RENDER URL YAHAN DALO ---
const API_URL = "https://phishguard-backend.onrender.com"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userEmail, setUserEmail] = useState("");
  const [scanHistory, setScanHistory] = useState([]);

  // Login check on load
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
      {/* Sidebar */}
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
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="text-sm truncate">
              <p className="font-medium">Active User</p>
              <p className="text-slate-400 text-xs truncate">{userEmail}</p>
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
            <span className="flex items-center gap-1"><Server size={16} className="text-blue-500" /> API: Online</span>
            <span className="flex items-center gap-1"><Database size={16} className="text-green-500" /> DB: Connected</span>
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

// --- LOGIN & SIGNUP LOGIC ---
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
        alert(data.message || "Auth Error");
      }
    } catch (error) {
      alert("Server error! Please check if Render Backend is Live.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">PhishGuard AI</h1>
          <p className="text-blue-100">{isSignUp ? "Create new account" : "Sign in to your account"}</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required placeholder="name@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-6">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Account' : 'Login to Dashboard')}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 hover:underline">
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCANNER LOGIC (ASLI API SE) ---
function ScannerView({ onScanComplete }) {
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if(!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputValue }),
      });

      const data = await response.json();
      
      const finalResult = {
        id: Date.now(),
        type: 'url',
        input: inputValue,
        date: new Date().toLocaleString(),
        score: data.score,
        level: data.score > 70 ? 'High' : data.score > 35 ? 'Medium' : 'Low',
        status: data.prediction === 1 ? 'Phishing' : 'Safe',
        flags: data.flags || []
      };
      
      setResult(finalResult);
      onScanComplete(finalResult);
    } catch (error) {
      alert("AI Scan failed! Check if Backend is live.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!result ? (
        <form onSubmit={handleScan} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2 font-bold">Paste Suspicious URL</label>
          <input type="text" placeholder="http://suspicious-link.com" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500" disabled={isAnalyzing} />
          <button type="submit" disabled={isAnalyzing || !inputValue.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2">
            {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analyze with AI"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
           <div className={`p-6 border-b flex items-center gap-4 ${result.level === 'High' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              <h2 className="text-2xl font-bold uppercase">{result.status}</h2>
           </div>
           <div className="p-8">
              <p className="text-lg mb-4">Threat Score: <strong>{result.score}/100</strong></p>
              <button onClick={() => setResult(null)} className="bg-slate-900 text-white px-6 py-2 rounded-lg">Scan Another</button>
           </div>
        </div>
      )}
    </div>
  );
}

// ... (Baki purane Utility Components jaise NavItem, DashboardView, HistoryView, StatCard, Badge wahi rakhein) ...
// (Inhe aap apne purane code se niche copy-paste kar sakte hain)
