const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const JokeRatingSchema = z.object({
  is_joke: z.boolean().describe("Whether the input is actually a joke"),
  score: z.number().min(1).max(10).nullable(),
  humor_type: z.string().nullable(),
  feedback: z.string().nullable(),
});

async function rateJoke(joke, token) {
  const endpoint = "https://models.github.ai/inference";
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const completion = await client.chat.completions.parse({
    messages: [
      { role: "system", content: "You evaluate jokes." },
      { role: "user", content: `Please rate this joke: "${joke}"` },
    ],
    model: "openai/gpt-4.1-mini",
    response_format: zodResponseFormat(JokeRatingSchema, "joke_rating"),
  });

  return completion.choices[0]?.message?.parsed;
}
module.exports = { rateJoke };