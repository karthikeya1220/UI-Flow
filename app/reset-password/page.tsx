"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/configs/supabaseConfig';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                console.error('Password reset error:', error);
                toast.error(error.message || 'Failed to update password');
            } else {
                setIsSuccess(true);
                toast.success('Password updated successfully');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            }
        } catch (error: any) {
            console.error('Unexpected error resetting password:', error);
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-6 selection:bg-accent selection:text-white">
            <div className="w-full max-w-md bg-card border border-hairline p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-ink rounded-md">
                        <Image src="/logo.svg" alt="UI Flow logo" width={22} height={22} className="brightness-0 invert" />
                    </div>
                    <div>
                        <span className="font-mono text-sm font-bold tracking-tight">UI_FLOW</span>
                        <p className="text-[10px] font-mono text-ink-soft uppercase">Password Recovery</p>
                    </div>
                </div>

                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink mb-2">
                    Set a New Password
                </h1>
                <p className="text-xs text-ink-soft mb-6 leading-relaxed">
                    Choose a secure password of at least 6 characters for your UIFlow workspace.
                </p>

                {isSuccess ? (
                    <div className="py-8 space-y-4 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-base text-ink">Password Updated!</h3>
                            <p className="text-xs text-ink-soft">Redirecting to your dashboard in a moment...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="font-mono text-[11px] text-ink-soft uppercase font-semibold">New Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-mono text-[11px] text-ink-soft uppercase font-semibold">Confirm Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 font-mono text-xs bg-ink text-paper hover:bg-accent disabled:opacity-50 py-3 rounded-md transition-colors font-medium shadow-sm mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                <>
                                    <span>Save & Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
