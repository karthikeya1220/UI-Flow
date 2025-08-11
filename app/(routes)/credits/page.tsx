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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/user?email=' + user?.email);
            console.log(result.data)
            setUserData(result.data);
        } catch (error) {
            console.error('Error fetching user credits:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Loading Header */}
                <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                    <div className="relative max-w-7xl mx-auto px-6 py-8 sm:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-80"></div>
                        </div>
                    </div>
                </div>
                
                {/* Loading Content */}
                <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                Credits & Billing
                            </h1>
                            <p className="text-lg text-gray-600 mt-1">
                                Manage your AI generation credits and upgrade your plan
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8 sm:px-8">
                {/* Current Credits Card */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border border-blue-100/50 p-8 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Current Balance</h2>
                                            <p className="text-gray-600">Available AI generation credits</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {userData?.credits || 0}
                                        </div>
                                        <div className="text-gray-600">
                                            <div className="text-sm font-medium">Credits Remaining</div>
                                            <div className="text-xs">Each credit = 1 AI generation</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Buy More Credits
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50 font-medium px-6 py-3">
                                        View Usage History
                                        <Clock className="w-4 h-4 ml-2" />
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
                                relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl
                                ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100/50' : ''}
                            `}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
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
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                                            : 'bg-gradient-to-r from-gray-100 to-gray-200'
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

                                <Button className={`
                                    w-full py-3 font-semibold transition-all duration-300
                                    ${plan.popular 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                    }
                                `}>
                                    Get {plan.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Usage This Month</h3>
                                <p className="text-sm text-gray-600">Track your AI generation activity</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">0 Credits Used</div>
                        <div className="text-sm text-gray-600 mt-1">0% of available credits</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Gift className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Rewards</h3>
                                <p className="text-sm text-gray-600">Earn bonus credits</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">0 Bonus Credits</div>
                        <div className="text-sm text-gray-600 mt-1">Refer friends to earn more</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits