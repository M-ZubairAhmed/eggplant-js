function App() {
  const [counterValue, setCounterValue] = React.useState(0)

  function handlePressed() {
    setCounterValue(counterValue + 1)
  }

  return (
    <div className="container">
      <h2>
        When you press it increments the counter to next state in React's store
      </h2>
      <button onClick={handlePressed}>Increment</button>
      <span>
        <br />
        <marquee>Counter value</marquee>
        <br />
        <h1>{counterValue}</h1>
      </span>
    </div>
  )
}

// Print out React library
// console.log(window.React);
// console.log(ReactDOM);

/************* Render into DOM ****************/
const rootNode = document.getElementById('root')
const element = <App />
ReactDOM.render(element, rootNode)
