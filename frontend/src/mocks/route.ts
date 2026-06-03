import { Route, RouteImage } from '../types/Route';
import { Checkpoint } from '../types/Route';
import { Tags } from '../types/Tags';

const ROUTE_UUIDS = {
	KREMLIN: 'route-11111111-1111-1111-1111-111111111111',
	POKROVSKAYA: 'route-22222222-2222-2222-2222-222222222222',
	FEDOROVSKOGO: 'route-33333333-3333-3333-3333-333333333333',
	CHKALOV_STAIRS: 'route-44444444-4444-4444-4444-444444444444',
	STRELKA: 'route-55555555-5555-5555-5555-555555555555',
	ALEXANDROVSKY_GARDEN: 'route-66666666-6666-6666-6666-666666666666',
	SWITZERLAND_PARK: 'route-77777777-7777-7777-7777-777777777777',
	CABLE_CAR: 'route-88888888-8888-8888-8888-888888888888',
	ROZHDESTVENSKAYA: 'route-99999999-9999-9999-9999-999999999999',
	PECHERSKY_MONASTERY: 'route-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
	SORMOVSKY_PARK: 'route-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
	MYZA: 'route-cccccccc-cccc-cccc-cccc-cccccccccccc',
};

const tags: Tags[] = [
	{ id: '1', title: 'Кремль' },
	{ id: '2', title: 'История' },
	{ id: '3', title: 'Архитектура' },
	{ id: '4', title: 'Пешеходный' },
	{ id: '5', title: 'Улица' },
	{ id: '6', title: 'Достопримечательности' },
	{ id: '7', title: 'Набережная' },
	{ id: '8', title: 'Вид' },
	{ id: '9', title: 'Фото' },
	{ id: '10', title: 'Лестница' },
	{ id: '11', title: 'Монумент' },
	{ id: '12', title: 'Современный' },
	{ id: '13', title: 'Река' },
	{ id: '14', title: 'Спорт' },
	{ id: '15', title: 'Парк' },
	{ id: '16', title: 'Отдых' },
	{ id: '17', title: 'Прогулка' },
	{ id: '18', title: 'Природа' },
	{ id: '19', title: 'Активный отдых' },
	{ id: '20', title: 'Транспорт' },
	{ id: '21', title: 'Экскурсия' },
	{ id: '22', title: 'Культура' },
	{ id: '23', title: 'Рестораны' },
	{ id: '24', title: 'Монастырь' },
	{ id: '25', title: 'Духовное' },
	{ id: '26', title: 'Развлечения' },
	{ id: '27', title: 'Семейный' },
	{ id: '28', title: 'Лес' },
	{ id: '29', title: 'Треккинг' },
];

const kremlinCheckpoints: Checkpoint[] = [
	{
		id: 'cp-kremlin-1',
		latitude: 56.327041,
		longitude: 44.005704,
		order: 1,
		name: 'Дмитриевская башня',
		description:
			'Главная проездная башня, парадный вход в Кремль. Названа в честь великого князя Дмитрия Константиновича. Сегодня здесь расположен музей-выставка "Горьковчане — фронту".',
	},
	{
		id: 'cp-kremlin-2',
		latitude: 56.326343,
		longitude: 44.003523,
		order: 2,
		name: 'Кладовая башня',
		description:
			'Глухая (непроездная) башня. Свое название получила из-за того, что в ней хранились боеприпасы и оружие ("казна"). Имеет характерную шатровую кровлю.',
	},
	{
		id: 'cp-kremlin-3',
		latitude: 56.325689,
		longitude: 44.001337,
		order: 3,
		name: 'Никольская башня',
		description:
			'Проездная башня. Над воротами ранее располагалась икона Николая Чудотворца. Выходит к площади Народного Единства и церкви Иоанна Предтечи.',
	},
	{
		id: 'cp-kremlin-4',
		latitude: 56.325774,
		longitude: 43.998945,
		order: 4,
		name: 'Коромыслова башня',
		description:
			'Круглая глухая башня. Легенда гласит, что при закладке башни под ней якобы была заживо закопана девушка с коромыслом. Одна из самых мистических башен Кремля.',
	},
	{
		id: 'cp-kremlin-5',
		latitude: 56.327545,
		longitude: 43.997402,
		order: 5,
		name: 'Тайницкая башня',
		description:
			'Получила название из-за скрытого "тайника" — подземного хода, который вел к реке Почайне (или Печоре) на случай осады и недостатка воды.',
	},
	{
		id: 'cp-kremlin-6',
		latitude: 56.32877,
		longitude: 43.99807,
		order: 6,
		name: 'Северная башня',
		description:
			'Глухая башня, ранее называлась Ильинской (по близлежащей церкви Ильи Пророка). Название "Северная" закрепилось из-за её местоположения на северном склоне холма.',
	},
	{
		id: 'cp-kremlin-7',
		latitude: 56.32877,
		longitude: 43.998838,
		order: 7,
		name: 'Часовая башня',
		description:
			'Венчает Спасский собор? Нет, это отдельная башня Кремля (ранее называлась Арсенальной или Алексеевской). В древности на ней были установлены часы-куранты.',
	},
	{
		id: 'cp-kremlin-8',
		latitude: 56.329861,
		longitude: 43.999697,
		order: 8,
		name: 'Ивановская башня',
		description:
			'Самая высокая башня Кремля (около 30 м). Рядом с ней находится действующий храм Иоанна Предтечи. С этой башни открывается лучший вид на Стрелку и Волгу.',
	},
	{
		id: 'cp-kremlin-9',
		latitude: 56.330573,
		longitude: 44.001753,
		order: 9,
		name: 'Белая башня',
		description: 'Круглая башня, которая первой подвергалась ударам с Волги. Стены из местного белого камня придавали ей особенно светлый вид, за что она и получила имя.',
	},
	{
		id: 'cp-kremlin-10',
		latitude: 56.330836,
		longitude: 44.003444,
		order: 10,
		name: 'Зачатьевская башня',
		description: 'Утраченная и восстановленная башня. Стояла на берегу Почайны. Названа по находившемуся рядом Зачатьевскому монастырю. Внутри интересный музей археологии.',
	},
	{
		id: 'cp-kremlin-11',
		latitude: 56.330776,
		longitude: 44.006276,
		order: 11,
		name: 'Борисоглебская башня',
		description: 'Проездная башня с воротами. Названа в честь церкви Бориса и Глеба (не сохранилась). Рядом с башней находится памятник Петру I и смотровая площадка.',
	},
	{
		id: 'cp-kremlin-12',
		latitude: 56.330073,
		longitude: 44.008888,
		order: 12,
		name: 'Георгиевская башня',
		description: 'Проездная башня с надвратным храмом. Выходит к Михайло-Архангельскому собору. Свое название получила от располагавшейся рядом церкви Святого Георгия.',
	},
	{
		id: 'cp-kremlin-13',
		latitude: 56.328472,
		longitude: 44.007313,
		order: 13,
		name: 'Пороховая башня',
		description: 'Глухая (непроездная) башня. Служила арсеналом для хранения запасов пороха («зелья»). До революции также называлась «Спасской» (по близости к Спасо-Преображенскому собору).',
	},
];

