import React, { useEffect, useRef, useState } from 'react';
import { Route } from '../../types/route';
import { YMapLocationRequest } from 'ymaps3';
import ReactDOM from 'react-dom';

const LOCATION: YMapLocationRequest = {
	center: [43.990696, 56.313476],
	zoom: 13,
};

interface RouteOnMapProps {
	route: Route | null;
}

export const MapComponent = ({ route }: RouteOnMapProps) => {
	const mapRef = useRef<any>(null);
	const [isReady, setIsReady] = useState(false);
	const [YMapComponent, setYMapComponent] = useState<any>(null);
	const [
		YMapDefaultSchemeLayerComponent,
		setYMapDefaultSchemeLayerComponent,
	] = useState<any>(null);
	const [YMapDefaultFeaturesLayer, setYMapDefaultFeaturesLayer] =
		useState<any>(null);

	useEffect(() => {
		let mounted = true;
		const initMap = async () => {
			try {
				const [ymaps3React] = await Promise.all([
					ymaps3.import('@yandex/ymaps3-reactify'),
					ymaps3.ready,
				]);

				const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
				const {
					YMap,
					YMapDefaultSchemeLayer,
					YMapDefaultFeaturesLayer,
				} = reactify.module(ymaps3);

				if (mounted) {
					// Сохраняем как any для обхода типов
					setYMapComponent(() => YMap as any);
					setYMapDefaultSchemeLayerComponent(
						() => YMapDefaultSchemeLayer as any
					);
					setYMapDefaultFeaturesLayer(
						() => YMapDefaultFeaturesLayer as any
					);
					setIsReady(true);
				}
			} catch (error) {
				console.error('Failed to load Yandex Maps:', error);
			}
		};

		initMap();

		return () => {
			mounted = false;
		};
	}, []);

	const mapContainerStyle = {
		height: '75vh',
		width: '100%',
		borderRadius: '12px',
		overflow: 'hidden' as const,
	};

	if (!isReady || !YMapComponent || !YMapDefaultSchemeLayerComponent) {
		return (
			<div style={mapContainerStyle}>
				<div
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: '#f0f0f0',
					}}>
					Загрузка карты...
				</div>
			</div>
		);
	}

	return (
		<div style={mapContainerStyle}>
			<YMapComponent
				location={LOCATION}
				showScaleInCopyrights={true}
				lang='ru_RU'
				ref={(x: any) => {
					if (x) mapRef.current = x;
				}}
				style={{
					width: '100%',
					height: '100%',
					borderRadius: '12px',
				}}>
				<YMapDefaultSchemeLayerComponent />
				{YMapDefaultFeaturesLayer && <YMapDefaultFeaturesLayer />}
			</YMapComponent>
		</div>
	);
};
