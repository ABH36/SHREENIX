'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) router.push('/admin/dashboard');
      else setError('Invalid credentials');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-emerald-400" />

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
            <ShieldCheck size={36}/>
          </div>
          <h1 className="text-2xl font-serif font-bold mt-4">Admin Portal</h1>
          <p className="text-xs text-gray-400">Secure Access Only</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {['username','password'].map((field,i)=>(
            <div key={i} className="relative">
              {field==='username'
                ? <User className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                : <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>}
              <input
                type={field==='password'?'password':'text'}
                placeholder={field}
                value={(form as any)[field]}
                onChange={e=>setForm({...form,[field]:e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
          ))}

          <button disabled={loading} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl font-bold flex justify-center gap-2">
            {loading ? <Loader2 className="animate-spin"/> : 'Login to Dashboard'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">Restricted Area</p>
      </div>
    </div>
  );
}
