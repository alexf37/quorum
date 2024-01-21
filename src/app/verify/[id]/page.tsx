import { db } from "@/server/db";

type VerifyPageParams = {
  id: string;
};

export default async function VerifyWithId({
  params,
}: {
  params: VerifyPageParams;
}) {
  const verificationRecord = await db.computingIdVerification.findFirst({
    where: {
      id: params.id,
    },
  });
  if (!verificationRecord) {
    return <p>Verification request not found</p>;
  }
  if (verificationRecord.expires < new Date()) {
    return <p>Verification expired</p>;
  }

  // removing computing id from any existing users, since latest user is the last to verify it
  const existingUserWithComputingId = await db.user.updateMany({
    data: {
      computingId: null,
    },
    where: {
      computingId: verificationRecord.computingId,
    },
  });

  const userWithComputingId = await db.user.update({
    where: {
      id: verificationRecord.userId,
    },
    data: {
      computingId: verificationRecord.computingId,
    },
  });
  if (!userWithComputingId) {
    return <p>User not found</p>;
  }

  const verificationRecordExpired = await db.computingIdVerification.update({
    where: {
      id: verificationRecord.id,
    },
    data: {
      expires: new Date(),
    },
  });
  return <p>Verified!</p>;
}
