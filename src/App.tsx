import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import useInit from './hooks/use-init';
import browserRouter from './router';

const App: React.FC = () => {
  useInit();
  return <RouterProvider router={browserRouter}></RouterProvider>;
};

export default App;