export const mockRouteKremlin: Route = {
	id: ROUTE_UUIDS.KREMLIN,
	name: 'Нижегородский Кремль',
	distance: 2100,
	checkpoints: kremlinCheckpoints,
	tags: [tags[0], tags[1], tags[2]],
	createdAt: '2024-01-01T00:00:00Z',
};

const pokrovskayaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-pok-1',
		latitude: 56.313476,
		longitude: 43.990696,
		order: 1,
		name: 'Памятник Максиму Горькому',
		description:
			'Один из символов Нижнего Новгорода. Скульптор В. Мухина создала образ писателя в момент творческого вдохновения. Местные жители ласково называют его «Максимыч».',
	},
	{
		id: 'cp-pok-2',
		latitude: 56.314121,
		longitude: 43.991415,
		order: 2,
		name: 'Сквер имени М. Горького',
		description:
			'Небольшой уютный сквер с фонтанами и скамейками. Любимое место отдыха горожан и стартовая точка прогулок по главной пешеходной улице.',
	},
	{
		id: 'cp-pok-3',
		latitude: 56.314854,
		longitude: 43.99229,
		order: 3,
		name: 'Подпись Горького',
		description:
			'Художественная инсталляция — объёмная подпись Максима Горького на брусчатке. Популярное место для фото. Символизирует «личную подпись» писателя под любимой улицей.',
	},
	{
		id: 'cp-pok-4',
		latitude: 56.31531,
		longitude: 43.993505,
		order: 4,
		name: 'Дом связи',
		description:
			'Бывшее здание Нижегородского почтамта, построенное в 1930-х годах. Образец сталинского конструктивизма. На башне до сих пор работают старинные часы.',
	},
	{
		id: 'cp-pok-5',
		latitude: 56.316662,
		longitude: 43.993943,
		order: 5,
		name: 'Доходный дом купца Д. Н. Колчина',
		description:
			'Эффектное здание с богатой лепниной и эркерами. Построено в стиле эклектики в конце XIX века. Внутри располагались дорогие меблированные комнаты и магазины.',
	},
	{
		id: 'cp-pok-6',
		latitude: 56.317231,
		longitude: 43.994088,
		order: 6,
		name: 'Кинотеатр «Октябрь»',
		description:
			'Один из старейших кинотеатров города, открытый в 1938 году. Изначально назывался «Рот Фронт». Памятник архитектуры, до сих пор действующий кинотеатр.',
	},
	{
		id: 'cp-pok-7',
		latitude: 56.317652,
		longitude: 43.995092,
		order: 7,
		name: 'Дом Ф. Пятова',
		description:
			'Купеческий особняк с красивым лепным декором. Владелец торговал мануфактурой. Сейчас здесь расположены магазины и офисы, но фасад сохранил исторический облик.',
	},
	{
		id: 'cp-pok-8',
		latitude: 56.317593,
		longitude: 43.995698,
		order: 8,
		name: 'Дом декабристов Белавиных',
		description:
			'Памятное место: здесь в ссылке жили декабристы братья Белавины. Скромный деревянный дом на каменном фундаменте — образец нижегородского ампира.',
	},
	{
		id: 'cp-pok-9',
		latitude: 56.317673,
		longitude: 43.995746,
		order: 9,
		name: 'Торговый флигель О. Н. Каменевой',
		description:
			'Небольшое, но нарядное здание, где располагались лавки. Примечательно изящной отделкой фасада и коваными элементами. Часть бывшей городской усадьбы.',
	},
	{
		id: 'cp-pok-10',
		latitude: 56.318408,
		longitude: 43.995997,
		order: 10,
		name: 'Нижегородский театр кукол',
		description:
			'Один из старейших кукольных театров России. Располагается в красивом особняке, где когда-то жил купец. Зрителей встречает сказочный декор на фасаде.',
	},
	{
		id: 'cp-pok-11',
		latitude: 56.318657,
		longitude: 43.99638,
		order: 11,
		name: 'Доходный дом С. Я. Фролова',
		description:
			'Образец «кирпичного стиля» конца XIX века. На первом этаже традиционно размещались магазины, на верхних — квартиры. Отличается качественной кладкой и пропорциями.',
	},
	{
		id: 'cp-pok-12',
		latitude: 56.318621,
		longitude: 43.996975,
		order: 12,
		name: 'Женское епархиальное училище',
		description:
			'Бывшее женское духовное училище в неорусском стиле. На фасаде — изразцы и кокошники. Сейчас здесь одно из учебных заведений Нижнего Новгорода.',
	},
	{
		id: 'cp-pok-13',
		latitude: 56.320265,
		longitude: 43.998612,
		order: 13,
		name: 'Здание Государственного банка',
		description:
			'Шедевр неорусского стиля архитектора В. Покровского. Построено к 300-летию дома Романовых. Богатая лепнина, гербы, керамика — настоящее украшение Покровки.',
	},
	{
		id: 'cp-pok-14',
		latitude: 56.320882,
		longitude: 43.999466,
		order: 14,
		name: 'Дом Басовых',
		description:
			'Купеческая усадьба с изящным классическим портиком. Один из старейших домов на улице, построен в начале XIX века. Сохранил атмосферу старого купеческого Нижнего.',
	},
	{
		id: 'cp-pok-15',
		latitude: 56.321309,
		longitude: 43.999847,
		order: 15,
		name: 'Дом К. Г. Иванова',
		description:
			'Небольшой двухэтажный особняк с мезонином. Типичная нижегородская купеческая постройка середины XIX века. На фасаде — красивые наличники и пилястры.',
	},
	{
		id: 'cp-pok-16',
		latitude: 56.321705,
		longitude: 43.999584,
		order: 16,
		name: 'Доходный дом купцов Пальцевых',
		description:
			'Монументальное здание с богатым лепным декором: маскароны, гирлянды, картуши. Известная купеческая династия Пальцевых владела здесь магазинами и квартирами.',
	},
	{
		id: 'cp-pok-17',
		latitude: 56.322078,
		longitude: 44.000051,
		order: 17,
		name: 'Доходный дом князей Юсуповых',
		description:
			'Знаменитый дом, где останавливалась знатная семья Юсуповых. Роскошный особняк в стиле эклектики с лепниной. Сейчас — отель и ресторан.',
	},
	{
		id: 'cp-pok-18',
		latitude: 56.322266,
		longitude: 44.000941,
		order: 18,
		name: 'Дом культуры им. Свердлова',
		description:
			'Памятник конструктивизма 1920-х годов. Крупный культурный центр с театральным залом. Изначально — Дом культуры связистов. Необычная архитектура для Покровки.',
	},
	{
		id: 'cp-pok-19',
		latitude: 56.322908,
		longitude: 44.001234,
		order: 19,
		name: 'Трамвай',
		description:
			'Исторический трамвай А (маршрут «Аннушка»), курсирующий по Большой Покровской. Местная достопримечательность и узнаваемый символ улицы.',
	},
	{
		id: 'cp-pok-20',
		latitude: 56.322997,
		longitude: 44.001704,
		order: 20,
		name: 'Усадьба А. В. Мичуриной',
		description:
			'Хорошо сохранившаяся городская усадьба. Главный дом и флигели образуют единый ансамбль. Образец купеческого быта XIX века в центре города.',
	},
	{
		id: 'cp-pok-21',
		latitude: 56.323133,
		longitude: 44.001818,
		order: 21,
		name: 'Дом А. С. Остатошникова',
		description:
			'Жилой дом с необычной судьбой и архитектурой. Владелец был известным нижегородским мещанином. Фасад украшен изящной лепниной и кованными элементами.',
	},
	{
		id: 'cp-pok-22',
		latitude: 56.323915,
		longitude: 44.002106,
		order: 22,
		name: 'Театр драмы им. М. Горького',
		description:
			'Один из старейших драматических театров России (основан в 1798 году). Здание в стиле модерн с богатой лепниной. Перед театром — памятник Горькому.',
	},
	{
		id: 'cp-pok-23',
		latitude: 56.324258,
		longitude: 44.002938,
		order: 23,
		name: 'Усадьба И. К. Лопашева (главный дом)',
		description:
			'Главный дом усадьбы Лопашева — образец нижегородского классицизма. Построен в середине XIX века. Украшает Покровскую улицу строгим и благородным фасадом.',
	},
	{
		id: 'cp-pok-24',
		latitude: 56.324374,
		longitude: 44.003137,
		order: 24,
		name: 'Усадьба И. К. Лопашева (флигель)',
		description:
			'Флигель городской усадьбы, построенный в 1870 году. Небольшое, но выразительное здание, завершающее архитектурный ансамбль. Хорошо вписан в историческую застройку.',
	},
	{
		id: 'cp-pok-25',
		latitude: 56.324568,
		longitude: 44.003303,
		order: 25,
		name: 'Усадьба Г. Ф. Сверчкова',
		description:
			'Купеческая усадьба с характерным для Нижнего Новгорода декором. Принадлежала крупному лесопромышленнику. Сейчас здесь находятся различные организации.',
	},
	{
		id: 'cp-pok-26',
		latitude: 56.324834,
		longitude: 44.003518,
		order: 26,
		name: 'Дом М. А. Костромина',
		description:
			'Купеческий дом с красивым фасадом и ажурными коваными воротами. Хороший пример городской застройки XIX века. Сохранил историческую планировку и элементы декора.',
	},
	{
		id: 'cp-pok-27',
		latitude: 56.325979,
		longitude: 44.004132,
		order: 27,
		name: 'Городская дума',
		description:
			'Здание бывшей Городской думы, построенное в 1903 году. Красивая эклектика с элементами модерна. Сейчас здесь располагается администрация Нижегородского района.',
	},
	{
		id: 'cp-pok-28',
		latitude: 56.326146,
		longitude: 44.005133,
		order: 28,
		name: 'Макет Городской думы',
		description:
			'Тактильная бронзовая модель здания Городской думы для слабовидящих людей. Хорошая возможность рассмотреть архитектурные детали в миниатюре и завершающая точка маршрута.',
	},
];

