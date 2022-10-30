require('../lib/eggplant.development.js')

const createElement = window.React.createElement
const useState = window.React.useState
const render = window.ReactDOM.render

const ELEMENT_TYPE_TEXT = window.__internal__.ELEMENT_TYPE_TEXT
const createElementText = window.__internal__.createElementText
const addToQue = window.__internal__.addToQue
const paintDom = window.__internal__.paintDom

let consoleErrorSpy

describe('createElement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('creates an object with a type, props and children', () => {
    expect(createElement('h1', null)).toEqual({
      type: 'h1',
      props: {
        children: []
      }
    })

    expect(createElement('p', { id: 'text', className: 'paragraph' })).toEqual({
      type: 'p',
      props: {
        id: 'text',
        className: 'paragraph',
        children: []
      }
    })

    expect(createElement('h2', null, 'Hello World')).toEqual({
      type: 'h2',
      props: {
        children: [
          {
            type: ELEMENT_TYPE_TEXT,
            props: {
              nodeValue: 'Hello World',
              children: []
            }
          }
        ]
      }
    })

    expect(createElement(jest.fn(), null)).toEqual({
      type: expect.any(Function),
      props: {
        children: []
      }
    })
  })

  test('should throw when undefined as type is passed', () => {
    createElement(undefined, null)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('should throw when null as type is passed', () => {
    createElement(null, null)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('should throw when number as type is passed', () => {
    createElement(1, null)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})

describe('createElementText', () => {
  test('create an object with text type', () => {
    expect(createElementText('Hello World')).toEqual({
      type: ELEMENT_TYPE_TEXT,
      props: {
        nodeValue: 'Hello World',
        children: []
      }
    })
  })
})

describe('render', () => {
  test('throw error when element is undefined', () => {
    const container = document.createElement('h1')

    render(undefined, container)

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('throw error when container is undefined', () => {
    const element = createElement('div', { className: 'child' })

    render(element, undefined)

    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})

describe('paintDom', () => {
  let rootContainer

  beforeEach(() => {
    // setup document body
    document.body.innerHTML = '<div id="root"></div>'
    rootContainer = document.getElementById('root')

    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // reset document body
    document.body.innerHTML = ''
  })

  test('renders a text element', () => {
    const element = createElementText('Hello World')
    paintDom(element, rootContainer)

    expect(document.body.innerHTML).toBe('<div id="root">Hello World</div>')
  })

  test('renders a div element with property', () => {
    const element = createElement('div', { className: 'container' })
    paintDom(element, rootContainer)

    expect(document.body.innerHTML).toBe(
      '<div id="root"><div class="container"></div></div>'
    )
  })
})

describe('addToQue', () => {
  test('should add to que if its empty', () => {
    const que = []
    const item = 'a'

    expect(addToQue(item, que).que).toEqual(['a'])
  })

  test('should add to que if its of length 1', () => {
    const que = ['a']
    const item = 'b'

    expect(addToQue(item, que).que).toEqual(['a', 'b'])
  })

  test('should not add to que if it has element already', () => {
    const que = ['a']
    const item = 'a'

    expect(addToQue(item, que).que).toEqual(['a'])
  })

  test('should add to que if element is unique', () => {
    const que = ['a', 'b']
    const item = 'c'

    expect(addToQue(item, que).que).toEqual(['b', 'c'])
  })
})

describe('useState', () => {
  test('should return null when no initial value is passed', () => {
    jest.clearAllMocks();
    expect(useState()).toEqual([null, expect.any(Function)])
  })

  test('should return initial value and set state function', () => {
    expect(useState('a')).toEqual(['a', expect.any(Function)])
  })

  test('should update the state to new value', () => {
    const [state, setState] = useState('a')
    setState('b')
    expect(setState('b')).toBe('b')
  })

})
