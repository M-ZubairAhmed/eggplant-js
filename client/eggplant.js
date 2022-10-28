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
 */
function createElement(type, props, ...children) {
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

  return {
    type,
    props: {
      ...props,
      children: passedChildren
    }
  }
}

const TEXT_ELEMENT = 'TEXT_ELEMENT'

/**
 * Create a text only createElement
 * @param {string} nodeValue eg: 'Hello World'
 */
function createElementText(nodeValue) {
  return createElement(TEXT_ELEMENT, { nodeValue })
}

/****************************
 * 
 * React DOM implementation
 * 
 ***************************/

/**
 * Override of ReactDom.render(element, container)
 * @param {{type: string, props: object}} element a JSX element after transpiling
 * see return type of React.createElement
 * @param {HTMLElement} container a DOM element
 */
function render(element, container) {
    console.log('element', element)
  let domNode
  if (element.type === TEXT_ELEMENT) {
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
    element.props.children.forEach(child => {
        // we follow the process of calling render again on each child node
        render(child, domNode)
    })
  }

  container.appendChild(domNode)
}

// NOTE : Uncomment to replace window React and ReactDOM
// window.React = {
//     createElement,
//     useState: (args) => [args] // Change
// }
// window.ReactDOM = {
//     render,
// }

// NOTE: Comment out when running app, only used in testing
module.exports = {
  createElement,
  createElementText,
  TEXT_ELEMENT,
  render
}
