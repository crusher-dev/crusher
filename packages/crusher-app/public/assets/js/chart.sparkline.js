$(function () {
	'use strict';

	/***************** LINE CHARTS *****************/
	$('#sparkline1').sparkline('html', {
		width: 200,
		height: 70,
		lineColor: '#0083CD',
		fillColor: false,
		tooltipContainer: $('.az-content'),
	});

	$('#sparkline2').sparkline('html', {
		width: 200,
		height: 70,
		lineColor: '#B654C3',
		fillColor: false,
	});

	/************** AREA CHARTS ********************/
	$('#sparkline3').sparkline('html', {
		width: 200,
		height: 70,
		lineColor: '#0083CD',
		fillColor: 'rgba(0,131,205,0.2)',
	});

	$('#sparkline4').sparkline('html', {
		width: 200,
		height: 70,
		lineColor: '#B654C3',
		fillColor: 'rgba(182,84,195,0.2)',
	});

	/******************* BAR CHARTS *****************/

	$('#sparkline5').sparkline('html', {
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#560bd0',
		chartRangeMax: 12,
	});

	$('#sparkline6').sparkline('html', {
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#007bff',
		chartRangeMax: 12,
	});

	/***************** STACKED BAR CHARTS ****************/

	$('#sparkline7').sparkline('html', {
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#007bff',
		chartRangeMax: 12,
	});

	$('#sparkline7').sparkline([4, 5, 6, 7, 4, 5, 8, 7, 6, 6, 4, 7, 6, 4, 7], {
		composite: true,
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#560bd0',
		chartRangeMax: 12,
	});

	$('#sparkline8').sparkline('html', {
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#007bff',
		chartRangeMax: 12,
	});

	$('#sparkline8').sparkline([4, 5, 6, 7, 4, 5, 8, 7, 6, 6, 4, 7, 6, 4, 7], {
		composite: true,
		type: 'bar',
		barWidth: 10,
		height: 70,
		barColor: '#f10075',
		chartRangeMax: 12,
	});

	/**************** PIE CHART ****************/

	$('#sparkline9').sparkline('html', {
		type: 'pie',
		width: 70,
		height: 70,
		sliceColors: ['#560bd0', '#007bff', '#00cccc'],
	});

	$('#sparkline10').sparkline('html', {
		type: 'pie',
		width: 70,
		height: 70,
		sliceColors: [
			'#560bd0',
			'#007bff',
			'#00cccc',
			'#f10075',
			'#74de00',
			'#494c57',
		],
	});
});