export const mockRoutePokrovskaya: Route = {
	id: ROUTE_UUIDS.POKROVSKAYA,
	name: 'Большая Покровская',
	distance: 1400,
	checkpoints: pokrovskayaCheckpoints,
	tags: [tags[3], tags[4], tags[5]],
	createdAt: '2024-01-01T00:00:00Z',
};

const fedorovskogoCheckpoints: Checkpoint[] = [
	{
		id: 'cp-fed-1',
		latitude: 56.322659,
		longitude: 43.97935,
		order: 1,
		name: 'Аллея дружбы',
		description:
			'Аллея, заложенная в честь 790-летия Нижнего Новгорода. Здесь установлены памятные знаки и скамейки от городов-побратимов. Красивый вид на Волгу и начало набережной.',
	},
	{
		id: 'cp-fed-2',
		latitude: 56.323655,
		longitude: 43.98066,
		order: 2,
		name: '«Солнце ждёт рассвета»',
		description:
			'Арт-объект и скамейка с инсталляцией. Надпись создаёт атмосферу ожидания чуда и стала популярным местом для фото. Отсюда открываются живописные виды на закаты.',
	},
	{
		id: 'cp-fed-3',
		latitude: 56.324318,
		longitude: 43.980745,
		order: 3,
		name: 'Смотровая площадка и Жюль Верн',
		description:
			'Площадка с фигурой Жюля Верна, сидящего на парапете. Писатель словно любуется Волгой и Стрелкой. Один из самых необычных арт-объектов набережной.',
	},
	{
		id: 'cp-fed-4',
		latitude: 56.324843,
		longitude: 43.981448,
		order: 4,
		name: 'Скамейка детства',
		description:
			'Скамейка с забавными фигурами (клоун, птички). Навевает ностальгию по беззаботным временам. Дети и взрослые любят на ней фотографироваться.',
	},
	{
		id: 'cp-fed-5',
		latitude: 56.324479,
		longitude: 43.983531,
		order: 5,
		name: 'Памятник Максиму Горькому',
		description:
			'Скульптурный портрет писателя на фоне Волги. Взгляд Горького обращён в сторону Кремля и Почаинского оврага. Менее известный, но очень душевный памятник.',
	},
	{
		id: 'cp-fed-6',
		latitude: 56.325081,
		longitude: 43.985651,
		order: 6,
		name: 'Городское училище имени М. В. Ломоносова',
		description:
			'Старое здание городского училища с историей. Образец дореволюционной образовательной архитектуры. До сих пор здесь располагается учебное заведение.',
	},
	{
		id: 'cp-fed-7',
		latitude: 56.326367,
		longitude: 43.987198,
		order: 7,
		name: 'Набережная Федоровского',
		description:
			'Живописный участок набережной, названный в честь архитектора, реконструировавшего эту территорию. Здесь приятно гулять, любуясь видами на заволжскую даль.',
	},
	{
		id: 'cp-fed-8',
		latitude: 56.326666,
		longitude: 43.988571,
		order: 8,
		name: 'Смотровая площадка у моста',
		description:
			'Точка с лучшим видом на мост через Почаинский овраг. Отсюда открывается панорама на заволжские дали и можно увидеть Кремль. Особенно впечатляет вечером.',
	},
	{
		id: 'cp-fed-9',
		latitude: 56.326408,
		longitude: 43.990235,
		order: 9,
		name: 'Церковь Успения Пресвятой Богородицы',
		description:
			'Небольшая церковь на Ильинской горе. Построена в XVII веке, позже перестраивалась. Красивый образец русского зодчества с изящными кокошниками и шатрами.',
	},
	{
		id: 'cp-fed-10',
		latitude: 56.326113,
		longitude: 43.989982,
		order: 10,
		name: '«Вечный двигатель»',
		description:
			'Арт-объект — инсталляция в виде маховика или пропеллера. Символизирует движение и энергию. Остановиться и загадать желание — местная традиция.',
	},
	{
		id: 'cp-fed-11',
		latitude: 56.325919,
		longitude: 43.990438,
		order: 11,
		name: 'Палаты А. Ф. Олисова',
		description:
			'Одни из старейших гражданских построек Нижнего Новгорода (XVII век). Образец древнерусского каменного зодчества с наличниками и перспективным порталом.',
	},
	{
		id: 'cp-fed-12',
		latitude: 56.325249,
		longitude: 43.990794,
		order: 12,
		name: 'Усадьба Я. С. Чернонёбова',
		description:
			'Главный дом купеческой усадьбы с сохранившимися историческими интерьерами. Образец богатого городского особняка XIX века. Ныне здесь музей или учреждение культуры.',
	},
	{
		id: 'cp-fed-13',
		latitude: 56.324151,
		longitude: 43.991791,
		order: 13,
		name: 'Городская усадьба',
		description:
			'Комплекс городской усадьбы XIX века. Сочетание главного дома, флигелей и хозяйственных построек. Характерная застройка старого Нижнего Новгорода.',
	},
	{
		id: 'cp-fed-14',
		latitude: 56.323882,
		longitude: 43.990766,
		order: 14,
		name: 'Музей детства А. М. Горького «Домик Каширина»',
		description:
			'Музей, где прошло детство писателя. Дом деда Василия Каширина, описанный в повести «Детство». Подлинная обстановка быта нижегородских мещан XIX века.',
	},
];

