import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import type { YMapLocationRequest } from '@yandex/ymaps3-types';
import styles from './MapComponent.module.scss';

export const LOCATION: YMapLocationRequest = {
	center: [43.990696, 56.313476],
	zoom: 13,
};

export const COMMON_LOCATION_PARAMS: any = {
	easing: 'ease-in-out',
	duration: 2000,
	zoom: 16,
};

interface RouteOnMapProps {
	route?: any;
}

export const MapComponent = ({ route }: RouteOnMapProps = {}) => {
	const mapRef = useRef<any>(null);
	const [components, setComponents] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		const initMap = async () => {
			try {
				ymaps3.import.registerCdn(
					'https://cdn.jsdelivr.net/npm/{package}',
					'@yandex/ymaps3-default-ui-theme@0.0.24'
				);

				const [ymaps3React] = await Promise.all([
					ymaps3.import('@yandex/ymaps3-reactify'),
					ymaps3.ready,
				]);

				const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

				const mainComponents = reactify.module(ymaps3);

				const uiTheme = await ymaps3.import(
					'@yandex/ymaps3-default-ui-theme'
				);
				const uiComponents = reactify.module(uiTheme);

				if (mounted) {
					setComponents({
						...mainComponents,
						...uiComponents,
					});
				}
			} catch (error) {
				console.error('Ошибка загрузки карты:', error);
			}
		};

		initMap();

		return () => {
			mounted = false;
		};
	}, []);

	if (!components) {
		return (
			<div className={styles.mapContainer}>
				<div className={styles.loading}>Загрузка карты...</div>
			</div>
		);
	}

	const YMap = components.YMap;
	const YMapDefaultSchemeLayer = components.YMapDefaultSchemeLayer;
	const YMapDefaultFeaturesLayer = components.YMapDefaultFeaturesLayer;
	const YMapControls = components.YMapControls;
	const YMapGeolocationControl = components.YMapGeolocationControl;
	const YMapDefaultMarker = components.YMapDefaultMarker;

	return (
		<div className={styles.mapContainer}>
			<div className={styles.map}>
				<YMap
					location={LOCATION}
					showScaleInCopyrights={true}
					lang='ru_RU'
					ref={(x: any) => {
						if (x) mapRef.current = x;
					}}>
					<YMapDefaultSchemeLayer />
					<YMapDefaultFeaturesLayer />

					<YMapControls position='right'>
						<YMapGeolocationControl {...COMMON_LOCATION_PARAMS} />
					</YMapControls>

					{route?.checkpoints &&
						route.checkpoints.map(
							(checkpoint: any, index: number) => (
								<YMapDefaultMarker
									key={checkpoint.id || index}
									coordinates={[
										checkpoint.longitude,
										checkpoint.latitude,
									]}
									color='lavender'
									iconName='fallback'
									size='small'
									title={checkpoint.name}
								/>
							)
						)}
				</YMap>
			</div>
		</div>
	);
};
