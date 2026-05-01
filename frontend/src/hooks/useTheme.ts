import { useState, useEffect } from 'react';

export const useTheme = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'light' ? 'light' : 'dark';
	});

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	useEffect(() => {
		if (theme === 'light') {
			document.body.classList.remove('dark-theme');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.classList.add('dark-theme');
			localStorage.setItem('theme', 'dark');
		}
	}, [theme]);

	return { theme, toggleTheme, isLight: theme === 'light' };
};
