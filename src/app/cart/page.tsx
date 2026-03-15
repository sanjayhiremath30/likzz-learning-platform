"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setCart(data);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>Your Cart</h1>

            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                cart.map((item: any) => (
                    <div key={item.id}>
                        <h3>{item.course.title}</h3>
                        <p>Instructor: {item.course.instructor.name}</p>
                    </div>
                ))
            )}
        </div>
    );
}