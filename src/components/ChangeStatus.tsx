// import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/auth/useAuth";

interface ChangeStatusProps {
   issue_id: string;
   current_status: Status;
   author_id: string;
   onStatusChange: (newStatus: Status) => void;
}

export type Status = "open" | "in_progress" | "resolved" | "closed";

function ChangeStatus({
   issue_id,
   current_status,
   author_id,
   onStatusChange,
}: ChangeStatusProps) {
   const { user } = useAuth();

   // this array has info on the color of the status (also makes it easier to map it later)
   // on const to enforce statuses as a readonly value
   const statuses = [
      { value: "open", label: "Open", color: "bg-green-600" },
      { value: "in_progress", label: "In Progress", color: "bg-yellow-600" },
      { value: "resolved", label: "Resolved", color: "bg-blue-600" },
      { value: "closed", label: "Closed", color: "bg-gray-600" },
   ] as const;

   // saves if the user is logged in or not (and if they're the author)
   const canChangeStatus = user && user.id === author_id ? true : false;

   const handleStatusChange = async (statusChange: Status) => {
      if (!canChangeStatus) return;

      try {
         // updates issue status
         const { error: fetchError } = await supabase
            .from("issues")
            .update({
               status: statusChange,
               updated_at: new Date().toISOString(),
            })
            .eq("id", issue_id);

         if (fetchError) throw fetchError;

         onStatusChange(statusChange);
      } catch (error) {
         console.error("Error occurred changing status:", error);
      }
   };

   // returns regular span if can't change status
   if (!canChangeStatus) {
      const status = statuses.find((s) => s.value === current_status);
      return (
         <span
            className={`px-2 py-0.5 text-xs font-medium rounded ${status?.color} text-white field-sizing-content`}
         >
            {status?.label.toUpperCase()}
         </span>
      );
   }

   return (
      <select
         value={current_status}
         onChange={(e) => {
            e.stopPropagation();
            handleStatusChange(e.target.value as Status);
         }}
         onClick={(e) => e.stopPropagation()}
         // disabled={isUpdating}
         className={`px-2 py-0.5 text-xs font-medium rounded ${
            statuses.find((s) => s.value === current_status)?.color
         } text-white hover:opacity-80 transition-opacity disabled:opacity-50 field-sizing-content cursor-pointer`}
      >
         {statuses.map((status) => (
            <option value={status.value} className={"bg-gray-100 text-black"}>
               {status.label.toUpperCase()}
            </option>
         ))}
      </select>
   );
}

export default ChangeStatus;