export const mockRouteFedorovskogo: Route = {
	id: ROUTE_UUIDS.FEDOROVSKOGO,
	name: 'Набережная Федоровского',
	distance: 1800,
	checkpoints: fedorovskogoCheckpoints,
	tags: [tags[6], tags[7], tags[8]],
	createdAt: '2024-01-01T00:00:00Z',
};

const chkalovStairsCheckpoints: Checkpoint[] = [
	{
		id: 'cp-chkalov-1',
		latitude: 56.326851,
		longitude: 44.007176,
		order: 1,
		name: 'Площадь Минина и Пожарского',
		description:
			'Главная площадь Нижнего Новгорода. Сформировалась в XVII веке. Здесь находится Кремль, памятник Минину и Пожарскому (копия московского), а также здание Городской думы.',
	},
	{
		id: 'cp-chkalov-2',
		latitude: 56.32846,
		longitude: 44.008563,
		order: 2,
		name: 'Духовная семинария',
		description:
			'Историческое здание, где готовили священнослужителей. Построено в XVIII–XIX веках. Сейчас здесь располагается один из корпусов Нижегородской консерватории.',
	},
	{
		id: 'cp-chkalov-3',
		latitude: 56.328808,
		longitude: 44.00888,
		order: 3,
		name: 'Бюст К. Минина',
		description:
			'Бюст национального героя Кузьмы Минина, организатора народного ополчения 1612 года. Установлен рядом с местом, где Минин призывал нижегородцев к освобождению Москвы.',
	},
	{
		id: 'cp-chkalov-4',
		latitude: 56.329966,
		longitude: 44.00969,
		order: 4,
		name: 'Мини-копия памятника В. П. Чкалову',
		description:
			'Уменьшенная копия знаменитого памятника летчику Валерию Чкалову. Забавный и трогательный арт-объект, популярный для фото. Оригинал находится в начале лестницы.',
	},
	{
		id: 'cp-chkalov-5',
		latitude: 56.330249,
		longitude: 44.00942,
		order: 5,
		name: 'Смотровая площадка',
		description:
			'Верхняя смотровая площадка у Чкаловской лестницы. Отсюда открывается захватывающий вид на Волгу, Стрелку, Канавинский мост и заволжские дали. Обязательное место для фото.',
	},
	{
		id: 'cp-chkalov-6',
		latitude: 56.330872,
		longitude: 44.009459,
		order: 6,
		name: 'Чкаловская лестница (верхняя часть)',
		description:
			'Главная лестница Нижнего Новгорода, построенная в 1940-х годах в форме восьмерки. Состоит из 560 ступеней. Спуск начинается у памятника Чкалову (находится чуть выше).',
	},
	{
		id: 'cp-chkalov-7',
		latitude: 56.33227,
		longitude: 44.009507,
		order: 7,
		name: 'Катер «Герой»',
		description:
			'Памятник-катер «Герой» внизу Чкаловской лестницы. Торпедный катер — участник Сталинградской битвы. Установлен в память о нижегородцах-судостроителях и моряках Волжской флотилии.',
	},
];

