import React, { useEffect, useState } from 'react';
import { Button, Tag } from '@ui';

import styles from './RegistrationForm3.module.scss';
import s from '../RegistrationForm/RegistrationForm.module.scss';

import { getAllTagsApi } from '../../utils/api/TagApi';

interface TagItem {
	id: string;
	label: string;
}

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
	const [availableTags, setAvailableTags] = useState<TagItem[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>(
		initialData?.tags || []
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// ✅ Валидация (минимум 3 тега)
	const isValid = selectedTags.length >= 3;

	useEffect(() => {
		const loadTags = async () => {
			try {
				setLoading(true);

				const result = await getAllTagsApi();

				if (!result.success || !result.data) {
					throw new Error(
						result.error?.message || 'Ошибка загрузки тегов'
					);
				}

				const formattedTags: TagItem[] = result.data.map((tag) => ({
					id: tag.id,
					label: tag.title,
				}));

				setAvailableTags(formattedTags);

				console.log('✅ Теги загружены:', formattedTags);
			} catch (err: any) {
				console.error('❌ Ошибка загрузки тегов:', err);
				setError('Не удалось загрузить теги. Попробуйте позже.');
			} finally {
				setLoading(false);
			}
		};

		loadTags();
	}, []);

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

		if (!isValid) return;

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

				{loading ? (
					<div className={styles.loading}>Загрузка тегов...</div>
				) : error ? (
					<div className={styles.error}>{error}</div>
				) : (
					<>
						<Tag
							items={availableTags}
							variant='selectable'
							selectedIds={selectedTags}
							onTagClick={handleTagClick}
							wrap={true}
						/>

						{/* ✅ Подсказка */}
						{!isValid && (
							<div className={styles.error}>
								Выберите минимум 3 тега ({selectedTags.length}
								/3)
							</div>
						)}
					</>
				)}

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
						className={styles.nextButton}
						disabled={loading || !isValid}>
						Завершить регистрацию
					</Button>
				</div>
			</form>
		</div>
	);
};
