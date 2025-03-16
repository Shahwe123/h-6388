
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

import './index.css'

/**
 * Main entry point of the application
 * Renders the App component to the DOM, wrapped in Redux Provider
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <App />
    </Provider>
);
