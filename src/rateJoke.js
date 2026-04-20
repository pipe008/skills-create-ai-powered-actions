const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");

// Definimos el esquema de lo que esperamos de la IA
const JokeRatingSchema = z.object({
  is_joke: z.boolean().describe("Whether the input is actually a joke or attempt at humor"),
  score: z.number().min(1).max(10).nullable().describe("Rating from 1-10, where 10 is the funniest."),
  humor_type: z.string().nullable().describe("The type of humor (e.g., pun, wordplay, dad joke, dark, etc)"),
  feedback: z.string().nullable().describe("Short feedback on the joke's strengths and weaknesses."),
});

async function rateJoke(joke, token) {
  const endpoint = "https://models.github.io/inference"; // Actualizado a la URL correcta de GitHub Models
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const completion = await client.chat.completions.parse({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that evaluates jokes. Assess whether the input is actually a joke, and if so, rate its humor quality, creativity, and delivery.",
      },
      {
        role: "user",
        content: `Please rate this joke: "${joke}"`,
      },
    ],
    model: "openai/gpt-4o-mini", // O el modelo que estés usando
    response_format: zodResponseFormat(JokeRatingSchema, "joke_rating"),
  });

  return completion.choices[0]?.message?.parsed;
}

module.exports = { rateJoke };