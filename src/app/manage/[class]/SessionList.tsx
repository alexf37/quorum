"use client";

import { SessionListItemDropdown } from "@/components/SessionListItemDropdown";
import { MoreVertical, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Session = {
  id: string;
  title: string;
  date?: string;
};

type SessionListItemProps = {
  session: Session;
};

function SessionListItem({ session }: SessionListItemProps) {
  const [draggable, setDraggable] = useState(false);
  return (
    <Reorder.Item
      value={session}
      dragListener={draggable}
      onDragEnd={() => setDraggable(false)}
      className="flex items-center justify-between rounded-lg border border-border p-4"
    >
      <div className="flex items-center gap-4">
        <GripVertical
          className="size-5 cursor-move text-secondary"
          onMouseEnter={() => setDraggable(true)}
          onMouseLeave={() => setDraggable(false)} // retain this for better animation
          onTouchStart={() => setDraggable(true)} // for mobile: need to set draggable to `false` in `onDragEnd` prop, not `onTouchEnd`
        />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <div>
          <h3 className="text-md font-medium">{session.title}</h3>
          <p className="text-xs text-muted-foreground">
            {session.date ?? "Undated"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">View</Button>
        <Button variant="secondary">Edit</Button>
        <SessionListItemDropdown sessionId={session.id}>
          <MoreVertical className="size-5 text-muted-foreground" />
        </SessionListItemDropdown>
      </div>
    </Reorder.Item>
  );
}

type SessionListProps = {
  sessions: Session[];
};
export function SessionList({ sessions }: SessionListProps) {
  const [values, setValues] = useState(sessions);
  return (
    <Reorder.Group
      values={values}
      onReorder={setValues}
      className="flex flex-col gap-2"
    >
      {values.map((session) => (
        <SessionListItem key={session.id} session={session} />
      ))}
    </Reorder.Group>
  );
}
