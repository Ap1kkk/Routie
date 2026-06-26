import styles from './Marker.module.scss';
import React from 'react';

interface MarkerProps {
	type: 'default' | 'active' | 'completed';
	animated?: boolean;
}

const MarkerComponent = ({ type, animated = false }: MarkerProps) => (
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

export const Marker = React.memo(MarkerComponent);
Marker.displayName = 'Marker';