import React from 'react';

import styles from './Privacy.module.scss'

export const Privacy = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</h1>

			<p className={styles.date}>
				Дата последнего обновления: 06 июня 2026 года
			</p>

			<p className={styles.intro}>
				Настоящее Пользовательское соглашение (далее — Соглашение)
				определяет порядок и условия использования мобильного приложения
				«Routie»...
			</p>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>1. ОБЩИЕ ПОЛОЖЕНИЯ</h2>

				<p className={styles.paragraph}>
					В настоящем Соглашении, если из текста прямо не вытекает
					иное, следующие термины имеют указанные значения:
				</p>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						<strong>Администрация (Разработчики)</strong> — команда
						разработчиков Приложения в рамках дипломного проекта.
					</li>

					<li className={styles.listItem}>
						<strong>Акцепт</strong> — полное и безоговорочное
						принятие условий настоящего Соглашения.
					</li>

					<li className={styles.listItem}>
						<strong>Пользователь</strong> — физическое лицо,
						осуществляющее доступ к Приложению.
					</li>

					<li className={styles.listItem}>
						<strong>Аккаунт</strong> — учётная запись Пользователя.
					</li>

					<li className={styles.listItem}>
						<strong>Контент</strong> — любые материалы, размещаемые
						Пользователем.
					</li>

					<li className={styles.listItem}>
						<strong>Геймификационные элементы</strong> — очки,
						уровни, достижения, бейджи и другие игровые механики.
					</li>

					<li className={styles.listItem}>
						<strong>Геоданные</strong> — данные о местоположении
						Пользователя.
					</li>

					<li className={styles.listItem}>
						<strong>Приложение</strong> — спортивно-туристическое
						мобильное приложение с элементами геймификации.
					</li>
				</ul>

				<p className={styles.paragraph}>
					1.2. Все остальные термины толкуются в соответствии с
					законодательством Российской Федерации.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>2. ПРЕДМЕТ СОГЛАШЕНИЯ</h2>

				<p className={styles.paragraph}>
					2.1. Администрация предоставляет Пользователю право
					безвозмездного использования Приложения.
				</p>

				<p className={styles.paragraph}>
					2.2. Приложение предоставляется по принципу «как есть» (as
					is).
				</p>

				<p className={styles.paragraph}>
					2.3. Пользователь присоединяется к Соглашению, начиная
					использовать Приложение.
				</p>

				<p className={styles.paragraph}>
					2.4. Используя Приложение, Пользователь подтверждает, что
					ознакомился с условиями Соглашения.
				</p>

				<p className={styles.paragraph}>
					2.5. Настоящее Соглашение не устанавливает агентских,
					партнёрских или иных отношений.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					3. РЕГИСТРАЦИЯ И АККАУНТ
				</h2>

				<ol className={styles.numberedList}>
					<li className={styles.listItem}>
						Для доступа к полному функционалу рекомендуется пройти
						регистрацию.
					</li>

					<li className={styles.listItem}>
						Пользователь обязуется предоставлять достоверную
						информацию.
					</li>

					<li className={styles.listItem}>
						Пользователь самостоятельно несёт ответственность за
						сохранность логина и пароля.
					</li>

					<li className={styles.listItem}>
						Запрещается передача аккаунта третьим лицам.
					</li>

					<li className={styles.listItem}>
						Пользователь даёт согласие на получение уведомлений.
					</li>
				</ol>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					4. ПРАВА И ОБЯЗАННОСТИ АДМИНИСТРАЦИИ
				</h2>

				<h3 className={styles.subTitle}>Администрация вправе:</h3>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						вносить изменения в Приложение и Соглашение;
					</li>
					<li className={styles.listItem}>
						проводить модерацию Контента;
					</li>
					<li className={styles.listItem}>
						ограничивать или блокировать доступ к Аккаунту;
					</li>
					<li className={styles.listItem}>
						собирать статистику и отзывы.
					</li>
				</ul>

				<h3 className={styles.subTitle}>Администрация обязуется:</h3>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						предоставлять Приложение «как есть»;
					</li>
					<li className={styles.listItem}>
						обрабатывать персональные данные согласно Политике
						конфиденциальности.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					5. ПРАВА И ОБЯЗАННОСТИ ПОЛЬЗОВАТЕЛЯ
				</h2>

				<h3 className={styles.subTitle}>Пользователь вправе:</h3>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						использовать Приложение в личных некоммерческих целях;
					</li>
					<li className={styles.listItem}>
						создавать, сохранять и проходить маршруты и треки;
					</li>
					<li className={styles.listItem}>
						участвовать в геймификационных механиках;
					</li>
					<li className={styles.listItem}>
						редактировать данные своего аккаунта.
					</li>
				</ul>

				<h3 className={styles.subTitle}>Пользователь обязан:</h3>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						соблюдать законодательство Российской Федерации;
					</li>
					<li className={styles.listItem}>
						обеспечивать свою личную безопасность во время
						спортивных и туристических активностей;
					</li>
					<li className={styles.listItem}>
						не размещать запрещённый Контент;
					</li>
					<li className={styles.listItem}>
						не использовать GPS-спуфинг, ботов и иные способы
						накрутки достижений;
					</li>
					<li className={styles.listItem}>
						самостоятельно отслеживать изменения настоящего
						Соглашения.
					</li>
				</ul>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					6. ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ АДМИНИСТРАЦИИ
				</h2>

				<p className={styles.paragraph}>
					6.1. Администрация не несёт ответственности за:
				</p>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						вред жизни, здоровью или имуществу Пользователя,
						возникший в ходе использования Приложения;
					</li>
					<li className={styles.listItem}>
						точность геоданных, маршрутов и навигационной
						информации;
					</li>
					<li className={styles.listItem}>
						действия других Пользователей и достоверность
						размещаемого ими Контента;
					</li>
					<li className={styles.listItem}>
						технические сбои, перебои связи и временную
						недоступность Приложения.
					</li>
				</ul>

				<p className={styles.paragraph}>
					6.2. Приложение не заменяет профессиональные навигационные
					средства, специализированное спортивное оборудование или
					источники экстренной помощи.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					7. КОНТЕНТ ПОЛЬЗОВАТЕЛЯ И ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ
				</h2>

				<p className={styles.paragraph}>
					7.1. Пользователь сохраняет права на размещаемый им Контент,
					однако предоставляет Администрации неисключительное право
					использовать такой Контент в целях функционирования и
					развития Приложения.
				</p>

				<p className={styles.paragraph}>
					7.2. Пользователю запрещается размещать Контент:
				</p>

				<ul className={styles.list}>
					<li className={styles.listItem}>
						нарушающий права третьих лиц;
					</li>
					<li className={styles.listItem}>
						противоречащий законодательству Российской Федерации;
					</li>
					<li className={styles.listItem}>
						содержащий оскорбления, угрозы, рекламу или спам;
					</li>
					<li className={styles.listItem}>
						содержащий вредоносное программное обеспечение.
					</li>
				</ul>

				<p className={styles.paragraph}>
					7.3. Исключительные права на Приложение, его программный
					код, интерфейс, дизайн и иные объекты интеллектуальной
					собственности принадлежат Администрации.
				</p>

				<p className={styles.paragraph}>
					7.4. Копирование, декомпиляция, модификация и
					распространение Приложения без письменного разрешения
					Администрации запрещены.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					8. ГЕЙМИФИКАЦИОННЫЕ ЭЛЕМЕНТЫ
				</h2>

				<p className={styles.paragraph}>
					8.1. Очки, достижения, уровни, рейтинги, бейджи и иные
					игровые элементы используются исключительно в
					развлекательных целях и не имеют денежной или иной
					материальной ценности.
				</p>

				<p className={styles.paragraph}>
					8.2. Администрация вправе изменять, удалять или добавлять
					геймификационные механики без предварительного уведомления
					Пользователей.
				</p>

				<p className={styles.paragraph}>
					8.3. Администрация не гарантирует сохранение достижений,
					рейтингов и прочих игровых показателей в случае технических
					работ или ошибок.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>9. ПЕРСОНАЛЬНЫЕ ДАННЫЕ</h2>

				<p className={styles.paragraph}>
					9.1. Использование Приложения предполагает обработку
					персональных данных Пользователя, включая данные учётной
					записи, геоданные и информацию об активности.
				</p>

				<p className={styles.paragraph}>
					9.2. Обработка персональных данных осуществляется в
					соответствии с Политикой конфиденциальности, являющейся
					неотъемлемой частью настоящего Соглашения.
				</p>

				<p className={styles.paragraph}>
					9.3. Пользователь подтверждает своё согласие на обработку
					предоставленных данных в объёме, необходимом для
					функционирования Приложения.
				</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>
					10. ИЗМЕНЕНИЕ И РАСТОРЖЕНИЕ СОГЛАШЕНИЯ
				</h2>

				<p className={styles.paragraph}>
					10.1. Администрация вправе в любое время изменять настоящее
					Соглашение. Новая редакция вступает в силу с момента её
					публикации в Приложении.
				</p>

				<p className={styles.paragraph}>
					10.2. Продолжение использования Приложения после публикации
					новой редакции Соглашения означает согласие Пользователя с
					внесёнными изменениями.
				</p>

				<p className={styles.paragraph}>
					10.3. Пользователь вправе прекратить использование
					Приложения в любое время путём удаления Аккаунта и
					прекращения доступа к сервису.
				</p>

				<p className={styles.paragraph}>
					10.4. Администрация вправе ограничить или прекратить доступ
					Пользователя к Приложению при нарушении условий настоящего
					Соглашения.
				</p>
			</section>
		</div>
	);
};
