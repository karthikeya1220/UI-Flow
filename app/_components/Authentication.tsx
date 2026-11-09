"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/configs/supabaseConfig';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type AuthMode = 'signin' | 'signup' | 'forgot_password';

export default function Authentication({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>('signin');
    const [loading, setLoading] = useState(false);
    
    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Feedback states
    const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);
    const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

    const resetState = () => {
        setEmail('');
        setPassword('');
        setName('');
        setShowPassword(false);
        setSignupSuccessMsg(null);
        setForgotSuccessMsg(null);
        setMode('signin');
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) {
                console.error('Sign-in error:', error);
                toast.error(error.message || 'Invalid email or password.');
                return;
            }

            if (data.session) {
                toast.success('Signed in successfully!');
                setOpen(false);
                resetState();
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            console.error('Sign-in exception:', err);
            toast.error(err?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: { full_name: name.trim() || undefined },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Sign-up error:', error);
                toast.error(error.message || 'Registration failed.');
                return;
            }

            if (data.user && !data.session) {
                // Email confirmation is required
                setSignupSuccessMsg(
                    `Registration successful! A verification link has been sent to ${email.trim()}. Please verify your email before logging in.`
                );
            } else if (data.session) {
                // Auto-confirmed session
                toast.success('Account created and signed in!');
                setOpen(false);
                resetState();
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            console.error('Sign-up exception:', err);
            toast.error(err?.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                console.error('Password reset error:', error);
                toast.error(error.message || 'Unable to send password reset email.');
                return;
            }

            setForgotSuccessMsg(
                `Password reset email sent to ${email.trim()}. Check your inbox for instructions to reset your password.`
            );
        } catch (err: any) {
            console.error('Forgot password exception:', err);
            toast.error(err?.message || 'Failed to request password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetState();
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px] p-6 bg-paper border-hairline shadow-xl rounded-xl">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-ink rounded-md">
                            <Sparkles className="w-4 h-4 text-paper" />
                        </div>
                        <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">UI_FLOW AUTH</span>
                    </div>

                    <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-ink">
                        {mode === 'signin' && 'Sign in to UIFlow'}
                        {mode === 'signup' && 'Create your account'}
                        {mode === 'forgot_password' && 'Reset your password'}
                    </DialogTitle>

                    <DialogDescription className="text-xs text-ink-soft">
                        {mode === 'signin' && 'Enter your credentials to access your private workspace.'}
                        {mode === 'signup' && 'Get started with zero-cost AI wireframe development.'}
                        {mode === 'forgot_password' && 'Enter your registered email to receive a password reset link.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Feedback Success View */}
                {signupSuccessMsg && (
                    <div className="py-6 space-y-4 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-ink">Verification Email Sent</h4>
                            <p className="text-xs text-ink-soft leading-relaxed">{signupSuccessMsg}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSignupSuccessMsg(null);
                                setMode('signin');
                            }}
                            className="font-mono text-xs bg-ink text-paper hover:bg-accent px-4 py-2 rounded-md transition-colors w-full font-medium"
                        >
                            Return to Sign In
                        </button>
                    </div>
                )}

                {forgotSuccessMsg && (
                    <div className="py-6 space-y-4 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-ink">Check Your Email</h4>
                            <p className="text-xs text-ink-soft leading-relaxed">{forgotSuccessMsg}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setForgotSuccessMsg(null);
                                setMode('signin');
                            }}
                            className="font-mono text-xs bg-ink text-paper hover:bg-accent px-4 py-2 rounded-md transition-colors w-full font-medium"
                        >
                            Return to Sign In
                        </button>
                    </div>
                )}

                {/* Normal Form View */}
                {!signupSuccessMsg && !forgotSuccessMsg && (
                    <form 
                        onSubmit={
                            mode === 'signin' 
                                ? handleSignIn 
                                : mode === 'signup' 
                                ? handleSignUp 
                                : handleForgotPassword
                        } 
                        className="space-y-4 pt-3"
                    >
                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="font-mono text-[11px] text-ink-soft uppercase font-semibold">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Developer"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="font-mono text-[11px] text-ink-soft uppercase font-semibold">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@example.com"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink"
                                />
                            </div>
                        </div>

                        {mode !== 'forgot_password' && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="font-mono text-[11px] text-ink-soft uppercase font-semibold">Password</label>
                                    {mode === 'signin' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot_password')}
                                            className="font-mono text-[10px] text-accent hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink font-mono"
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
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 font-mono text-xs bg-ink text-paper hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-md transition-colors font-medium shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {mode === 'signin' && 'Sign In'}
                                            {mode === 'signup' && 'Create Account'}
                                            {mode === 'forgot_password' && 'Send Reset Link'}
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Mode Switcher */}
                        <div className="pt-3 border-t border-hairline text-center text-xs text-ink-soft">
                            {mode === 'signin' && (
                                <p>
                                    Don&apos;t have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        className="font-mono text-accent font-semibold hover:underline"
                                    >
                                        Register free
                                    </button>
                                </p>
                            )}

                            {mode === 'signup' && (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('signin')}
                                        className="font-mono text-accent font-semibold hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}

                            {mode === 'forgot_password' && (
                                <button
                                    type="button"
                                    onClick={() => setMode('signin')}
                                    className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft hover:text-ink"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to Sign In</span>
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
