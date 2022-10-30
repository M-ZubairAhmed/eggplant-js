/****************************
 *
 * React implementation
 *
 ***************************/

/**
 * Override of React.createElement(elementType, propsObject, children)
 * @param {string} type eg: 'h2', 'div'
 * @param {object} props eg: {className: 'container'}
 * @param  {string|number|object} children eg: 'HelloWorld', Another react element
 * @url https://github.com/facebook/react/blob/9cdf8a99edcfd94d7420835ea663edca04237527/packages/react/src/ReactElement.js#L362
 */
function createElement(type, props, ...children) {
  if (!type) {
    console.error("element's type is missing for createElement")
    return
  }

  if (typeof type !== 'string' && typeof type !== 'function') {
    console.error(
      "element's type is invalid for createElement, can be either string or function"
    )
    return
  }

  if (typeof type === 'function') {
    createVDomForVisualizing(type)
  }

  return {
    type,
    props: {
      ...props,
      children: getPassedInChildren(children)
    }
  }
}

function getPassedInChildren(children) {
  let passedChildren = []

  if (children.length > 0) {
    children.forEach((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        passedChildren.push(createElementText(child))
      } else {
        passedChildren.push(child)
      }
    })
  }

  return passedChildren
}

function createVDomForVisualizing(componentFunction) {
  const component = componentFunction()
  console.log('Virtual DOM : ', component)
}

const ELEMENT_TYPE_TEXT = 'TEXT_ELEMENT'

/**
 * Create a text only createElement
 * @param {string} nodeValue eg: 'Hello World'
 */
function createElementText(nodeValue) {
  return createElement(ELEMENT_TYPE_TEXT, { nodeValue })
}

function useState(initialState) {}

/****************************
 *
 * React DOM implementation
 *
 ***************************/

const VALID_CONTAINER_TAGS = ['div', 'button', 'p', ELEMENT_TYPE_TEXT]

/**
 * Override of ReactDom.render(element, container)
 * @param {{type: string, props: object}} element a JSX element after transpiling
 * see return type of React.createElement
 * @param {HTMLElement} container a DOM element
 * @url https://github.com/facebook/react/blob/bdd3d0807c6e9f417909bab93ffe9795128b04d8/packages/react-dom/src/client/ReactDOMLegacy.js#L318
 */
function render(element, container) {
  // if (!VALID_CONTAINER_TAGS.includes(element.type)) {
  //   console.error(
  //     '%s is an invalid element in the component\'s render, supported types are',
  //     element.type,
  //     VALID_CONTAINER_TAGS
  //   )
  //   return
  // }

  let domNode
  if (element.type === ELEMENT_TYPE_TEXT) {
    // we will add the text in the next step
    domNode = document.createTextNode('')
  } else {
    domNode = document.createElement(element.type)
  }

  // add props except children to the dom element
  const propsKeys = Object.keys(element.props)

  propsKeys.forEach((propKey) => {
    if (propKey !== 'children') {
      domNode[propKey] = element.props[propKey]
    }
  })

  const hasChildren = propsKeys.includes('children')
  if (hasChildren) {
    element.props.children.forEach((child) => {
      // we follow the process of calling render again on each child node
      render(child, domNode)
    })
  }

  container.appendChild(domNode)
}

window.React = {
  createElement,
  useState: (args) => [args], // Change,
  __internal__ : {
    createElementText,
    ELEMENT_TYPE_TEXT,
  }
}
window.ReactDOM = {
  render
}
