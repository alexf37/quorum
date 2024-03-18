"use client";
import { api } from "@/trpc/react";
import { useEffect } from "react";

type VerifyPageParams = {
  id: string;
};

export default function VerifyWithId({ params }: { params: VerifyPageParams }) {
  const verificationMutation = api.settings.verifyComputingId.useMutation();

  useEffect(() => {
    verificationMutation.mutate({ id: params.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (verificationMutation.isLoading) {
    return <p>Loading...</p>;
  }
  if (verificationMutation.error) {
    return <p>Error: {verificationMutation.error.message}</p>;
  }
  if (verificationMutation.isSuccess) {
    return <p>{verificationMutation.data.message}</p>;
  }
  return <p>Loading...</p>;
}
