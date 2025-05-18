import { useCallback } from "react"
import axios from "axios"

const fetchRetries = 5
const baseUrl = import.meta.env.PROD ? "https://bark-and-purr.onrender.com" : "http://localhost:3000"

export const useApi = () => {
  /**
   *
   * @param method "GET" (default) | "POST" | "PUT" | "DELETE"
   * @param fullUrl If given, endpoint and query won't be taken into account
   * @param endpoint Endpoint of the api to consume, without "/api/" prefix
   * @param query Query parameters object
   * @param body Optional
   * @param token Optional
   * @returns fetchedData
   */
  const consumeApi = useCallback(
    async ({ method = "GET", fullUrl, endpoint, query, body, token, sendContentType = true }) => {
      let data, error

      // Try n times before sending an error
      for (let n = 0; n <= fetchRetries; n++) {
        try {
          const headers = {
            "Content-Type": sendContentType ? "application/json" : undefined,
            Authorization: token ? `Bearer ${token}` : undefined,
          }
          const queryStr =
            query &&
            Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          const url = fullUrl ? `${baseUrl}${fullUrl}` : `${baseUrl}/api/${endpoint}` + (queryStr ? `?${queryStr}` : "")

          const res = await axios({ method, url, headers, data: body })
          data = res.data

          if (res.status >= 200 && res.status < 300) {
            // Succeeded
            break
          }
        } catch ({ request, response }) {
          error =
            response.data.error ||
            (response && `fetch.${response.status}`) || // Server answered with error code
            (request && "fetch.no_response") || // Couldn't reach server
            "fetch.no_request" // Couldn't set up the request
        }
      }

      return { ...data, error }
    },
    []
  )

  return [consumeApi]
}
