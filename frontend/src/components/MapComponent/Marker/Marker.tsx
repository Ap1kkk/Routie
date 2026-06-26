import styles from './Marker.module.scss';

interface MarkerProps {
	type: 'default' | 'active' | 'completed';
	animated?: boolean;
}

export const Marker = ({ type, animated = false }: MarkerProps) => (
	<div>
		<div
			className={`
        ${styles.pin}
        ${styles[type]}
        ${type === 'active' ? styles.bounce : ''}
    `}
		/>

		{type === 'active' && <div className={styles.pulse}></div>}
	</div>
);
