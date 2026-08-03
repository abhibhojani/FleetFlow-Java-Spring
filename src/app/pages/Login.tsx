import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'manager' | 'dispatcher'>('manager');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('fleet_token', data.token);
      localStorage.setItem('fleet_user', JSON.stringify(data.user));
      localStorage.setItem('fleet_role', role);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access your FleetFlow account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Select Role</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('manager')}
                  className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all ${role === 'manager'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  Fleet Manager
                </button>
                <button
                  type="button"
                  onClick={() => setRole('dispatcher')}
                  className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all ${role === 'dispatcher'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  Dispatcher
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign in to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Visual */}
      <div className="relative hidden w-1/2 bg-slate-900 sm:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/60 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
          alt="Logistics Fleet"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-200 ring-1 ring-inset ring-blue-500/30">
            Enterprise Fleet Solution
          </div>
          <h2 className="mb-4 text-4xl font-bold">Manage your fleet with precision</h2>
          <p className="max-w-md text-lg text-slate-300">
            Real-time tracking, maintenance scheduling, and comprehensive reporting all in one platform.
          </p>
        </div>
      </div>
    </div>
  );
}
