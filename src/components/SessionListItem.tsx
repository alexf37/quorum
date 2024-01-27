"use client";
import { SessionListItemDropdown } from "@/components/SessionListItemDropdown";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddQuestionModal } from "@/components/AddQuestionModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { data, isLoading, isSuccess, isError, error } =
    api.sessions.getFreeResponseQuestionsBySessionId.useQuery(
      { sessionId: id },
      {
        enabled: expanded,
      },
    );
  return (
    <li className="flex flex-col rounded-lg border border-border p-4 pb-2">
      <div className="flex items-center justify-between pb-2">
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
            animate={{ height: "0.5rem" }}
            exit={{ height: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <div className="flex flex-col gap-2">
              <div className="h-full rounded-lg border border-border bg-background">
                {isLoading && (
                  <div className="flex h-full flex-col items-center justify-center p-6">
                    <p className="pb-2 text-lg text-muted-foreground">
                      Loading...
                    </p>
                  </div>
                )}
                {isSuccess &&
                  (data.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Index</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Prompt</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((question, idx) => (
                          <TableRow key={question.id}>
                            <TableCell className="font-medium">
                              {idx + 1}
                            </TableCell>
                            <TableCell>FRQ</TableCell>
                            <TableCell>{question.question}</TableCell>
                            <TableCell className="text-right">N/A</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="justify-cente flex h-full flex-col items-center p-6">
                      <p className="pb-2 text-lg text-muted-foreground">
                        No questions yet
                      </p>
                      <AddQuestionModal sessionId={id}>
                        <Button variant="outline">Add a question</Button>
                      </AddQuestionModal>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end gap-2">
                <AddQuestionModal sessionId={id}>
                  <Button variant="outline">Add a question</Button>
                </AddQuestionModal>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button disabled variant="outline">
                        Import questions
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not yet implemented</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "0.5rem" }}
            exit={{ height: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