export const mockRouteChkalovStairs: Route = {
	id: ROUTE_UUIDS.CHKALOV_STAIRS,
	name: 'Чкаловская лестница',
	distance: 800,
	checkpoints: chkalovStairsCheckpoints,
	tags: [tags[9], tags[10], tags[1]],
	createdAt: '2024-01-01T00:00:00Z',
};

const strelkaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-strelka-1',
		latitude: 56.333341,
		longitude: 43.970627,
		order: 1,
		name: 'Колокол Соборный',
		description:
			'Памятный знак в виде колокола, установленный в честь возрождения собора Александра Невского. Колокол символизирует духовное возрождение и историческую память.',
	},
	{
		id: 'cp-strelka-2',
		latitude: 56.333621,
		longitude: 43.971273,
		order: 2,
		name: 'Кафедральный собор во имя Александра Невского',
		description:
			'Величественный Новоярмарочный собор, построенный в 1881 году. Один из символов Нижнего Новгорода, видимый издалека. Выполнен в русско-византийском стиле. Второй по высоте собор в Нижегородской области (высота около 80 метров).',
	},
	{
		id: 'cp-strelka-3',
		latitude: 56.333385,
		longitude: 43.972169,
		order: 3,
		name: 'Памятник Александру Невскому',
		description:
			'Бронзовая фигура святого князя Александра Невского на высоком постаменте. Установлен у стен собора. Князь считается небесным покровителем Нижнего Новгорода.',
	},
	{
		id: 'cp-strelka-4',
		latitude: 56.334369,
		longitude: 43.974262,
		order: 4,
		name: 'Мемориал «Павшим в боях за Родину»',
		description:
			'Памятник воинам-нижегородцам, погибшим в локальных конфликтах и войнах XX–XXI веков. Скорбная стела с именами героев. Место проведения памятных церемоний.',
	},
	{
		id: 'cp-strelka-5',
		latitude: 56.334549,
		longitude: 43.976029,
		order: 5,
		name: 'Стрелка (мыс)',
		description:
			'Историческое место слияния двух великих рек — Оки (справа) и Волги (слева). Здесь проходила знаменитая Нижегородская ярмарка. Открывается классическая панорама заволжских далей.',
	},
	{
		id: 'cp-strelka-6',
		latitude: 56.334521,
		longitude: 43.977128,
		order: 6,
		name: 'Надпись «Стрелка» и смотровая площадка',
		description:
			'Популярное место для фото с объёмной надписью «Стрелка» на фоне рек и мостов. Оборудованная смотровая площадка с лавочками. Невероятные закаты и рассветы.',
	},
	{
		id: 'cp-strelka-7',
		latitude: 56.334973,
		longitude: 43.974441,
		order: 7,
		name: 'Пакгаузы',
		description:
			'Исторические выставочные павильоны Всероссийской промышленно-художественной выставки 1896 года. Реставрированы и превращены в современные общественные пространства. Образец кирпичного стиля с элементами модерна.',
	},
	{
		id: 'cp-strelka-8',
		latitude: 56.335135,
		longitude: 43.974208,
		order: 8,
		name: 'Неваляшка',
		description:
			'Яркий арт-объект — гигантская неваляшка (ванька-встанька). Установлен как символ детства и игрушечного наследия. Очень популярен у детей и взрослых для фото.',
	},
	{
		id: 'cp-strelka-9',
		latitude: 56.335649,
		longitude: 43.974776,
		order: 9,
		name: 'Реплика Шуховской башни',
		description:
			'Уменьшенная копия знаменитой Шуховской башни на Оке. Ажурная металлическая конструкция, созданная по чертежам инженера Владимира Шухова. Памятник инженерной мысли.',
	},
	{
		id: 'cp-strelka-10',
		latitude: 56.336398,
		longitude: 43.972135,
		order: 10,
		name: 'Портовый кран',
		description:
			'Исторический портовый кран, оставленный как арт-объект в память о промышленном прошлом Стрелки. Мощная металлическая конструкция напоминает о ярмарочных грузах и волжских причалах.',
	},
	{
		id: 'cp-strelka-11',
		latitude: 56.334628,
		longitude: 43.974207,
		order: 11,
		name: 'Ярмарочная водопроводная станция',
		description:
			'Здание старейшей водопроводной станции Нижегородской ярмарки конца XIX века. Технический памятник, обеспечивающий водой исторический комплекс. Стилизовано под средневековый замок.',
	},
];

