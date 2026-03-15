import { Suspense } from "react";
import CoursesContent from "./CoursesContent";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading courses...</div>}>
            <CoursesContent />
        </Suspense>
    );
}