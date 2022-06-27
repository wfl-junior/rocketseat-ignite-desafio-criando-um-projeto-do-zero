export async function fetchWrapper<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init);
  const data: T = await response.json();
  return data;
}
