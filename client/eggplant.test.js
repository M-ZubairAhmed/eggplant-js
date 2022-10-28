const {
  createElement,
  createElementText,
  TEXT_ELEMENT,
  render
} = require('./eggplant')

describe('createElement', () => {
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
            type: TEXT_ELEMENT,
            props: {
              nodeValue: 'Hello World',
              children: []
            }
          }
        ]
      }
    })
  })
})

describe('createElementText', () => {
  test('create an object with text type', () => {
    expect(createElementText('Hello World')).toEqual({
      type: TEXT_ELEMENT,
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
    const childElement = createElement('h5', { className: 'child' })
    const element = createElement(
      'div',
      { className: 'container' },
      childElement
    )
    render(element, rootContainer)

    expect(document.body.innerHTML).toBe(
      '<div id="root"><div class="container"><h5 class="child"></h5></div></div>'
    )
  })

  test('render a div with onclick property', () => {
    const element = createElement('div', {onClick: jest.fn()})
    render(element, rootContainer)

    // because onClick is not a valid element property something which should be handled by library
    expect(document.body.innerHTML).toBe(
        '<div id="root"><div></div></div>'
    )
  })
})
