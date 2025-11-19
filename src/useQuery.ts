import {
  useState,
  useEffect
} from "react"

export type QueryParamsProperties = {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
}

export interface Query <T> {
  data: T | null,
  state: QueryState,
  error: any
}

export type QueryState =
  | "idle"
  | "pending"
  | "success"
  | "error"

export const useQuery = <T> (properties: QueryParamsProperties): Query<T> => {
  const [data, setData] = useState<T | null>(null)
  const [state, setState] = useState<QueryState>("idle")
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (state !== "idle") return

    setState("pending")
    fetch(properties.path, {
      method: properties.method || "GET",
      body: properties.body ? JSON.stringify(properties.body) : null,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(
      (response) => {
        response.json().then((json: any) => {
          setState("success")
          setData(json)
        }, (error) => {
          setState("error")
          setError(error)
        })
      },
      (error) => {
        setState("error")
        setError(error)
      }
    )

    return () => {
      console.log("Cleanup useQuery")
    }
  }, [])

  return {
    data,
    state,
    error
  }
}