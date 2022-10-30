require('../lib/eggplant.development.js')

const createElement = window.React.createElement
const ELEMENT_TYPE_TEXT = window.React.__internal__.ELEMENT_TYPE_TEXT
const createElementText = window.React.__internal__.createElementText
const render = window.ReactDOM.render

describe('createElement', () => {
  let consoleErrorSpy;
  
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

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
    expect(consoleErrorSpy).toHaveBeenCalled();
  })

  test('should throw when null as type is passed', () => {
    createElement(null, null)
    expect(consoleErrorSpy).toHaveBeenCalled();
  })

  test('should throw when number as type is passed', () => {
    createElement(1, null)
    expect(consoleErrorSpy).toHaveBeenCalled();
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
  let rootContainer

  beforeEach(() => {
    // setup document body
    document.body.innerHTML = '<div id="root"></div>'
    rootContainer = document.getElementById('root')
  })

  afterEach(() => {
    // reset document body
    document.body.innerHTML = ''
  })

  test('renders a text element', () => {
    const element = createElementText('Hello World')
    render(element, rootContainer)

    expect(document.body.innerHTML).toBe('<div id="root">Hello World</div>')
  })

  test('renders a div element with property', () => {
    const element = createElement('div', { className: 'container' })
    render(element, rootContainer)

    expect(document.body.innerHTML).toBe(
      '<div id="root"><div class="container"></div></div>'
    )
  })

  test('renders a div element with property and a child div element', () => {
    const childElement = createElement('div', { className: 'child' })
    const element = createElement(
      'div',
      { className: 'container' },
      childElement
    )
    render(element, rootContainer)

    expect(document.body.innerHTML).toBe(
      '<div id="root"><div class="container"><div class="child"></div></div></div>'
    )
  })

  test('throw error when invalid element is supplied as container', () => {
    const element = createElement('h1', null)
    const invalidContainer = document.createElement('h1')

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(element, invalidContainer)

    expect(consoleErrorSpy).toHaveBeenCalled();
  })

  test('render a div with onclick property', () => {
    const element = createElement('div', { onClick: jest.fn() })
    render(element, rootContainer)

    // because onClick is not a valid element property something which should be handled by library
    expect(document.body.innerHTML).toBe('<div id="root"><div></div></div>')
  })
})
