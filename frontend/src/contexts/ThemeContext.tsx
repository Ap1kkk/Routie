import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextType {
	isLight: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLight, setIsLight] = useState(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'light';
	});

	useEffect(() => {
		if (isLight) {
			document.body.classList.remove('dark-theme');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.classList.add('dark-theme');
			localStorage.setItem('theme', 'dark');
		}
	}, [isLight]);

	const toggleTheme = () => setIsLight((prev) => !prev);

	return (
		<ThemeContext.Provider value={{ isLight, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
