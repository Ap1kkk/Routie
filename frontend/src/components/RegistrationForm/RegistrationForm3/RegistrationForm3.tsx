import React, { useEffect, useRef, useState } from 'react';
import { Button, Tag } from '@ui';

import styles from './RegistrationForm3.module.scss';
import s from '../RegistrationForm.module.scss';

interface Tag {
	id: string;
	name: string;
}

const availableTags: Tag[] = [
	{ id: '1', name: 'Фитнес' },
	{ id: '2', name: 'Бег' },
	{ id: '3', name: 'Йога' },
	{ id: '4', name: 'Велоспорт' },
	{ id: '5', name: 'Плавание' },
	{ id: '6', name: 'Тренажёрный зал' },
	{ id: '7', name: 'Кроссфит' },
	{ id: '8', name: 'Танцы' },
	{ id: '9', name: 'Футбол' },
	{ id: '10', name: 'Баскетбол' },
	{ id: '11', name: 'Волейбол' },
	{ id: '12', name: 'Теннис' },
	{ id: '13', name: 'Бокс' },
	{ id: '14', name: 'ММА' },
	{ id: '15', name: 'Карате' },
	{ id: '16', name: 'Дзюдо' },
	{ id: '17', name: 'Самбо' },
	{ id: '18', name: 'Стретчинг' },
	{ id: '19', name: 'Пилатес' },
	{ id: '20', name: 'Калланетика' },
	{ id: '21', name: 'Зумба' },
	{ id: '22', name: 'Лыжи' },
	{ id: '23', name: 'Сноуборд' },
	{ id: '24', name: 'Скейтборд' },
	{ id: '25', name: 'Роллерспорт' },
	{ id: '26', name: 'Скалолазание' },
	{ id: '27', name: 'Туризм' },
	{ id: '28', name: 'Спортивная ходьба' },
	{ id: '29', name: 'Триатлон' },
	{ id: '30', name: 'Пауэрлифтинг' },
];

interface RegistrationForm3Props {
	onComplete: (data: { tags: string[] }) => void;
	onBack: () => void;
	initialData?: { tags: string[] };
}

export const RegistrationForm3: React.FC<RegistrationForm3Props> = ({
	onComplete,
	onBack,
	initialData,
}) => {
	const [selectedTags, setSelectedTags] = useState<string[]>(
		initialData?.tags || []
	);

	const tagItems = availableTags.map((tag) => ({
		id: tag.id,
		label: tag.name,
	}));

	const handleTagClick = (tagId?: string | number) => {
		if (tagId) {
			const id = String(tagId);
			setSelectedTags((prev) =>
				prev.includes(id)
					? prev.filter((selectedId) => selectedId !== id)
					: [...prev, id]
			);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onComplete({ tags: selectedTags });
	};

	return (
		<div className={styles.container}>
			<div className={s.stepCounter}>
				<div className={s.stepIndicator}>Шаг 3 из 3</div>
				<div className={s.progressSteps}>
					<div className={`${s.stepDot} ${s.active}`} />
					<div className={`${s.stepDot} ${s.active}`} />
					<div className={`${s.stepDot} ${s.active}`} />
				</div>
			</div>
			<form onSubmit={handleSubmit} className={styles.form}>
				<span className={styles.tagTitle}>
					Выберите теги, которые вам нравятся
				</span>

				<Tag
					items={tagItems}
					variant='selectable'
					selectedIds={selectedTags}
					onTagClick={handleTagClick}
				/>

				<div className={styles.tagsButtons}>
					<Button
						type='button'
						variant='secondary'
						onClick={onBack}
						className={styles.backButton}>
						Назад
					</Button>
					<Button
						type='submit'
						variant='primary'
						className={styles.nextButton}>
						Завершить регистрацию
					</Button>
				</div>
			</form>
		</div>
	);
};
