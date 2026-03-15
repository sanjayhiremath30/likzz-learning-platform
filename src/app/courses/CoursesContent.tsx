"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CoursesContent() {

    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    // rest of your courses code here
}