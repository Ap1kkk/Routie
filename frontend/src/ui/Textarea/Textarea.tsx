import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import s from './Textarea.module.scss';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
	label?: string;
	icon?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ error, label, icon, className, id, ...props }, ref) => {
		const generatedId = useId();
		const textareaId = id || generatedId;
		const errorId = `${textareaId}-error`;

		return (
			<div className={s.container}>
				{label && (
					<label htmlFor={textareaId} className={clsx(s.label)}>
						{label}
					</label>
				)}
				<div className={s.wrapper}>
					<textarea
						ref={ref}
						id={textareaId}
						aria-invalid={!!error}
						aria-describedby={error ? errorId : undefined}
						className={clsx(s.textarea, error && s.errorField, icon && s.withIcon, className)}
						{...props}
					/>
					{icon && <div className={s.iconWrapper}>{icon}</div>}
				</div>
				{error && (
					<span id={errorId} className={s.errorMessage}>
						{error}
					</span>
				)}
			</div>
		);
	},
);

Textarea.displayName = 'Textarea';
