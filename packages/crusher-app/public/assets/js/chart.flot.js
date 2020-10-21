$(function () {
	'use strict';

	// Bar Chart
	$.plot(
		'#flotBar',
		[
			{
				data: flotSampleData1,
				color: '#ff5087',
			},
		],
		{
			series: {
				bars: {
					show: true,
					lineWidth: 0,
					barWidth: 0.5,
					fill: 1,
				},
			},
			grid: {
				borderWidth: 1,
				borderColor: '#edeff6',
			},
			yaxis: {
				max: 60,
				tickColor: '#edeff6',
				ticks: 4,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				max: 30,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Stacked Chart
	$.plot(
		'#flotStack',
		[
			{
				data: flotSampleData1,
				color: '#00275e',
			},
			{
				data: flotSampleData2,
				color: '#ff5087',
			},
		],
		{
			series: {
				stack: 0,
				bars: {
					show: true,
					lineWidth: 0,
					barWidth: 0.5,
					fill: 1,
				},
			},
			grid: {
				borderWidth: 1,
				borderColor: '#edeff6',
			},
			yaxis: {
				max: 120,
				tickColor: '#edeff6',
				ticks: 6,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				min: 0,
				max: 30,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Line Chart
	$.plot(
		'#flotLine',
		[
			{
				data: flotSampleData1,
				color: '#00275e',
			},
			{
				data: flotSampleData2,
				color: '#ff5087',
			},
		],
		{
			series: {
				lines: {
					show: true,
					lineWidth: 2,
				},
				shadowSize: 0,
			},
			grid: {
				hoverable: true,
				clickable: true,
				borderColor: '#ddd',
				borderWidth: 0,
				labelMargin: 5,
			},
			yaxis: {
				max: 80,
				tickColor: '#edeff6',
				ticks: 6,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				min: 0,
				max: 60,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Area Chart
	$.plot(
		'#flotArea',
		[
			{
				data: flotSampleData1,
				color: '#ff5087',
			},
			{
				data: flotSampleData2,
				color: '#30e3ca',
			},
		],
		{
			series: {
				stack: 0,
				lines: {
					show: true,
					lineWidth: 0,
					fill: 1,
				},
				shadowSize: 0,
			},
			grid: {
				hoverable: true,
				clickable: true,
				borderColor: '#ddd',
				borderWidth: 0,
				labelMargin: 5,
			},
			yaxis: {
				max: 120,
				tickColor: '#edeff6',
				ticks: 6,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				min: 0,
				max: 100,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Thresholds
	$.plot(
		'#flotThresholds',
		[
			{
				data: flotSampleData3,
				color: '#ff5087',
			},
		],
		{
			series: {
				threshold: {
					below: 0,
					color: '#d0d6dd',
				},
				bars: {
					show: true,
					lineWidth: 0,
					barWidth: 0.5,
					fill: 1,
				},
			},
			grid: {
				borderWidth: 1,
				borderColor: '#edeff6',
			},
			yaxis: {
				tickColor: '#edeff6',
				ticks: 6,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				min: 0,
				max: 40,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Percentiles
	var dataset = [
		{
			label: 'Female mean',
			data: females['mean'],
			lines: {
				show: true,
			},
			color: '#ff5087',
		},
		{
			id: 'f15%',
			data: females['15%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: false,
			},
			color: '#ff5087',
		},
		{
			id: 'f25%',
			data: females['25%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.2,
			},
			color: '#ff5087',
			fillBetween: 'f15%',
		},
		{
			id: 'f50%',
			data: females['50%'],
			lines: {
				show: true,
				lineWidth: 0.5,
				fill: 0.4,
				shadowSize: 0,
			},
			color: '#ff5087',
			fillBetween: 'f25%',
		},
		{
			id: 'f75%',
			data: females['75%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.4,
			},
			color: '#ff5087',
			fillBetween: 'f50%',
		},
		{
			id: 'f85%',
			data: females['85%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.2,
			},
			color: '#ff5087',
			fillBetween: 'f75%',
		},

		{
			label: 'Male mean',
			data: males['mean'],
			lines: {
				show: true,
			},
			color: '#1ce1ac',
		},
		{
			id: 'm15%',
			data: males['15%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: false,
			},
			color: '#1ce1ac',
		},
		{
			id: 'm25%',
			data: males['25%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.2,
			},
			color: '#1ce1ac',
			fillBetween: 'm15%',
		},
		{
			id: 'm50%',
			data: males['50%'],
			lines: {
				show: true,
				lineWidth: 0.5,
				fill: 0.4,
				shadowSize: 0,
			},
			color: '#1ce1ac',
			fillBetween: 'm25%',
		},
		{
			id: 'm75%',
			data: males['75%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.4,
			},
			color: '#1ce1ac',
			fillBetween: 'm50%',
		},
		{
			id: 'm85%',
			data: males['85%'],
			lines: {
				show: true,
				lineWidth: 0,
				fill: 0.2,
			},
			color: '#1ce1ac',
			fillBetween: 'm75%',
		},
	];

	$.plot('#flotPercentiles', dataset, {
		grid: {
			borderWidth: 1,
			borderColor: '#edeff6',
		},
		legend: { show: false },
		xaxis: {
			tickDecimals: 0,
			tickColor: '#edeff6',
			font: {
				color: '#001737',
				size: 10,
			},
		},
		yaxis: {
			font: {
				color: '#001737',
				size: 10,
			},
			tickColor: '#edeff6',
		},
	});

	// With crosshair
	$.plot(
		'#flotCrosshair',
		[
			{
				data: flotSampleData2,
				color: '#ff5087',
			},
		],
		{
			series: {
				lines: {
					show: true,
					lineWidth: 2,
				},
				shadowSize: 0,
			},
			crosshair: {
				mode: 'xy',
			},
			grid: {
				hoverable: true,
				clickable: true,
				borderColor: '#ddd',
				borderWidth: 0,
				labelMargin: 5,
			},
			yaxis: {
				max: 120,
				tickColor: '#edeff6',
				ticks: 6,
				font: {
					color: '#001737',
					size: 10,
				},
			},
			xaxis: {
				min: 0,
				max: 100,
				tickColor: '#edeff6',
				font: {
					color: '#001737',
					size: 10,
				},
			},
		},
	);

	// Pie Chart
	$.plot('#flotPie', pieData1, {
		series: {
			pie: {
				show: true,
			},
		},
	});

	// Donut Chart
	$.plot('#flotDonut', pieData1, {
		series: {
			pie: {
				innerRadius: 0.5,
				show: true,
			},
		},
	});
});
