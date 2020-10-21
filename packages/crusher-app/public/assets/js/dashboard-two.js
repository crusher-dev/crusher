$(function () {
	'use strict';

	var ctx1 = document.getElementById('chartBar1').getContext('2d');
	var ctxChart1 = new Chart(ctx1, {
		type: 'bar',
		data: {
			labels: [
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
			],
			datasets: [
				{
					data: [150, 110, 90, 115, 125, 160, 160, 140, 100, 110, 120, 120],
					backgroundColor: '#66a4fb',
				},
				{
					data: [180, 140, 120, 135, 155, 170, 180, 150, 140, 150, 130, 130],
					backgroundColor: '#65e0e0',
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
				xAxes: [
					{
						display: false,
						barPercentage: 0.5,
					},
				],
				yAxes: [
					{
						gridLines: {
							color: '#ebeef3',
						},
						ticks: {
							fontColor: '#8392a5',
							fontSize: 10,
							min: 80,
							max: 200,
						},
					},
				],
			},
		},
	});

	/** PIE CHART **/
	var datapie = {
		labels: ['Organic Search', 'Email', 'Referral', 'Social Media'],
		datasets: [
			{
				data: [20, 20, 30, 25],
				backgroundColor: ['#f77eb9', '#7ebcff', '#7ee5e5', '#fdbd88'],
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

	// For a pie chart
	var ctx2 = document.getElementById('chartDonut');
	var myDonutChart = new Chart(ctx2, {
		type: 'doughnut',
		data: datapie,
		options: optionpie,
	});

	var flotChart1 = $.plot(
		'#flotChart1',
		[
			{
				data: df1,
				color: '#c0ccda',
				lines: {
					fill: true,
					fillColor: '#f5f6fa',
				},
			},
			{
				data: df3,
				color: '#ff5087',
				lines: {
					fill: true,
					fillColor: '#d1e6fa',
				},
			},
		],
		{
			series: {
				shadowSize: 0,
				lines: {
					show: true,
					lineWidth: 1.5,
				},
			},
			grid: {
				borderWidth: 0,
				labelMargin: 0,
			},
			yaxis: {
				show: false,
				max: 65,
			},
			xaxis: {
				show: false,
				min: 40,
				max: 100,
			},
		},
	);

	var flotChart2 = $.plot(
		'#flotChart2',
		[
			{
				data: df2,
				color: '#66a4fb',
				lines: {
					show: true,
					lineWidth: 1.5,
					fill: 0.03,
				},
			},
			{
				data: df1,
				color: '#00cccc',
				lines: {
					show: true,
					lineWidth: 1.5,
					fill: true,
					fillColor: '#fff',
				},
			},
			{
				data: df3,
				color: '#e3e7ed',
				bars: {
					show: true,
					lineWidth: 0,
					barWidth: 0.5,
					fill: 1,
				},
			},
		],
		{
			series: {
				shadowSize: 0,
			},
			grid: {
				aboveData: true,
				color: '#e5e9f2',
				borderWidth: {
					top: 0,
					right: 1,
					bottom: 1,
					left: 1,
				},
				labelMargin: 0,
			},
			yaxis: {
				show: false,
				min: 0,
				max: 100,
			},
			xaxis: {
				show: true,
				min: 40,
				max: 80,
				ticks: 6,
				tickColor: 'rgba(0,0,0,0.04)',
			},
		},
	);

	var df3data1 = [
		[0, 12],
		[1, 10],
		[2, 7],
		[3, 11],
		[4, 15],
		[5, 20],
		[6, 22],
		[7, 19],
		[8, 18],
		[9, 20],
		[10, 17],
		[11, 19],
		[12, 18],
		[13, 14],
		[14, 9],
	];
	var df3data2 = [
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 2],
		[4, 5],
		[5, 2],
		[6, 12],
		[7, 15],
		[8, 10],
		[9, 8],
		[10, 10],
		[11, 7],
		[12, 2],
		[13, 4],
		[14, 0],
	];
	var df3data3 = [
		[0, 2],
		[1, 1],
		[2, 2],
		[3, 4],
		[4, 2],
		[5, 1],
		[6, 0],
		[7, 0],
		[8, 5],
		[9, 2],
		[10, 8],
		[11, 6],
		[12, 9],
		[13, 2],
		[14, 0],
	];
	var df3data4 = [
		[0, 0],
		[1, 5],
		[2, 2],
		[3, 0],
		[4, 2],
		[5, 7],
		[6, 10],
		[7, 12],
		[8, 8],
		[9, 6],
		[10, 4],
		[11, 2],
		[12, 0],
		[13, 0],
		[14, 0],
	];

	var flotChartOption1 = {
		series: {
			shadowSize: 0,
			bars: {
				show: true,
				lineWidth: 0,
				barWidth: 0.5,
				fill: 1,
			},
		},
		grid: {
			aboveData: true,
			color: '#e5e9f2',
			borderWidth: 0,
			labelMargin: 0,
		},
		yaxis: {
			show: false,
			min: 0,
			max: 25,
		},
		xaxis: {
			show: false,
		},
	};

	var flotChart3 = $.plot(
		'#flotChart3',
		[
			{
				data: df3data1,
				color: '#e5e9f2',
			},
			{
				data: df3data2,
				color: '#66a4fb',
			},
		],
		flotChartOption1,
	);

	var flotChart4 = $.plot(
		'#flotChart4',
		[
			{
				data: df3data1,
				color: '#e5e9f2',
			},
			{
				data: df3data3,
				color: '#7ee5e5',
			},
		],
		flotChartOption1,
	);

	var flotChart5 = $.plot(
		'#flotChart5',
		[
			{
				data: df3data1,
				color: '#e5e9f2',
			},
			{
				data: df3data4,
				color: '#f77eb9',
			},
		],
		flotChartOption1,
	);

	window.darkMode = function () {
		ctxChart1.options.scales.yAxes[0].gridLines.color = 'rgba(255,255,255,.06)';
		ctxChart1.update();

		myDonutChart.options.elements.arc.borderColor = '#141c2b';
		myDonutChart.update();

		var f1 = flotChart1.getData();
		f1[0].lines.fillColor = 'rgba(255,255,255, .1)';
		f1[1].lines.fillColor = 'rgba(1,104,250, .3)';
		flotChart1.setData(f1);
		flotChart1.setupGrid();
		flotChart1.draw();

		var f2 = flotChart2.getOptions();
		var d2 = flotChart2.getData();
		d2[1].lines.fillColor = '#3b4863';
		flotChart2.setData(d2);
		f2.grid.borderColor = 'rgba(255,255,255,.1)';
		f2.xaxes[0].tickColor = 'rgba(255,255,255,.06)';
		flotChart2.setupGrid();
		flotChart2.draw();

		var f3 = flotChart3.getData();
		f3[0].color = '#3b4863';
		flotChart3.setData(f3);
		flotChart3.setupGrid();
		flotChart3.draw();

		var f4 = flotChart4.getData();
		f4[0].color = '#3b4863';
		flotChart4.setData(f4);
		flotChart4.setupGrid();
		flotChart4.draw();

		var f5 = flotChart5.getData();
		f5[0].color = '#3b4863';
		flotChart5.setData(f5);
		flotChart5.setupGrid();
		flotChart5.draw();

		$('.progress.op-5').removeClass('op-5');
		$('.btn-white').addClass('btn-dark').removeClass('btn-white');
	};

	window.lightMode = function () {
		ctxChart1.options.scales.yAxes[0].gridLines.color = '#ebeef3';
		ctxChart1.update();

		myDonutChart.options.elements.arc.borderColor = '#fff';
		myDonutChart.update();

		var f1 = flotChart1.getData();
		f1[0].lines.fillColor = '#f5f6fa';
		f1[1].lines.fillColor = '#d1e6fa';
		flotChart1.setData(f1);
		flotChart1.setupGrid();
		flotChart1.draw();

		var f2 = flotChart2.getOptions();
		f2.grid.borderColor = '#e5e9f2';
		f2.xaxes[0].tickColor = 'rgba(0,0,0,.04)';
		flotChart2.setupGrid();
		flotChart2.draw();

		var f3 = flotChart3.getData();
		f3[0].color = '#e5e9f2';
		flotChart3.setData(f3);
		flotChart3.setupGrid();
		flotChart3.draw();

		var f4 = flotChart4.getData();
		f4[0].color = '#e5e9f2';
		flotChart4.setData(f4);
		flotChart4.setupGrid();
		flotChart4.draw();

		var f5 = flotChart5.getData();
		f5[0].color = '#e5e9f2';
		flotChart5.setData(f5);
		flotChart5.setupGrid();
		flotChart5.draw();

		$('.btn-dark').addClass('btn-white').removeClass('btn-dark');
		$('.progress.op-5').addClass('op-5');
	};

	var hasMode = Cookies.get('df-mode');
	if (hasMode === 'dark') {
		darkMode();
	} else {
		lightMode();
	}
});
