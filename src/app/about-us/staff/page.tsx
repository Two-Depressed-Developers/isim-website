import { Suspense } from "react";
import StaffContent from "./staff-content";

export default function StaffPage() {
  return (
    <Suspense fallback={<div>Loading staff data...</div>}>
      <StaffContent />
    </Suspense>
  )
}