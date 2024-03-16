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
    return (
      <>
        <p>Verification expired</p>
        <p className="pt-2 text-sm text-muted-foreground">
          If you're using Outlook or your email provider pre-checks links for
          security reasons, this page may show that your verification expired
          even if it was successful.
          <br /> Check your settings page (refresh it if it's already open) to
          see if your verification was successful.
        </p>
      </>
    );
  }

  // removing computing id from any existing users, since latest user is the last to verify it
  await db.user.updateMany({
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
  await db.computingIdVerification.update({
    where: {
      id: verificationRecord.id,
    },
    data: {
      expires: new Date(),
    },
  });
  return <p>Verified!</p>;
}
