import React from 'react';

import styles from './Terms.module.scss';

export const Terms = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h1>

			<p className={styles.subtitle}>
				Мобильного приложения Routie
			</p>

			<p className={styles.date}>
				Дата вступления в силу: 06 июня 2026 года
			</p>

			<p className={styles.paragraph}>
				Настоящая Политика конфиденциальности (далее — Политика)
				определяет порядок обработки и защиты персональных данных
				пользователей мобильного приложения Routie (далее —
				Приложение).
			</p>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					1. ОБЩИЕ ПОЛОЖЕНИЯ
				</h2>

				<p className={styles.paragraph}>
					1.1. Использование Приложения означает согласие Пользователя
					с условиями настоящей Политики.
				</p>

				<p className={styles.paragraph}>
					1.2. Если Пользователь не согласен с условиями Политики,
					он должен прекратить использование Приложения.
				</p>

				<p className={styles.paragraph}>
					1.3. Политика разработана в соответствии с Федеральным
					законом № 152-ФЗ от 27.07.2006 «О персональных данных»
					и иными нормативными актами Российской Федерации.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>2. ОПРЕДЕЛЕНИЯ</h2>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						<strong>Персональные данные</strong> — любая
						информация, относящаяся к прямо или косвенно
						определённому физическому лицу.
					</li>

					<li className={styles.listItem}>
						<strong>Обработка персональных данных</strong> —
						любое действие или совокупность действий с
						персональными данными.
					</li>

					<li className={styles.listItem}>
						<strong>Геоданные</strong> — данные о географическом
						местоположении Пользователя.
					</li>

					<li className={styles.listItem}>
						<strong>Данные об активности</strong> —
						информация о маршрутах, расстояниях, времени,
						скорости и других показателях активности.
					</li>

					<li className={styles.listItem}>
						<strong>Администрация</strong> — команда
						разработчиков Приложения.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					3. СОСТАВ СОБИРАЕМЫХ ПЕРСОНАЛЬНЫХ ДАННЫХ
				</h2>

				<p className={styles.paragraph}>
					При использовании Приложения мы можем собирать следующие
					данные:
				</p>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						Данные регистрации: имя, никнейм, адрес электронной
						почты, дата рождения, вес, рост.
					</li>

					<li className={styles.listItem}>
						Геоданные: местоположение во время использования
						трекинга маршрутов.
					</li>

					<li className={styles.listItem}>
						Данные об активности: маршруты, расстояние,
						время, статистика достижений.
					</li>

					<li className={styles.listItem}>
						Геймификационные данные: опыт, уровни,
						достижения, лидерборды.
					</li>

					<li className={styles.listItem}>
						Контент Пользователя: фотографии, описания,
						отзывы.
					</li>

					<li className={styles.listItem}>
						Технические данные: IP-адрес, устройство,
						версия ОС, cookies и аналитика.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					4. ЦЕЛИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
				</h2>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						Предоставление доступа к функционалу Приложения.
					</li>

					<li className={styles.listItem}>
						Сохранение прогресса и достижений Пользователя.
					</li>

					<li className={styles.listItem}>
						Улучшение качества сервиса и разработка новых функций.
					</li>

					<li className={styles.listItem}>
						Персонализация рекомендаций маршрутов и челленджей.
					</li>

					<li className={styles.listItem}>
						Обеспечение безопасности и борьба с накруткой.
					</li>

					<li className={styles.listItem}>
						Направление сервисных уведомлений.
					</li>

					<li className={styles.listItem}>
						Проведение аналитики и статистических исследований.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					5. ПРАВОВЫЕ ОСНОВАНИЯ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
				</h2>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						Добровольное согласие Пользователя.
					</li>

					<li className={styles.listItem}>
						Исполнение Пользовательского соглашения.
					</li>

					<li className={styles.listItem}>
						Выполнение требований законодательства РФ.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					6. ПОРЯДОК ОБРАБОТКИ И ХРАНЕНИЯ ПЕРСОНАЛЬНЫХ ДАННЫХ
				</h2>

				<p className={styles.paragraph}>
					6.1. Обработка персональных данных осуществляется как с
					использованием средств автоматизации, так и без них.
				</p>

				<p className={styles.paragraph}>
					6.2. Хранение персональных данных осуществляется на
					территории Российской Федерации.
				</p>

				<p className={styles.paragraph}>
					6.3. Срок хранения персональных данных соответствует
					целям обработки или требованиям законодательства.
				</p>

				<p className={styles.paragraph}>
					6.4. После удаления Аккаунта данные удаляются либо
					обезличиваются в течение 30 дней.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					7. ПЕРЕДАЧА ПЕРСОНАЛЬНЫХ ДАННЫХ ТРЕТЬИМ ЛИЦАМ
				</h2>

				<p className={styles.paragraph}>
					Мы не передаём персональные данные третьим лицам, кроме
					следующих случаев:
				</p>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						По требованию уполномоченных государственных органов.
					</li>

					<li className={styles.listItem}>
						Для обеспечения технической работы Приложения в
						обезличенном или псевдонимизированном виде.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					8. ПРАВА ПОЛЬЗОВАТЕЛЯ
				</h2>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						Получать информацию об обработке своих данных.
					</li>

					<li className={styles.listItem}>
						Требовать уточнения, блокирования или удаления данных.
					</li>

					<li className={styles.listItem}>
						Отозвать согласие на обработку персональных данных.
					</li>

					<li className={styles.listItem}>
						Удалить свой Аккаунт через настройки Приложения.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					9. МЕРЫ ПО ЗАЩИТЕ ПЕРСОНАЛЬНЫХ ДАННЫХ
				</h2>

				<p className={styles.paragraph}>
					Администрация принимает необходимые технические и
					организационные меры для защиты персональных данных от
					неправомерного доступа, изменения, уничтожения,
					блокирования и распространения.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					10. ИЗМЕНЕНИЕ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ
				</h2>

				<p className={styles.paragraph}>
					10.1. Администрация вправе изменять настоящую Политику.
				</p>

				<p className={styles.paragraph}>
					10.2. Новая редакция вступает в силу с момента публикации
					в Приложении.
				</p>

				<p className={styles.paragraph}>
					10.3. Продолжение использования Приложения означает
					согласие Пользователя с новой редакцией Политики.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					11. КОНТАКТНАЯ ИНФОРМАЦИЯ
				</h2>

				<p className={styles.paragraph}>
					По вопросам обработки персональных данных:
				</p>

				<p className={styles.contact}>
					routie_ngtu@gmail.com
				</p>
			</section>
		</div>
	);
};