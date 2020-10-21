// sample calendar events data

'use strict';

var curYear = moment().format('YYYY');
var curMonth = moment().format('MM');

// Calendar Event Source
var calendarEvents = {
	id: 1,
	backgroundColor: '#d9e8ff',
	borderColor: '#ff5087',
	events: [
		{
			id: '1',
			start: curYear + '-' + curMonth + '-08T08:30:00',
			end: curYear + '-' + curMonth + '-08T13:00:00',
			title: 'ThemeForest Meetup',
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '2',
			start: curYear + '-' + curMonth + '-10T09:00:00',
			end: curYear + '-' + curMonth + '-10T17:00:00',
			title: 'Design Review',
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '3',
			start: curYear + '-' + curMonth + '-13T12:00:00',
			end: curYear + '-' + curMonth + '-13T18:00:00',
			title: 'Lifestyle Conference',
			description:
				'Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi...',
		},
		{
			id: '4',
			start: curYear + '-' + curMonth + '-15T07:30:00',
			end: curYear + '-' + curMonth + '-15T15:30:00',
			title: 'Team Weekly Brownbag',
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '5',
			start: curYear + '-' + curMonth + '-17T10:00:00',
			end: curYear + '-' + curMonth + '-19T15:00:00',
			title: 'Music Festival',
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '6',
			start: curYear + '-' + curMonth + '-08T13:00:00',
			end: curYear + '-' + curMonth + '-08T18:30:00',
			title: "Attend Lea's Wedding",
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
	],
};

// Birthday Events Source
var birthdayEvents = {
	id: 2,
	backgroundColor: '#c3edd5',
	borderColor: '#10b759',
	events: [
		{
			id: '7',
			start: curYear + '-' + curMonth + '-01T18:00:00',
			end: curYear + '-' + curMonth + '-01T23:30:00',
			title: 'Socrates Birthday',
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '8',
			start: curYear + '-' + curMonth + '-21T15:00:00',
			end: curYear + '-' + curMonth + '-21T21:00:00',
			title: "Reynante's Birthday",
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
		{
			id: '9',
			start: curYear + '-' + curMonth + '-23T15:00:00',
			end: curYear + '-' + curMonth + '-23T21:00:00',
			title: "Pauline's Birthday",
			description:
				'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
		},
	],
};

var holidayEvents = {
	id: 3,
	backgroundColor: '#fcbfdc',
	borderColor: '#f10075',
	events: [
		{
			id: '10',
			start: curYear + '-' + curMonth + '-04',
			end: curYear + '-' + curMonth + '-06',
			title: 'Feast Day',
		},
		{
			id: '11',
			start: curYear + '-' + curMonth + '-26',
			end: curYear + '-' + curMonth + '-27',
			title: 'Memorial Day',
		},
		{
			id: '12',
			start: curYear + '-' + curMonth + '-28',
			end: curYear + '-' + curMonth + '-29',
			title: "Veteran's Day",
		},
	],
};

var discoveredEvents = {
	id: 4,
	backgroundColor: '#bff2f2',
	borderColor: '#00cccc',
	events: [
		{
			id: '13',
			start: curYear + '-' + curMonth + '-17T08:00:00',
			end: curYear + '-' + curMonth + '-18T11:00:00',
			title: 'Web Design Workshop Seminar',
		},
	],
};

var meetupEvents = {
	id: 5,
	backgroundColor: '#dedafe',
	borderColor: '#5b47fb',
	events: [
		{
			id: '14',
			start: curYear + '-' + curMonth + '-03',
			end: curYear + '-' + curMonth + '-05',
			title: 'UI/UX Meetup Conference',
		},
		{
			id: '15',
			start: curYear + '-' + curMonth + '-18',
			end: curYear + '-' + curMonth + '-20',
			title: 'Angular Conference Meetup',
		},
	],
};

var otherEvents = {
	id: 6,
	backgroundColor: '#ffdec4',
	borderColor: '#fd7e14',
	events: [
		{
			id: '16',
			start: curYear + '-' + curMonth + '-06',
			end: curYear + '-' + curMonth + '-08',
			title: 'My Rest Day',
		},
		{
			id: '17',
			start: curYear + '-' + curMonth + '-29',
			end: curYear + '-' + curMonth + '-31',
			title: 'My Rest Day',
		},
	],
};
