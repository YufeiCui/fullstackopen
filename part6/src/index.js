import { configureStore } from '@reduxjs/toolkit';
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import App from "./App";
import filterReducer from "./reducer/filterReducer";
import noteReducer from './reducer/noteReducer';

const store = configureStore({
  reduce: {
    notes: noteReducer,
    filter: filterReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)