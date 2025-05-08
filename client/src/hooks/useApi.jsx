import { useCallback } from "react"
import axios from "axios"

const fetchRetries = 5
const baseUrl = "http://localhost:3000"

const fetchApi = async ({ method, fullUrl, endpoint, query, body, token }) => {
  try {
    const headers = token && { Authorization: `Bearer ${token}` }
    const queryStr =
      query &&
      Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&")
    const url = fullUrl ? `${baseUrl}${fullUrl}` : `${baseUrl}/api/${endpoint}` + (queryStr ? `?${queryStr}` : "")

    const { data } = await axios({ method, url, headers, body })
    return data
  } catch (error) {
    console.error("Error fetching data:", error.message)
  }
}

export const useApi = () => {
  /**
   *
   * @param method "GET" (default) | "POST" | "PUT" | "DELETE"
   * @param fullUrl If given, endpoint and query won't be taken into account
   * @param endpoint Endpoint of the api to consume, without "/api/" prefix
   * @param query Query parameters object
   * @param body Optional
   * @param token Optional
   * @param error Optional, message to return if failed to fetch
   * @returns fetchedData
   */
  const consumeApi = useCallback(
    async ({ method = "GET", fullUrl, endpoint, query, body, token, error = "Error Fetching" }) => {
      console.log("Consuming API", { method, fullUrl, endpoint, query, body, token, error })
      for (let retry = 0; retry <= fetchRetries; retry++) {
        const data = await fetchApi({ method, fullUrl, endpoint, query, body, token })
        return data
      }
      // Max retries attempts reached
      return { error }
    },
    []
  )
  return [consumeApi]
}
