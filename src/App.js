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
      alert("Connection Error. Please check if backend is running.");
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
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isSignUp ? "Sign Up" : "Login")}
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
        status: data.status || 'Safe',
        flags: data.flags || []
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
          <h3 className="
