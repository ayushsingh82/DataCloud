/**
 * AI Service — Calls the Qwen3 model on RunPod for:
 *   1. Generating human-readable insights from query results
 *   2. Translating natural-language questions into structured query parameters
 */

const DEFAULT_MODEL = 'Qwen/Qwen3-VL-8B-Instruct';

function getConfig() {
  const apiUrl = process.env.AI_API_URL;
  if (!apiUrl) {
    throw new Error('AI_API_URL is not set in .env');
  }
  return {
    url: `${apiUrl.replace(/\/+$/, '')}/v1/chat/completions`,
    model: process.env.AI_MODEL || DEFAULT_MODEL,
  };
}

export function isAIConfigured(): boolean {
  return !!process.env.AI_API_URL;
}

// ---------------------------------------------------------------------------
// Low-level chat completion
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function chatCompletion(messages: ChatMessage[], maxTokens = 1024): Promise<string> {
  const { url, model } = getConfig();

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

// ---------------------------------------------------------------------------
// 1. Query Result Insights
// ---------------------------------------------------------------------------

export async function generateInsights(
  queryType: string,
  parameters: Record<string, unknown>,
  result: Record<string, unknown>,
  datasetTitle: string,
): Promise<string> {
  const systemPrompt = `You are a data analyst assistant for DataCloud, a privacy-preserving data marketplace on Filecoin. You interpret query results and provide clear, actionable insights. Be concise (3-5 bullet points). Do not hallucinate numbers — only reference values present in the result data.`;

  const userPrompt = `Dataset: "${datasetTitle}"
Query type: ${queryType}
Parameters: ${JSON.stringify(parameters)}
Results: ${JSON.stringify(result, null, 2)}

Provide a brief analysis of these results. Highlight key findings, notable patterns, and any actionable takeaways.`;

  return chatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    512,
  );
}

// ---------------------------------------------------------------------------
// 2. Natural Language → Structured Query
// ---------------------------------------------------------------------------

interface StructuredQuery {
  queryType: string;
  parameters: Record<string, unknown>;
}

export async function naturalLanguageToQuery(
  question: string,
  datasetColumns: string[],
  allowedQueries: string[],
): Promise<StructuredQuery> {
  const systemPrompt = `You are a query builder for DataCloud. Convert a user's natural-language question into a structured JSON query.

Available query types: ${allowedQueries.join(', ')}
Dataset columns: ${datasetColumns.join(', ')}

Respond with ONLY valid JSON (no markdown, no explanation) in this format:
{
  "queryType": "<one of the allowed types>",
  "parameters": { ... }
}

Parameter formats per query type:
- aggregation: { "function": "SUM|AVG|COUNT|MIN|MAX", "column": "<col>", "groupBy": "<col or null>" }
- ml_training: { "modelType": "logistic_regression|linear_regression|random_forest", "targetVariable": "<col>", "features": ["<col>", ...] }
- analytics: { "metric": "<col>" }
- correlation: { "variables": ["<col>", "<col>", ...] }
- cohort: { "cohortField": "<col>", "period": "weekly|monthly|quarterly" }`;

  const raw = await chatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    256,
  );

  // Strip markdown fences if the model wraps its reply
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned) as StructuredQuery;
  } catch {
    throw new Error(`AI returned invalid JSON: ${cleaned}`);
  }
}
