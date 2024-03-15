import { env } from "@/env";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const analysisSchema = z.object({
  summary: z.string(),
  misconception: z.string(),
});

type Analysis = z.infer<typeof analysisSchema>;

export async function analyzeAnswers(
  question: string,
  answers: string[],
): Promise<Analysis> {
  let attemptCount = 1;
  while (attemptCount < 4) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a teacher. You will be provided with a list of answers from students in a Discrete Math and Logic class. You will summarize them in no more than 80 words for the professor and give the most common misconception to be addressed in class. If you think there isn't a misconception, think harder. Output JSON with fields `summary` and `misconception`. Do not relist the answers given, ONLY summarize. This is the question: \n" +
              question,
          },
          {
            role: "user",
            content:
              "Here are the answers students provided: \n" +
              answers.join(",\n"),
          },
        ],
        temperature: 0.1,
        max_tokens: 200,
        top_p: 1,
      });

      if (!response.choices[0]) continue;

      const rawAnalysis = JSON.parse(
        response.choices[0].message.content ?? "{}",
      ) as unknown;
      const analysis = analysisSchema.parse(rawAnalysis);

      return analysis;
    } catch (e) {
      attemptCount++;
    }
  }
  throw new Error("Improper JSON generated.");
}
