import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending an email
        setSubmitted(true);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            {/* Centered Form */}
            <div className="flex w-full flex-col justify-center px-8 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <Link to="/login" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Reset Password
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                            <h3 className="text-lg font-medium text-green-800 mb-2">Check your email</h3>
                            <p className="text-sm text-green-600 mb-6">
                                We've sent a password reset link to {email}.
                            </p>
                            <Button type="button" onClick={() => navigate('/login')} className="w-full bg-slate-900 hover:bg-slate-800">
                                Return to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Send Reset Link
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Need more help?{' '}
                        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