export const mockRouteStrelka: Route = {
	id: ROUTE_UUIDS.STRELKA,
	name: 'Стрелка',
	distance: 3200,
	checkpoints: strelkaCheckpoints,
	tags: [tags[11], tags[12], tags[13]],
	createdAt: '2024-01-01T00:00:00Z',
};

const switzerlandParkCheckpoints: Checkpoint[] = [
	{
		id: 'cp-swiss-1',
		latitude: 56.282231,
		longitude: 43.979967,
		order: 1,
		name: 'Входы и ограда парка Швейцария',
		description:
			'Парадный вход в один из старейших парков Нижнего Новгорода. Кованая ограда и ворота выполнены в изящном стиле. Начало прогулки по живописной территории.',
	},
	{
		id: 'cp-swiss-2',
		latitude: 56.283142,
		longitude: 43.979393,
		order: 2,
		name: '«Шишка»',
		description:
			'Знаменитый арт-объект парка — гигантская сосновая шишка. Символ лесопарковой зоны «Швейцарии». Любимое место для фото и детских игр.',
	},
	{
		id: 'cp-swiss-3',
		latitude: 56.284516,
		longitude: 43.979744,
		order: 3,
		name: 'Центр «Вега»',
		description:
			'Региональный центр выявления и поддержки одарённых детей. Современное образовательное пространство с лабораториями и кружками. Расположен в красивом здании на территории парка.',
	},
	{
		id: 'cp-swiss-4',
		latitude: 56.284839,
		longitude: 43.976936,
		order: 4,
		name: 'Дендрарий',
		description:
			'Коллекция редких деревьев и кустарников. Прогулочная зона с информационными табличками. Здесь можно увидеть виды растений со всего мира и насладиться тенью в жаркий день.',
	},
	{
		id: 'cp-swiss-5',
		latitude: 56.282586,
		longitude: 43.978185,
		order: 5,
		name: 'Часы обратного отсчёта',
		description:
			'Необычные часы, отсчитывающие время до важных городских событий (Новый год, День города). Популярный интерактивный арт-объект, напоминающий о быстротечности времени.',
	},
	{
		id: 'cp-swiss-6',
		latitude: 56.281885,
		longitude: 43.977914,
		order: 6,
		name: 'Планетарий 1',
		description:
			'Один из куполов обсерватории или планетария в парке «Швейцария». Здесь проводят лекции о космосе и наблюдения за звёздами. Отличное место для семейного досуга.',
	},
	{
		id: 'cp-swiss-7',
		latitude: 56.281939,
		longitude: 43.974442,
		order: 7,
		name: 'Качели',
		description:
			'Большие парковые качели с видом на лесной массив. Уютное место для отдыха и фото. Особенно красиво здесь на закате, когда солнечные лучи проходят сквозь кроны деревьев.',
	},
	{
		id: 'cp-swiss-8',
		latitude: 56.277998,
		longitude: 43.973356,
		order: 8,
		name: 'Смотровая площадка',
		description:
			'Видовая точка парка «Швейцария». Отсюда открывается панорама на Нижний Новгород, заволжские дали и Оку. Обязательное место для остановки в прогулке.',
	},
	{
		id: 'cp-swiss-9',
		latitude: 56.274631,
		longitude: 43.974109,
		order: 9,
		name: 'Оранжерея',
		description:
			'Комплекс оранжерей с экзотическими растениями и цветами. Место для спокойного отдыха и знакомства с флорой разных климатических зон. Часто проводятся выставки цветов.',
	},
	{
		id: 'cp-swiss-10',
		latitude: 56.278254,
		longitude: 43.978874,
		order: 10,
		name: 'Выход',
		description:
			'Завершающая точка маршрута по парку «Швейцария». Рядом удобная транспортная развязка, чтобы уехать в центр города или другие районы.',
	},
];

export const mockRouteSwitzerlandPark: Route = {
	id: ROUTE_UUIDS.SWITZERLAND_PARK,
	name: 'Парк Швейцария',
	distance: 4500,
	checkpoints: switzerlandParkCheckpoints,
	tags: [tags[14], tags[17], tags[18]],
	createdAt: '2024-01-01T00:00:00Z',
};

