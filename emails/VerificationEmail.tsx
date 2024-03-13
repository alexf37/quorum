import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Html as EmailHtml } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface VerificationEmailProps {
  verificationLink: string;
}

export function VerificationEmail({
  verificationLink,
}: VerificationEmailProps) {
  return (
    <EmailHtml>
      <Head />
      <Preview>Verify your Computing ID with Quorum</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://quorum.alexfoster.dev/favicon.svg`}
                width="40"
                height="37"
                alt="Quorum"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Verify your Computing ID</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Please verify your Computing ID with Quorum by clicking the button
              below
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={verificationLink}
              >
                Verify my Computing ID
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={verificationLink}
                className="text-blue-600 no-underline"
              >
                {verificationLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this email, you can ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </EmailHtml>
  );
}
