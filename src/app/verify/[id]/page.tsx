import { db } from "@/server/db";

type VerifyPageParams = {
  id: string;
};

export default async function VerifyWithId({
  params,
}: {
  params: VerifyPageParams;
}) {
  // fetch verification record
  const verificationRecord = await db.computingIdVerification.findFirst({
    where: {
      id: params.id,
    },
  });
  // if somehow verification record doesn't exist, say so
  if (!verificationRecord) {
    return <p>Verification request not found</p>;
  }
  // if verification record is expired, say so
  if (verificationRecord.expires < new Date()) {
    return <p>Verification expired</p>;
  }

  // removing computing id from any existing users, since latest user is the last to verify it
  const existingUserWithComputingId = await db.user.updateMany({
    where: {
      computingId: verificationRecord.computingId,
    },
    data: {
      computingId: null,
    },
  });

  // now verified, so add computing id to user
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

  // expire verification record that we just used
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
