# eggplant-js
*A use in production and get fired implementation of React.*


## Features
1. Implements the following React APIs:
   - `React.createElement`
   - `React.useState`
   - `ReactDOM.render`
1. Reconciler rendering of only effected nodes.
1. Size **2.3 kB**
1. Virtual DOM diffing.
1. Updates the DOM only when the virtual DOM changes.
1. Incremental updates of the DOM.
1. For developer tools, it exposes the "hooks" via `window.ReactDevTools`.


## Limitations
1. Supports only functional components.
1. Support for using only one "useState" hook.
1. Maximum tree depth of 3.


## Usage
- Clone this repository.

    ```bash
    git clone https://github.com/M-ZubairAhmed/eggplant-js.git
    ```
- Copy the production build file `lib/eggplant.production.min.js` to your project directory.
- Include the file in your HTML file.

    ```html
    <script src="path/to/eggplant.production.min.js"></script>
    ```

## Development
- Clone this repository.

    ```bash
    git clone https://github.com/M-ZubairAhmed/eggplant-js.git
    ```
- Install dependencies.

    ```bash
    npm install
    ```
- Run the development server.

    ```bash
    npm start dev
    ```
- Open `http://localhost:3232` in your browser to run the example server using eggplant-js.
- Run the tests.

    ```bash
    npm run test
    ```
- Build the production build.

    ```bash
    npm run build
    ```

## References
- https://github.com/facebook/react/tree/main/packages/react
- https://github.com/facebook/react/tree/main/packages/react-dom
- https://overreacted.io/
- https://github.com/hyperhype/hyperscript
- https://developer.chrome.com/blog/using-requestidlecallback
- https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05
- https://reactjs.org/docs/reconciliation.html
- https://aibolik.com/blog/create-your-own-virtual-dom-to-understand-it-part-1
