import React, { useId } from 'react';
import styles from './Checkbox.module.scss';

import {ReactComponent as CheckboxEmptyIcon} from '../../assets/icons/checkbox-empty.svg';
import {ReactComponent as CheckboxCheckedIcon} from '../../assets/icons/checkbox-done.svg';
import {ReactComponent as CheckboxPartCheckedIcon} from '../../assets/icons/checkbox-remove.svg';

export interface CheckboxProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'type' | 'checked' | 'onChange'
	> {
	checked?: boolean;
	partChecked?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked = false,
	partChecked = false,
	onChange,
	disabled = false,
	label,
	...rest
}) => {
	const id = useId();

	const renderIcon = () => {
		if (checked && partChecked) {
			return <CheckboxPartCheckedIcon className={styles['icon']} />;
		}
		if (checked) {
			return <CheckboxCheckedIcon className={styles['icon']} />;
		}
		return <CheckboxEmptyIcon className={styles['icon']} />;
	};

	return (
		<label htmlFor={id} className={`${styles['container']} ${disabled ? styles['disabled'] : ''}`}>
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				className={styles['hidden-input']}
				{...rest}
			/>
			<span
				className={`${styles['custom-checkbox']} ${
					!checked && !partChecked ? styles['empty'] : ''
				}`}
			>
				{renderIcon()}
			</span>
			{label && <span className={styles['label']}>{label}</span>}
		</label>
	);
};

export default Checkbox;