const cableCarCheckpoints: Checkpoint[] = [
	{
		id: 'cp-cable-1',
		latitude: 56.326,
		longitude: 44.041,
		order: 1,
		name: 'Нижняя станция',
		description: 'Нижний Новгород',
	},
	{
		id: 'cp-cable-2',
		latitude: 56.331,
		longitude: 44.034,
		order: 2,
		name: 'Опора 1',
	},
	{
		id: 'cp-cable-3',
		latitude: 56.336,
		longitude: 44.027,
		order: 3,
		name: 'Опора 2',
	},
	{
		id: 'cp-cable-4',
		latitude: 56.341,
		longitude: 44.02,
		order: 4,
		name: 'Опора 3',
	},
	{
		id: 'cp-cable-5',
		latitude: 56.346,
		longitude: 44.013,
		order: 5,
		name: 'Над Волгой',
	},
	{
		id: 'cp-cable-6',
		latitude: 56.351,
		longitude: 44.006,
		order: 6,
		name: 'Опора 4',
	},
	{
		id: 'cp-cable-7',
		latitude: 56.356,
		longitude: 43.999,
		order: 7,
		name: 'Верхняя станция',
		description: 'Бор',
	},
	{
		id: 'cp-cable-8',
		latitude: 56.351,
		longitude: 44.006,
		order: 8,
		name: 'Обратный путь',
	},
];

export const mockRouteCableCar: Route = {
	id: ROUTE_UUIDS.CABLE_CAR,
	name: 'Канатная дорога',
	distance: 3700,
	checkpoints: cableCarCheckpoints,
	tags: [tags[7], tags[19], tags[20]],
	createdAt: '2024-01-01T00:00:00Z',
};

const rozhdestvenskayaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-rozh-1',
		latitude: 56.327,
		longitude: 44.01,
		order: 1,
		name: 'Площадь Народного Единства',
	},
	{
		id: 'cp-rozh-2',
		latitude: 56.326,
		longitude: 44.008,
		order: 2,
		name: 'Церковь Рождества Иоанна Предтечи',
	},
	{
		id: 'cp-rozh-3',
		latitude: 56.325,
		longitude: 44.006,
		order: 3,
		name: 'Особняки купцов',
	},
	{
		id: 'cp-rozh-4',
		latitude: 56.324,
		longitude: 44.004,
		order: 4,
		name: 'Ресторанная улица',
	},
	{
		id: 'cp-rozh-5',
		latitude: 56.323,
		longitude: 44.002,
		order: 5,
		name: 'Музей Добролюбова',
	},
	{
		id: 'cp-rozh-6',
		latitude: 56.322,
		longitude: 44.0,
		order: 6,
		name: 'Блиновский пассаж',
	},
	{
		id: 'cp-rozh-7',
		latitude: 56.321,
		longitude: 43.998,
		order: 7,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-rozh-8',
		latitude: 56.322,
		longitude: 44.001,
		order: 8,
		name: 'Возврат',
	},
];

export const mockRouteRozhdestvenskaya: Route = {
	id: ROUTE_UUIDS.ROZHDESTVENSKAYA,
	name: 'Рождественская улица',
	distance: 1300,
	checkpoints: rozhdestvenskayaCheckpoints,
	tags: [tags[1], tags[21], tags[22]],
	createdAt: '2024-01-01T00:00:00Z',
};

const pecherskyMonasteryCheckpoints: Checkpoint[] = [
	{
		id: 'cp-pecher-1',
		latitude: 56.305,
		longitude: 44.045,
		order: 1,
		name: 'Вход в монастырь',
	},
	{
		id: 'cp-pecher-2',
		latitude: 56.306,
		longitude: 44.044,
		order: 2,
		name: 'Вознесенский собор',
	},
	{
		id: 'cp-pecher-3',
		latitude: 56.307,
		longitude: 44.043,
		order: 3,
		name: 'Колокольня',
	},
	{
		id: 'cp-pecher-4',
		latitude: 56.308,
		longitude: 44.042,
		order: 4,
		name: 'Монастырские стены',
	},
	{
		id: 'cp-pecher-5',
		latitude: 56.309,
		longitude: 44.044,
		order: 5,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-pecher-6',
		latitude: 56.307,
		longitude: 44.046,
		order: 6,
		name: 'Святые ворота',
	},
	{
		id: 'cp-pecher-7',
		latitude: 56.305,
		longitude: 44.045,
		order: 7,
		name: 'Возврат',
	},
];

export const mockRoutePecherskyMonastery: Route = {
	id: ROUTE_UUIDS.PECHERSKY_MONASTERY,
	name: 'Печерский монастырь',
	distance: 2800,
	checkpoints: pecherskyMonasteryCheckpoints,
	tags: [tags[23], tags[24], tags[2]],
	createdAt: '2024-01-01T00:00:00Z',
};

const sormovskyParkCheckpoints: Checkpoint[] = [
	{
		id: 'cp-sorm-1',
		latitude: 56.354,
		longitude: 43.869,
		order: 1,
		name: 'Главный вход',
	},
	{
		id: 'cp-sorm-2',
		latitude: 56.356,
		longitude: 43.872,
		order: 2,
		name: 'Колесо обозрения',
	},
	{
		id: 'cp-sorm-3',
		latitude: 56.358,
		longitude: 43.875,
		order: 3,
		name: 'Пруды',
	},
	{
		id: 'cp-sorm-4',
		latitude: 56.36,
		longitude: 43.878,
		order: 4,
		name: 'Аттракционы',
	},
	{
		id: 'cp-sorm-5',
		latitude: 56.358,
		longitude: 43.882,
		order: 5,
		name: 'Спортивная зона',
	},
	{
		id: 'cp-sorm-6',
		latitude: 56.355,
		longitude: 43.88,
		order: 6,
		name: 'Кафе',
	},
	{
		id: 'cp-sorm-7',
		latitude: 56.353,
		longitude: 43.875,
		order: 7,
		name: 'Аллея',
	},
	{
		id: 'cp-sorm-8',
		latitude: 56.354,
		longitude: 43.871,
		order: 8,
		name: 'Возврат',
	},
];

export const mockRouteSormovskyPark: Route = {
	id: ROUTE_UUIDS.SORMOVSKY_PARK,
	name: 'Сормовский парк',
	distance: 3800,
	checkpoints: sormovskyParkCheckpoints,
	tags: [tags[14], tags[25], tags[26]],
	createdAt: '2024-01-01T00:00:00Z',
};

const myzaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-myza-1',
		latitude: 56.282,
		longitude: 43.97,
		order: 1,
		name: 'Вход',
	},
	{
		id: 'cp-myza-2',
		latitude: 56.285,
		longitude: 43.975,
		order: 2,
		name: 'Лесная тропа',
	},
	{
		id: 'cp-myza-3',
		latitude: 56.289,
		longitude: 43.98,
		order: 3,
		name: 'Родник',
	},
	{
		id: 'cp-myza-4',
		latitude: 56.293,
		longitude: 43.985,
		order: 4,
		name: 'Поляна',
	},
	{
		id: 'cp-myza-5',
		latitude: 56.297,
		longitude: 43.99,
		order: 5,
		name: 'Смотровая',
	},
	{
		id: 'cp-myza-6',
		latitude: 56.293,
		longitude: 43.995,
		order: 6,
		name: 'Овраг',
	},
	{
		id: 'cp-myza-7',
		latitude: 56.288,
		longitude: 43.985,
		order: 7,
		name: 'Возврат',
	},
];

export const mockRouteMyza: Route = {
	id: ROUTE_UUIDS.MYZA,
	name: 'Лесопарк Мыза',
	distance: 5200,
	checkpoints: myzaCheckpoints,
	tags: [tags[27], tags[17], tags[28]],
	createdAt: '2024-01-01T00:00:00Z',
};

export const mockRouteImages: RouteImage[] = [
	{
		id: 'img-route-1111',
		routeId: ROUTE_UUIDS.KREMLIN,
		imagePath:
			'data:image/jpeg;base64,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',
	},
	{
		id: 'img-route-2222',
		routeId: ROUTE_UUIDS.POKROVSKAYA,
		imagePath:
			'https://nn-grad.ru/images/places/src/Ulica_Bol_shaya_Pokrovskaya_v_Nizhnem_Novgorode_(1).jpg',
	},
	{
		id: 'img-route-3333',
		routeId: ROUTE_UUIDS.FEDOROVSKOGO,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj6jBKQ6BIs_Y1plbAoR3ioY21jhTC0UKaLA&s',
	},
	{
		id: 'img-route-4444',
		routeId: ROUTE_UUIDS.CHKALOV_STAIRS,
		imagePath:
			'https://s12.stc.all.kpcdn.net/russia/wp-content/uploads/2020/11/chkalovskaya-lestnitsa-1330-530x322.jpg',
	},
	{
		id: 'img-route-5555',
		routeId: ROUTE_UUIDS.STRELKA,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLyIheudmsmvwmCS5NQ6syxVyt79RkB_hwWQ&s',
	},
	{
		id: 'img-route-6666',
		routeId: ROUTE_UUIDS.ALEXANDROVSKY_GARDEN,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs0BX_Xl6HB86vpbAauF0caAtmnipM3sfOHg&s',
	},
	{
		id: 'img-route-7777',
		routeId: ROUTE_UUIDS.SWITZERLAND_PARK,
		imagePath:
			'https://www.niann.ru/_data/objects/0059/7115/icon.jpg?1696256476',
	},
	{
		id: 'img-route-8888',
		routeId: ROUTE_UUIDS.CABLE_CAR,
		imagePath:
			'https://s0.rbk.ru/v6_top_pics/media/img/1/77/346842208473771.jpg',
	},
	{
		id: 'img-route-9999',
		routeId: ROUTE_UUIDS.ROZHDESTVENSKAYA,
		imagePath: 'https://nn-grad.ru/images/places/big/8rozhdestv.jpg',
	},
	{
		id: 'img-route-aaaa',
		routeId: ROUTE_UUIDS.PECHERSKY_MONASTERY,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3dBq9z2MYMaxEp7JcwWCsJhDRvwjx5GnQDw&s',
	},
	{
		id: 'img-route-bbbb',
		routeId: ROUTE_UUIDS.SORMOVSKY_PARK,
		imagePath:
			'https://avatars.mds.yandex.net/get-altay/9742646/2a0000018903708f459ea059b28152d8eea1/L_height',
	},
	{
		id: 'img-route-cccc',
		routeId: ROUTE_UUIDS.MYZA,
		imagePath:
			'https://cdn.culture.ru/images/8be1f520-6c45-5820-aec2-39574779a0db',
	},
];

export const mockRoutes: Route[] = [
	mockRouteKremlin,
	mockRoutePokrovskaya,
	mockRouteFedorovskogo,
	mockRouteChkalovStairs,
	mockRouteStrelka,
	mockRouteSwitzerlandPark,
	mockRouteCableCar,
	mockRouteRozhdestvenskaya,
	mockRoutePecherskyMonastery,
	mockRouteSormovskyPark,
	mockRouteMyza,
];

export const getMockRouteById = (id: string): Route | undefined => {
	return mockRoutes.find((route) => route.id === id);
};

export const getRandomMockRoute = (): Route => {
	const randomIndex = Math.floor(Math.random() * mockRoutes.length);
	return mockRoutes[randomIndex];
};

export const getMockRoutesByTag = (tagId: string): Route[] => {
	return mockRoutes.filter((route) =>
		route.tags?.some((tag) => tag.id === tagId)
	);
};

export const getMockRoutesByTagLabel = (tagLabel: string): Route[] => {
	return mockRoutes.filter((route) =>
		route.tags?.some((tag) =>
			tag.label.toLowerCase().includes(tagLabel.toLowerCase())
		)
	);
};

export const searchMockRoutes = (query: string): Route[] => {
	const lowerQuery = query.toLowerCase();
	return mockRoutes.filter((route) =>
		route.name.toLowerCase().includes(lowerQuery)
	);
};

export const getRouteImage = (routeId: string): string | undefined => {
	const image = mockRouteImages.find((img) => img.routeId === routeId);
	return image?.imagePath;
};
