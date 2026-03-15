"use client";

import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen text-xl">
                    Loading Checkout...
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}