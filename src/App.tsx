import { useEffect } from "react"
import { useQuery } from "./useQuery"

import "./styles.css"

const App = () => {
  const query = useQuery({
    path: "https://pokeapi.co/api/v2/pokemon/ditto",
    method: "GET"
  })

  useEffect(() => {
    console.log(query)
  }, [query])

  return (
    <div className="container">
      <header>
        <h1>React Loading Card</h1>
        <h1>??</h1>
      </header>
      <div className="content">
        {/* <Cards /> */}
      </div>
    </div>
  )
}

export default App
