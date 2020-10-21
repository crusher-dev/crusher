$(function () {
	'use strict';

	var ctxLabel = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	var ctxData1 = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30];
	var ctxData2 = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20];
	var ctxColor1 = '#001737';
	var ctxColor2 = '#1ce1ac';

	// Bar chart
	var ctx1 = document.getElementById('chartBar1').getContext('2d');
	new Chart(ctx1, {
		type: 'bar',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					backgroundColor: ctxColor1,
				},
				{
					data: ctxData2,
					backgroundColor: ctxColor2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							fontColor: '#182b49',
							max: 80,
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							display: false,
						},
						barPercentage: 0.6,
						ticks: {
							beginAtZero: true,
							fontSize: 11,
							fontColor: '#182b49',
						},
					},
				],
			},
		},
	});

	// Horizontal bar chart
	var ctx2 = document.getElementById('chartBar2').getContext('2d');
	new Chart(ctx2, {
		type: 'horizontalBar',
		data: {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
			datasets: [
				{
					data: [20, 60, 50, 45, 50, 60],
					backgroundColor: ctxColor1,
				},
				{
					data: [10, 40, 30, 40, 60, 55],
					backgroundColor: ctxColor2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						gridLines: {
							display: false,
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							fontColor: '#182b49',
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							color: '#e5e9f2',
						},
						barPercentage: 0.6,
						ticks: {
							beginAtZero: true,
							fontSize: 11,
							fontColor: '#182b49',
							max: 100,
						},
					},
				],
			},
		},
	});

	// Stacked chart
	var ctx3 = document.getElementById('chartBar3').getContext('2d');
	new Chart(ctx3, {
		type: 'bar',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					backgroundColor: ctxColor1,
				},
				{
					data: ctxData2,
					backgroundColor: ctxColor2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						stacked: true,
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							fontColor: '#182b49',
						},
					},
				],
				xAxes: [
					{
						stacked: true,
						gridLines: {
							display: false,
						},
						barPercentage: 0.6,
						ticks: {
							beginAtZero: true,
							fontSize: 11,
							fontColor: '#182b49',
						},
					},
				],
			},
		},
	});

	// Line chart
	var ctx4 = document.getElementById('chartLine1');
	new Chart(ctx4, {
		type: 'line',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					borderColor: ctxColor1,
					borderWidth: 1,
					fill: false,
				},
				{
					data: ctxData2,
					borderColor: ctxColor2,
					borderWidth: 1,
					fill: false,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							max: 80,
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							display: false,
						},
						ticks: {
							beginAtZero: true,
							fontSize: 11,
						},
					},
				],
			},
		},
	});

	// Area chart
	var ctx5 = document.getElementById('chartArea1');
	new Chart(ctx5, {
		type: 'line',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					borderColor: ctxColor1,
					borderWidth: 1,
					backgroundColor: 'rgba(0,23,55, .5)',
				},
				{
					data: ctxData2,
					borderColor: ctxColor2,
					borderWidth: 1,
					backgroundColor: 'rgba(28,225,172, .5)',
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						stacked: true,
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
						},
					},
				],
				xAxes: [
					{
						stacked: true,
						gridLines: {
							display: false,
						},
						ticks: {
							beginAtZero: true,
							fontSize: 11,
						},
					},
				],
			},
		},
	});

	// With transparency
	var ctx6 = document.getElementById('chartBar4').getContext('2d');
	new Chart(ctx6, {
		type: 'bar',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					backgroundColor: 'rgba(0,23,55, .5)',
				},
				{
					data: ctxData2,
					backgroundColor: 'rgba(28,225,172, .5)',
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							fontColor: '#182b49',
							max: 80,
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							display: false,
						},
						barPercentage: 0.6,
						ticks: {
							beginAtZero: true,
							fontSize: 11,
							fontColor: '#182b49',
						},
					},
				],
			},
		},
	});

	// With gradient
	var ctx7 = document.getElementById('chartBar5').getContext('2d');

	var gradient1 = ctx7.createLinearGradient(0, 350, 0, 0);
	gradient1.addColorStop(0, '#001737');
	gradient1.addColorStop(1, '#ff5087');

	var gradient2 = ctx7.createLinearGradient(0, 400, 0, 0);
	gradient2.addColorStop(0, '#ff5087');
	gradient2.addColorStop(1, '#1ce1ac');

	new Chart(ctx7, {
		type: 'bar',
		data: {
			labels: ctxLabel,
			datasets: [
				{
					data: ctxData1,
					backgroundColor: gradient1,
				},
				{
					data: ctxData2,
					backgroundColor: gradient2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false,
				},
			},
			scales: {
				yAxes: [
					{
						gridLines: {
							color: '#e5e9f2',
						},
						ticks: {
							beginAtZero: true,
							fontSize: 10,
							fontColor: '#182b49',
							max: 80,
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							display: false,
						},
						barPercentage: 0.6,
						ticks: {
							beginAtZero: true,
							fontSize: 11,
							fontColor: '#182b49',
						},
					},
				],
			},
		},
	});

	/** PIE CHART **/
	var datapie = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
		datasets: [
			{
				data: [20, 20, 30, 5, 25],
				backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
			},
		],
	};

	var optionpie = {
		maintainAspectRatio: false,
		responsive: true,
		legend: {
			display: false,
		},
		animation: {
			animateScale: true,
			animateRotate: true,
		},
	};

	// For a doughnut chart
	var ctx8 = document.getElementById('chartPie');
	var myPieChart = new Chart(ctx8, {
		type: 'doughnut',
		data: datapie,
		options: optionpie,
	});

	// For a pie chart
	var ctx9 = document.getElementById('chartDonut');
	var myDonutChart = new Chart(ctx9, {
		type: 'pie',
		data: datapie,
		options: optionpie,
	});
});
