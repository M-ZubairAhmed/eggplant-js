const ELEMENT_TYPE_TEXT = 'TEXT_ELEMENT'

let component = null
let currentVirtualDom = null

let hookIndex = 0
let hooks = new Map() // Map[{hookIndexA: hookValueA}, {hookIndexB: hookValueB}]
let hooksQueue = [] // [[hook1ValueA, hook1ValueB], [hook2ValueA]]

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

/**
 * Create a text only createElement
 * @param {string} nodeValue eg: 'Hello World'
 */
function createElementText(nodeValue) {
  return createElement(ELEMENT_TYPE_TEXT, { nodeValue })
}

function reconcileVirtualDoms(
  prevVirtualDom,
  nextVirtualDom,
  container,
  state
) {
  let iterators = []
  if (prevVirtualDom.type === nextVirtualDom.type) {
    iterators.push(0)

    if (
      prevVirtualDom.props.children.length ===
      nextVirtualDom.props.children.length
    ) {
      for (
        let childIterator = 0;
        childIterator < prevVirtualDom.props.children.length;
        childIterator++
      ) {
        if (
          JSON.stringify(prevVirtualDom.props.children[childIterator]) !==
          JSON.stringify(nextVirtualDom.props.children[childIterator])
        ) {
          iterators.push(childIterator)
        }
      }
    }
  }

  requestIdleCallback(() => {
    let iteratorChain = container
    if (iterators.length > 0) {
      iterators.forEach((iterator) => {
        iteratorChain = iteratorChain.children[iterator]
      })

      iteratorChain.textContent = state
    }
  })
}

function updateState(hookIndex, newState) {
  const { que, shouldUpdate } = addToQue(newState, hooksQueue[hookIndex])
  hooksQueue[hookIndex] = [...que]

  if (shouldUpdate) {
    hooks.set(hookIndex, newState)

    // start the reconciliation process and update the dom
    if (!component) {
      console.error(
        'updateState : ',
        'hooks dispatch function called outside of component'
      )
      return
    }

    const updatedDom = component()
    const container = document.getElementById('root')
    reconcileVirtualDoms(currentVirtualDom, updatedDom, container, newState)
  }
}

function registerHook(initialState = null, hookIndex) {
  if (!hooks.has(hookIndex)) {
    hooks.set(hookIndex, initialState)

    // Add initial value to the queue
    if (initialState !== null) {
      hooksQueue[hookIndex] = [initialState]
    }
  }

  return hookIndex
}

/**
 * Override of React.useState(initialState)
 * @param {unknown} initialState
 */
function useState(initialState = null) {
  // register on first mount
  registerHook(initialState, hookIndex)

  const hookValue = hooks?.get?.(hookIndex) ?? initialState

  function setState(newState) {
    updateState(hookIndex, newState)
    return newState
  }

  return [hookValue, setState]
}

function paintDom(element, container) {
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
      if (propKey.startsWith('on')) {
        const eventListenerName = propKey.toLowerCase().substring(2)
        domNode.addEventListener(eventListenerName, element.props[propKey])
      } else {
        domNode[propKey] = element.props[propKey]
      }
    }
  })

  const hasChildren = propsKeys.includes('children')
  if (hasChildren) {
    element.props.children.forEach((child) => {
      requestIdleCallback(
        () => {
          // calling again on each child node
          paintDom(child, domNode)
        },
        { timeout: 1000 }
      )
    })
  }

  container.appendChild(domNode)
}

/**
 * Override of ReactDom.render(element, container)
 * @param {{type: string, props: object}} element a JSX element after transpiling
 * see return type of React.createElement
 * @param {HTMLElement} container a DOM element
 * @url https://github.com/facebook/react/blob/bdd3d0807c6e9f417909bab93ffe9795128b04d8/packages/react-dom/src/client/ReactDOMLegacy.js#L318
 */
function render(element, passedInContainer) {
  if (!passedInContainer || !element) {
    console.error('React.render', 'container or element is missing for render')
    return
  }

  component = element
  currentVirtualDom = element()

  paintDom(currentVirtualDom, passedInContainer)
}

function addToQue(item, que = []) {
  let newQue = [...que]

  if (que.length === 0) {
    newQue.push(item)
    return { que: newQue, shouldUpdate: true }
  }

  if (que.length === 1) {
    if (que[0] === item) {
      return { que: newQue, shouldUpdate: false }
    }
    newQue.push(item)
    return { que: newQue, shouldUpdate: true }
  }

  if (que.length === 2) {
    if (que[1] === item) {
      return { que: newQue, shouldUpdate: false }
    }

    newQue.push(item)
    newQue.shift()
    return { que: newQue, shouldUpdate: true }
  }

  return []
}

window.React = {
  createElement,
  useState
}

window.ReactDOM = {
  render
}

window.ReactDevTools = {
  hooks
}

window.__internal__ = {
  ELEMENT_TYPE_TEXT,
  createElementText,
  addToQue,
  paintDom
}
