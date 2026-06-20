import styles from './Marker.module.scss'

interface MarkerProps {
	type: 'active' | 'start' | 'finish';
	animated?: boolean;
}

export const Marker = ({ type, animated = false }: MarkerProps) => (
	<div>
		<div
			className={`
                ${styles.pin}
                ${animated ? styles.bounce : ''}
            `}
		/>

		{animated && <div className={styles.pulse}></div>}
	</div>
);
