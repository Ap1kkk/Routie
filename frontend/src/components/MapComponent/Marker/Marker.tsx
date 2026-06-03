import styles from './Marker.module.scss'

interface MarkerProps {
	type: 'start' | 'finish';
}

export const Marker = ({ type }: MarkerProps) => (
	<div className={styles.marker}>
		<div
			className={`${styles.markerCircle} ${
				type === 'start' ? styles.markerStart : styles.markerFinish
			}`}>
			{type === 'start' ? '🚩' : '🏁'}
		</div>

		<div
			className={`${styles.markerArrow} ${
				type === 'start'
					? styles.markerArrowStart
					: styles.markerArrowFinish
			}`}
		/>
	</div>
);
