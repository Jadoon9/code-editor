import React, { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutPut] = useState("");
  const ref = useRef<any>();

  const inputChangeHanlder = (e: any) => {
    setInput(e.target.value);
  };

  const getService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
    ref.current = true;
  };

  const formSubmitHandler = async () => {
    if (!ref.current) {
      return;
    }
    console.log(esbuild, "current");
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(input)],
      define: { "process.env.NODE_ENV": '"production"', global: "window" },
    });

    setOutPut(result?.outputFiles[0]?.text);
  };

  useEffect(() => {
    try {
      getService();
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <div className="App">
      <textarea onChange={inputChangeHanlder} value={input} />
      <div>
        <button onClick={formSubmitHandler}>Submit</button>
      </div>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
