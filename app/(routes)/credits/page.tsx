"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    CreditCard,
    Sparkles,
    Zap,
    TrendingUp,
    Star,
    Gift,
    Clock,
    CheckCircle,
    ArrowRight,
    Coins
} from 'lucide-react'

function Credits() {

    const { user } = useAuthContext();
    const [userData, setUserData] = useState<any>();
    const [usageCount, setUsageCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && GetData();
    }, [user])

    const GetData = async () => {
        setLoading(true);
        try {
            const [userResult, designsResult] = await Promise.all([
                axios.get('/api/user?email=' + user?.email),
                axios.get('/api/wireframe-to-code?email=' + user?.email)
            ]);
            setUserData(userResult.data?.data);
            setUsageCount(designsResult.data?.count || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-paper">
                <div className="border-b border-hairline bg-paper">
                    <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-hairline w-48 mb-4"></div>
                            <div className="h-4 bg-hairline w-80"></div>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="bg-card border border-hairline p-8">
                            <div className="h-6 bg-hairline w-32 mb-4"></div>
                            <div className="h-16 bg-hairline"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const credits = userData?.credits || 0;
    const totalGenerations = credits + usageCount; // remaining + used

    const creditPlans = [
        {
            name: "Starter Pack",
            credits: 10,
            price: "$9.99",
            popular: false,
            features: ["10 AI generations", "Basic support", "Standard processing"],
            savings: null
        },
        {
            name: "Pro Pack",
            credits: 50,
            price: "$39.99",
            popular: true,
            features: ["50 AI generations", "Priority support", "Fast processing", "Advanced models"],
            savings: "Save 20%"
        },
        {
            name: "Enterprise Pack",
            credits: 200,
            price: "$129.99",
            popular: false,
            features: ["200 AI generations", "Premium support", "Fastest processing", "All models", "Custom templates"],
            savings: "Save 35%"
        }
    ];

    return (
        <div className="min-h-screen bg-paper">
            {/* Header */}
            <div className="border-b border-hairline bg-paper">
                <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-ink rounded-md">
                            <Coins className="w-6 h-6 text-paper" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                                Credits
                            </h1>
                            <p className="text-lg text-ink-soft mt-1">
                                Manage your AI generation credits
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8 sm:px-8">
                {/* Current Credits Card */}
                <div className="mb-8">
                    <div className="bg-card border border-hairline rounded-md p-8 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-4 right-4 w-32 h-32 bg-accent rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-accent rounded-full"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-accent rounded-md">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Current Balance</h2>
                                            <p className="text-gray-600">Available AI generation credits</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="font-display text-5xl font-semibold text-ink">
                                            {credits}
                                        </div>
                                        <div className="text-gray-600">
                                            <div className="text-sm font-medium">Credits Remaining</div>
                                            <div className="text-xs">Each credit = 1 AI generation</div>
                                        </div>
                                    </div>
                                </div>

                                {/* ponytail: Stripe checkout disabled — add when billing is needed */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="gradient" disabled className="opacity-60 cursor-not-allowed">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Buy More Credits
                                </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Plans */}
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                        <p className="text-gray-600 text-lg">Select the perfect credit package for your needs</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {creditPlans.map((plan, index) => (
                            <div key={index} className={`
                                relative bg-card rounded-md border border-hairline p-8 transition-all duration-200
                                ${plan.popular ? 'border-accent' : ''}
                            `}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <div className="bg-accent text-white px-4 py-1 rounded-full font-mono text-xs font-medium flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                {plan.savings && (
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {plan.savings}
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`
                                        w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4
                                        ${plan.popular
                                            ? 'bg-accent'
                                            : 'bg-paper-deep'
                                        }
                                    `}>
                                        <Zap className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-3xl font-black text-gray-900 mb-1">{plan.price}</div>
                                    <div className="text-gray-600 text-sm">{plan.credits} Credits</div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-600 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* ponytail: no-op buttons until Stripe is wired */}
                                <Button disabled className="w-full py-3 font-semibold opacity-60 cursor-not-allowed">
                                    Coming Soon
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-hairline rounded-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-paper-deep rounded-md">
                                <TrendingUp className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Total Generations</h3>
                                <p className="text-sm text-gray-600">Wireframes converted to code</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{usageCount} Used</div>
                        <div className="text-sm text-gray-600 mt-1">{credits} credits remaining</div>
                    </div>

                    <div className="bg-card border border-hairline rounded-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-paper-deep rounded-md">
                                <Gift className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Free Credits</h3>
                                <p className="text-sm text-gray-600">Included with your account</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">3 per user</div>
                        <div className="text-sm text-gray-600 mt-1">Given on signup</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits
