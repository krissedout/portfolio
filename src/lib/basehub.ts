const BASEHUB_GRAPHQL_URL = "https://api.basehub.com/graphql";

type GraphQLError = {
  message?: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export async function basehubQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = import.meta.env.VITE_BASEHUB_TOKEN;

  if (!token) {
    throw new Error("Missing VITE_BASEHUB_TOKEN");
  }

  const response = await fetch(BASEHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-basehub-token": token,
      "x-basehub-api-version": "4",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message ?? "BaseHub request failed");
  }

  if (!payload.data) {
    throw new Error("BaseHub returned no data");
  }

  return payload.data;
}
