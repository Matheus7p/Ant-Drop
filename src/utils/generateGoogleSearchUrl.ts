export function generateGoogleSearchUrl(searchTerm: string): string {
  const baseUrl = "https://www.google.com/search"
  const query = encodeURIComponent(searchTerm)

  return `${baseUrl}?tbm=shop&q=${query}`
}