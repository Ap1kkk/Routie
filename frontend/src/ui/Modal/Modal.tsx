import React, { useEffect, ReactNode, useCallback } from 'react';
import styles from './Modal.module.scss';

import closeIcon from '@icons/cross.svg';

interface ModalProps {
	isOpen?: boolean;
	onClose?: () => void;
	children?: ReactNode;
	closeOnOverlayClick?: boolean;
	className?: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen = false,
	onClose,
	children,
	closeOnOverlayClick = true,
	className,
}) => {
	const handleOverlayClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (
				closeOnOverlayClick &&
				onClose &&
				e.target === e.currentTarget
			) {
				onClose();
			}
		},
		[closeOnOverlayClick, onClose]
	);

	const handleClose = useCallback(() => {
		if (onClose) {
			onClose();
		}
	}, [onClose]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && onClose) {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onMouseDown={handleOverlayClick}>
			<div
				className={`${styles.modal} ${className ?? ''}`}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className={styles.closeButton}
					onClick={handleClose}
					aria-label='Закрыть'>
					<img src={closeIcon} alt='Закрыть' />
				</button>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};

Modal.displayName = 'Modal';
