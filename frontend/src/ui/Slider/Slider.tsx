import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './Slider.module.scss';
import { ReactComponent as ChevronLeftIcon } from '../../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-right.svg';
import { Blur } from '../Blur';

interface SliderProps {
	cards: React.ReactNode[];
	gap?: number;
	infinite?: boolean;
	showArrows?: boolean;
	showDots?: boolean;
	className?: string;
	onCardClick?: (index: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
	cards,
	gap = 24,
	infinite = false,
	showArrows = true,
	showDots = true,
	className = '',
	onCardClick,
}) => {
	const swiperInstance = useRef<any>(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	return (
		<div className={`${styles.sliderOuter} ${className}`}>
			{showArrows && (
				<Blur className={`${styles.arrowBlur} ${styles.arrowLeft}`}>
					<ChevronLeftIcon
						className={styles.arrow}
						onClick={() => swiperInstance.current?.slidePrev()}
					/>
				</Blur>
			)}

			<div className={styles.sliderContainer}>
				<Swiper
					onSwiper={(swiper) => {
						swiperInstance.current = swiper;
						setIsBeginning(swiper.isBeginning);
						setIsEnd(swiper.isEnd);
					}}
					onSlideChange={(swiper) => {
						setIsBeginning(swiper.isBeginning);
						setIsEnd(swiper.isEnd);
					}}
					modules={[Navigation, Pagination, Mousewheel, A11y]}
					spaceBetween={gap}
					slidesPerView='auto'
					loop={infinite}
					pagination={
						showDots
							? {
									clickable: true,
									dynamicBullets: true,
							  }
							: false
					}
					mousewheel={{ enabled: true, sensitivity: 1 }}
					grabCursor={true}
					className={styles.swiper}>
					{cards.map((card, index) => (
						<SwiperSlide
							key={index}
							className={styles.slide}
							onClick={() => onCardClick?.(index)}>
							{card}
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{showArrows && (
				<Blur className={`${styles.arrowBlur} ${styles.arrowRight}`}>
					<ChevronRightIcon
						className={styles.arrow}
						onClick={() => swiperInstance.current?.slideNext()}
					/>
				</Blur>
			)}
		</div>
	);
};
