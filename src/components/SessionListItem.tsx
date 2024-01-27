"use client";
import { SessionListItemDropdown } from "@/components/SessionListItemDropdown";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SessionListItemProps = {
  id: string;
  title: string;
  date?: string;
};

export function SessionListItem({
  id,
  title,
  date = "Undated",
}: SessionListItemProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.li className="flex flex-col rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <div>
            <h3 className="text-md font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Close" : "View"}
          </Button>
          <Button variant="secondary">Edit</Button>
          <SessionListItemDropdown sessionId={id}>
            <MoreVertical className="size-5 text-muted-foreground" />
          </SessionListItemDropdown>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <div className="mt-4 h-full rounded-lg bg-muted p-4">
              <p>Expanded</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
