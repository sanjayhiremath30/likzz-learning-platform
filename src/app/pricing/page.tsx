"use client";

import { useRouter } from "next/navigation";

export default function PricingPage() {
    const router = useRouter();

    const plans = [
        { name: "Basic", price: 9, planId: "basic" },
        { name: "Pro", price: 19, planId: "pro" },
        { name: "Premium", price: 29, planId: "premium" }
    ];

    const subscribe = (planId: string) => {
        router.push(`/checkout?plan=${planId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Pricing Plans</h1>
                <p className="text-gray-500 mt-2">
                    Choose the best plan for your learning journey
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">

                {plans.map((plan) => (
                    <div
                        key={plan.planId}
                        className="bg-white rounded-xl shadow-md p-8 text-center border"
                    >
                        <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>

                        <p className="text-3xl font-bold">
                            ${plan.price}
                            <span className="text-sm text-gray-500"> / month</span>
                        </p>

                        <button
                            onClick={() => subscribe(plan.planId)}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Subscribe
                        </button>

                    </div>
                ))}

            </div>

        </div>
    );
}