import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Provider } from 'react-redux';
import { StyleProvider } from '@ant-design/cssinjs';
import { SWRConfig } from 'swr';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import ErrorBoundary from './components/error-boundary';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <Provider store={store}>
        <StyleProvider hashPriority="high">
          <ConfigProvider locale={zhCN}>
            <App />
          </ConfigProvider>
        </StyleProvider>
      </Provider>
    </SWRConfig>
  </React.StrictMode>,
);
reportWebVitals();
