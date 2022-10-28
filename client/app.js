function App() {
  //   const [isPressed, setIsPressed] = React.useState(false)

  function handlePressed() {
    setIsPressed(true)
  }

  return (
    <div className="container">
      <h2>
        When you press it increments the counter to next state in React's store
      </h2>
      <button>Increment</button>
      <span>
        <br />
        <marquee>Counter value</marquee>
        <br />
        <h1>9</h1>
      </span>
    </div>
  )
}

// Print out React
// console.log(window.React);
// console.log(ReactDOM);

/************* Render into DOM ****************/
const rootElement = document.getElementById('root')
ReactDOM.render(App(), rootElement)
