import React, { ReactNode, TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
	label?: string;
	icon?: ReactNode;
	inputPadding?: string;
	className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
	error,
	label,
	icon,
	inputPadding = '14px 16px',
	className,
	id,
	...props
}) => {
	const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

	return (
		<div className={`${styles.wrapper} ${className}`}>
			{label && (
				<label htmlFor={textareaId} className={styles.label}>
					{label}
				</label>
			)}

			<div
				className={`${styles['textarea-wrapper']} ${
					error ? styles.error : ''
				}`}
				style={inputPadding ? { padding: inputPadding } : undefined}>
				<textarea
					id={textareaId}
					aria-invalid={!!error}
					aria-describedby={error}
					className={clsx(
						styles.textarea,
						error && styles.errorField,
						icon && styles.withIcon,
						className
					)}
					{...props}
				/>
				{icon && <div className={styles.iconWrapper}>{icon}</div>}
			</div>

			{error && (
				<div className={styles['message-container']}>
					{error && <p className={styles.errorText}>{error}</p>}
				</div>
			)}
		</div>
	);
};

Textarea.displayName = 'Textarea';
