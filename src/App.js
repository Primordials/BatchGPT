import logo from "./logo.svg";
import "./App.css";
import TextAreaDemo from "./TextAreaDemo";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <div class="text-white text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-2">Batch-GPT</div>
        {/* <header className="bg-blue-500 text-white text-xl p-5">Batch-GPT</header> */}
        <TextAreaDemo />

        <p class="mt-10 text-center text-sm text-gray-500">
          written by{" "}
          <a
            href="https://github.com/Primordials"
            target="_blank"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            James Ly
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
