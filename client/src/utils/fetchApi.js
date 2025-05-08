import axios from "axios"

const baseUrl = "http://localhost:3000"

/**
 *
 * @param method "GET" (default) | "POST" | "PUT" | "DELETE"
 * @param endpoint Endpoint of the api to consume, without "/api/" prefix
 * @param query Query parameters object
 * @param body Optional
 * @param token Optional
 * @returns fetchedData
 */
export const fetchApi = async ({ method = "GET", endpoint, query, body, token }) => {
  try {
    const headers = token && { Authorization: `Bearer ${token}` }
    const queryStr =
      query &&
      Object.keys(query)
        .map(({ key, value }) => `${key}=${value}`)
        .join("&")
    const url = `${baseUrl}/api/${endpoint}` + (queryStr ? `?${queryStr}` : "")
    const { data } = await axios({ method, url, headers, body })
    return data
  } catch (error) {
    console.error("Error fetching data:", error.message)
  }
}
