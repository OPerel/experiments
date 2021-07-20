// Fact's types
export interface FactInterface {
  id: string,
  text: string,
  source: string,
  source_url: string,
  language: string,
  permalink: string
}

interface FactLoading {
  status: 'loading';
}
interface FactLoaded<T> {
  status: 'loaded';
  payload: T;
}
interface FactError {
  status: 'error';
  error: Error;
}
export type FactService<T> =
  | FactLoading
  | FactLoaded<T>
  | FactError;