import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'tertiary' | 'blur';
	isLoading?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	iconLeft,
	iconRight,
	className,
	disabled = false,
	type = 'button',
	'aria-label': ariaLabel,
	...props
}) => {
	const hasChildren = !!children;
	const isIconOnly = !hasChildren && (!!iconLeft || !!iconRight);

	const buttonClasses = clsx(
		styles.button,
		styles[variant],
		isIconOnly && styles['icon-only'],
		className
	);

	if (isIconOnly && !ariaLabel) {
		console.warn(
			'Button with icon only should have an aria-label for accessibility'
		);
	}

	return (
		<button
			type={type}
			className={buttonClasses}
			disabled={disabled}
			aria-label={ariaLabel}
			{...props}>
			{iconLeft && (
				<span className={styles['icon-left']}>{iconLeft}</span>
			)}
			{children && <span className={styles.text}>{children}</span>}
			{iconRight && (
				<span className={styles['icon-right']}>{iconRight}</span>
			)}
		</button>
	);
};

export default Button;
