import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@ui';
import { Route } from '../../types/route';
import { Tags } from '../../types/tags';

import { ReactComponent as Like } from '../../assets/icons/like.svg';
import { ReactComponent as LikeActive } from '../../assets/icons/like-green.svg';

import styles from './RouteCard.module.scss';

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

	const displayTags = getTagsToShow();

	if (variant === 'compact') {
		return (
			<Link className={styles.compactCard} to={`/map/${route.id}`}>
				<img
					src={imageUrl}
					alt={route.name}
					className={styles.compactRouteImage}
					loading='lazy'
				/>
				<span className={styles.compactRouteName}>{route.name}</span>
			</Link>
		);
	}

	if (variant === 'standard') {
		return (
			<Link className={styles.standartCard} to={`/map/${route.id}`}>
				<img
					src={imageUrl}
					alt={route.name}
					className={styles.standartImage}
					loading='lazy'
				/>
				<div className={styles.standartContent}>
					<h3 className={styles.standartCardTitle}>{route.name}</h3>
					<span className={styles.standartDistance}>
						{formatDistance(route.distance)}
					</span>
					{displayTags.length > 0 && (
						<div className={styles.compactTags}>
							<Tag
								items={displayTags}
								variant='small'
								wrap={false}
							/>
						</div>
					)}
				</div>
				{onToggleLike && (
					<button
						className={`${styles.standartLike} ${
							localLiked ? styles.liked : ''
						} ${isAnimating ? styles.animating : ''}`}
						onClick={handleLikeClick}
						aria-label='Добавить в избранное'
						type='button'>
						{localLiked ? <LikeActive /> : <Like />}
					</button>
				)}
			</Link>
		);
	}

	return null;
};
