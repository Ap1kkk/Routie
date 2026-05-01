import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';
import { RouterProvider } from 'react-router-dom';

import store from '@store';
import { router } from './App';

import './index.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<RouterProvider router={router}></RouterProvider>
			</ThemeProvider>
		</Provider>
	</StrictMode>
);
