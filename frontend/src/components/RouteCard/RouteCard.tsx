import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Blur, Tag } from '@ui';
import { Tags } from '../../types/Tags';

import { ReactComponent as Like } from '../../assets/icons/like.svg';
import { ReactComponent as LikeActive } from '../../assets/icons/like-green.svg';

import styles from './RouteCard.module.scss';
import { Route } from '../../types/Route';

interface RouteCardProps {
	route: Route;
	imageUrl?: string;
	isLiked?: boolean;
	tags?: Tags[];
	onToggleLike?: (id: string) => void;
	variant?: 'standard' | 'compact';
}

export const RouteCard: React.FC<RouteCardProps> = ({
	route,
	imageUrl,
	isLiked = false,
	tags = [],
	onToggleLike,
	variant = 'standard',
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [localLiked, setLocalLiked] = useState(isLiked);
	const navigate = useNavigate();

	useEffect(() => {
		setLocalLiked(isLiked);
	}, [isLiked]);

	const formatDistance = (distance: number) => {
		if (distance >= 1000) {
			return `${(distance / 1000).toFixed(1)} км`;
		}
		return `${distance} м`;
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 400);

		const newLikedState = !localLiked;
		setLocalLiked(newLikedState);

		if (onToggleLike) {
			onToggleLike(route.id);
		}
	};

	const getTagsToShow = (): Tags[] => {
		if (tags && tags.length > 0) {
			return tags;
		}

		if (route.tags && route.tags.length > 0) {
			return route.tags;
		}

		return [];
	};

	if (variant === 'compact') {
		return (
			<Blur
				className={styles.compactCard}
				onClick={() => navigate(`/map/${route.id}`)}>
				<img
					src={imageUrl}
					alt={route.title}
					className={styles.imageContainerCompact}
					loading='lazy'
				/>
				<span className={styles.compactRouteName}>{route.title}</span>
			</Blur>
		);
	}

	if (variant === 'standard') {
		return (
			<Blur
				className={styles.standartCard}
				onClick={() => navigate(`/map/${route.id}`)}>
				<img
					src={imageUrl}
					alt={route.title}
					className={styles.standartImage}
					loading="lazy"
				/>

				<div className={styles.standartContent}>
					<h3 className={styles.standartCardTitle}>{route.title}</h3>

					<div className={styles.routeInfo}>
						<span className={styles.standartDistance}>
							{formatDistance(route.lengthMeters)}
						</span>
					</div>

					{route.tags && route.tags.length > 0 && (
						<div className={styles.compactTags}>
							<Tag
								items={route.tags.map(tag => tag.title)}
								variant="small"
								wrap={false}
							/>
						</div>
					)}

					{onToggleLike && (
						<button
							className={`${styles.standartLike} ${
								localLiked ? styles.liked : ''
							} ${isAnimating ? styles.animating : ''}`}
							onClick={handleLikeClick}
							aria-label="Добавить в избранное"
							type="button">
							{localLiked ? <LikeActive /> : <Like />}
						</button>
					)}
				</div>
			</Blur>
		);
	}

	return null;
};
