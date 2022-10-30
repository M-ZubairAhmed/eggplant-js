/************* Sample app ****************/
function App() {
  const [counterValue, setCounterValue] = React.useState(0)

  function handlePressed() {
    setCounterValue(counterValue + 1)
  }

  return (
    <div className="container">
      <p>eggplant.js</p>
      <button onClick={handlePressed}>Increment</button>
      <div className="counter">{counterValue}</div>
    </div>
  )
}

// Print out library
// console.log(window.React);
// console.log(ReactDOM);

/************* Render into DOM ****************/
const rootNode = document.getElementById('root')
ReactDOM.render(App, rootNode)
