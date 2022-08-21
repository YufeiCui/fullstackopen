import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import noteReducer from './reducer/noteReducer'
import App from "./App";

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)