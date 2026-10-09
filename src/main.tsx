import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from './Analytics';
import { Scene } from './Scene';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Scene />
    <Analytics />
  </React.StrictMode>
);
