import { useEffect, useState } from "react"
import "./App.scss"
// import * as bootstrap from 'bootstrap'

function App() {
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    async function get() {
      const req = await fetch("http://localhost:8000/api/test?a=3&b=5");
      const json = await req.json();
      const result: number | null = json["result"];
      setResult(result);
    }

    if (!result)
      get();
  }, []);

  return (
    <>
      <main>
        <div className="container py-4 px-3 mx-auto">
          <h1>Hello, Bootstrap and Vite!</h1>
          <button className="btn btn-primary">Primary button</button>
          <div>{result ?? "test API call failed"}</div>
        </div>
      </main>
    </>
  )
}

export default App
