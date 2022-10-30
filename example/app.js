/************* Sample app ****************/
function App() {
  const [name, setName] = React.useState('✈️')

  function handleAddName() {
    setName('🛫')
  }

  function clearName() {
    setName('🛬')
  }

  return (
    <div className="container">
      <p>eggplant.js</p>
      <div className="button-wrap">
      <button onClick={handleAddName}>Departure</button>
      <button onClick={clearName}>Arrival</button>
      </div>
      <div className="counter">{name}</div>
    </div>
  )
}

/************* Render into DOM ****************/
const rootNode = document.getElementById('root')
ReactDOM.render(App, rootNode)
