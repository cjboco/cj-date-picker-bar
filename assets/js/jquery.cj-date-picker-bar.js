/*global jQuery*/
/*
 * CJ Date Navigation Bar
 *
 * Copyright (c) 2012 Creative Juices Bo. Co.
 * Written by: Doug Jones (www.cjboco.com)
 * Licensed under the MIT.
 *
 * A jQuery plugin to display a horizontal date picker bar to allow quick and easy date selection.
 * Returns a JS date object.
 *
 *   2.2 - Added days option.
 *   2.1 - Added redefined onLoad/onClick methods.
 *   2.0 - Renamed function to reflect project name.
 *         Added min and max date settings. (Overides showFuture)
 *         Updated internal isDate() function.
 *         File & document cleanup.
 *   1.1 - Added ability to prevent future dates.
 *   1.0 - initial release
 *
 * @Maybe add the ability to set return date format (i.e. mm/dd/yyyy, etc)
 */
(function ($) {
	"use strict";

	$.cjDatePickerBar = function ($obj, settings) {

		var opts = {
				date: null,
				dateMin: null,
				dateMax: null,
				bigInc: 10,
				tinyInc: 5,
				monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				showInc: false,
				showFuture: true,
				showDays: false,
				callback: null,
				onLoad: null,
				onClick: null
			},
			isDate = function (date) {
				var d = date ? new Date(date.toString()) : null;
				return (d !== null) && !isNaN(d) && (d.getDate() !== undefined);
			},
			daysInMonth = function(year, month) {
				var s = new Date(year, month, 1),
					e = new Date(year, month + 1, 1),
					days = parseInt((e - s) / (1000 * 60 * 60 * 24), 10);
				return days;
			};

		Date.prototype.daysInMonth = function() {
			return daysInMonth(this.getFullYear(), this.getMonth());
		};

		function setDateNav(d, m, y, clb) {

			var cdate = $obj.data('cdate');

			// start off with everything disabled. (We do date checks below)
			$obj.find('button').addClass('ui-state-disabled').attr('disabled', 'disabled');

			// check to see if our object exists and date is set
			if ($obj.length > 0 && cdate) {

				// grab current date and check passed arguments.
				cdate = new Date(cdate);
				if (!d || d === undefined) {
					d = cdate.getDate();
				}
				if (!m || m === undefined) {
					m = cdate.getMonth() + 1;
				}
				if (!y || y === undefined) {
					y = cdate.getFullYear();
				}

				// remove highlight from day & month buttons
				$obj.find('.nav-days button.ui-state-focus, .nav-months button.ui-state-focus').removeClass('ui-state-focus');

				// make sure our date is valid
				if (cdate && isDate(cdate)) {

					// determine the year offset amount
					if (y) {
						switch (y) {
						case 'prevbig':
							cdate.setFullYear(cdate.getFullYear() - opts.bigInc);
							break;
						case 'prevtiny':
							cdate.setFullYear(cdate.getFullYear() - opts.tinyInc);
							break;
						case 'prev':
							cdate.setFullYear(cdate.getFullYear() - 1);
							break;
						case 'nextbig':
							cdate.setFullYear(cdate.getFullYear() + opts.bigInc);
							break;
						case 'nexttiny':
							cdate.setFullYear(cdate.getFullYear() + opts.tinyInc);
							break;
						case 'next':
							cdate.setFullYear(cdate.getFullYear() + 1);
							break;
						default:
							break;
						}
					}

					// update the date month offset
					cdate.setMonth(parseInt(m, 10) - 1);

					// update the date day
					cdate.setDate(d);

					// update the buttons

					$obj.find('.nav-days button[data-day="' + d + '"]').addClass('ui-state-focus');
					$obj.find('.nav-months button[data-month="' + m + '"]').addClass('ui-state-focus');
					$obj.find('.nav-years button[data-inc="prevbig"]').attr('data-year', cdate.getFullYear() - opts.bigInc);
					$obj.find('.nav-years button[data-inc="prevtiny"]').attr('data-year', cdate.getFullYear() - opts.tinyInc);
					$obj.find('.nav-years button[data-inc="prev"]').attr('data-year', cdate.getFullYear() - 1).text(cdate.getFullYear() - 1);
					$obj.find('.nav-years button[data-inc="current"]').attr('data-year', cdate.getFullYear()).text(cdate.getFullYear());
					$obj.find('.nav-years button[data-inc="next"]').attr('data-year', cdate.getFullYear() + 1).text(cdate.getFullYear() + 1);
					$obj.find('.nav-years button[data-inc="nexttiny"]').attr('data-year', cdate.getFullYear() + opts.tinyInc);
					$obj.find('.nav-years button[data-inc="nextbig"]').attr('data-year', cdate.getFullYear() + opts.bigInc);

					// only activate buttons that fall withing our date range (if provided)
					if (isDate(opts.dateMin) || isDate(opts.dateMax)) {

						// check the current date and make sure it's withing our range
						cdate = cdate < opts.dateMin ? opts.dateMin : cdate;
						cdate = cdate > opts.dateMax ? opts.dateMax : cdate;

						// check the day buttons
						$obj.find('.cj-button-day').each(function() {
							var $this = $(this),
								bd = new Date((cdate.getMonth() + 1) + '/' + $this.attr('data-day') + '/' + cdate.getFullYear());
							if (isDate(bd) && !isDate(opts.dateMin) && isDate(opts.dateMax) && bd <= opts.dateMax) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							} else if (isDate(bd) && isDate(opts.dateMin) && bd >= opts.dateMin && isDate(opts.dateMax) && bd <= opts.dateMax) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							}
						});

						// check the month buttons
						$obj.find('.cj-button-month').each(function() {
							var $this = $(this),
								bd = new Date(parseInt($this.attr('data-month'), 10) + '/1/' + cdate.getFullYear());
							if (isDate(bd) && !isDate(opts.dateMin) && isDate(opts.dateMax) && bd <= opts.dateMax) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							} else if (isDate(bd) && isDate(opts.dateMin) && bd >= opts.dateMin && isDate(opts.dateMax) && bd <= opts.dateMax) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							}
						});

						// check the year buttons
						$obj.find('.cj-button-year').each(function() {
							var $this = $(this),
								bd = parseInt($this.attr('data-year'), 10);
							if (!isDate(opts.dateMin) && isDate(opts.dateMax) && bd <= opts.dateMax.getFullYear()) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							} else if (isDate(opts.dateMin) && bd >= opts.dateMin.getFullYear() && isDate(opts.dateMax) && bd <= opts.dateMax.getFullYear()) {
								$this.removeClass('ui-state-disabled').removeAttr('disabled');
							}
						});

					} else {

						// no date check so activate everything
						$obj.find('.cj-button-month,.cj-button-year').removeClass('ui-state-disabled').removeAttr('disabled');

					}

					// save out current date
					$obj.data('cdate', cdate);

					if ($.isFunction(clb)) {
						clb.call($obj.get(0), cdate);
					} else if ($.isFunction(opts.callback)) {
						// this is legacy support and will be remove
						opts.callback.call($obj.get(0), cdate);
					}
				}
			}
		}

		function initDateNav() {

			var d, i, $d, $m, $y;

			// check to see if our object exists
			if ($obj.length > 0) {

				// check to see if the user supplied a min or
				// max date. Double check if they are valid dates
				// and set properly. If not, set to null.
				opts.dateMin = opts.dateMin ? new Date(opts.dateMin) : null;
				if (!isDate(opts.dateMin)) {
					opts.dateMin = null;
				}
				opts.dateMax = opts.dateMax ? new Date(opts.dateMax) : null;
				if (!isDate(opts.dateMax)) {
					opts.dateMax = null;
				}
				if (isDate(opts.dateMin) && isDate(opts.dateMax) && opts.dateMax < opts.dateMin) {
					throw('Invalid min or max date.');
				}

				// set the max date to the current date, if dateMin and dateMax
				// are null and opts.showFuture is set to false.
				if (!opts.dateMin && !opts.dateMax && !opts.showFuture) {
					 opts.dateMax = new Date();
				}

				// check to see if the user supplied a date to use.
				// If not, create one and set to current date.
				d = isDate(opts.date) ? new Date(opts.date) : new Date();

				// check the current date, if it's less than or greater
				// than the min/max dates, set appropriately
				if (opts.dateMin && d < opts.dateMin) {
					d = opts.dateMin;
				} else if (opts.dateMax && d > opts.dateMax) {
					d = opts.dateMax;
				}

				// save out date object for reference
				$obj.data('cdate', d);

				// create the navigation bar DOM
				$obj.html('').hide().append('<span class="nav-months cj-buttonset"></span><span class="nav-years cj-buttonset"></span>' + (opts.showDays ? '<span class="nav-days cj-buttonset"></span>' : ''));
				$m = $obj.find('.nav-months');
				$y = $obj.find('.nav-years');
				$d = $obj.find('.nav-days');

				// do we need to show the days? if so, create day buttons and bind click events
				if (opts.showDays) {
					// create the month buttons
					for (i = 1; i <= d.daysInMonth(); i++) {
						$d.append('<button class="cj-button cj-button-day ui-state-default ui-corner-all" data-day="' + i + '">' + i + '</button>');
					}
					$obj.find('.nav-days button').on('click', function () {
						var $this = $(this),
							cdate = new Date($obj.data('cdate'));
						setDateNav($this.attr('data-day'), cdate.getMonth() + 1, cdate.getFullYear(), function(cdate) {
							if ($.isFunction(opts.onClick)) {
								opts.onClick.call($obj.get(0), cdate);
							}
						});
					});
				}

				// create the month buttons
				for (i = 1; i <= 12; i++) {
					d = new Date(i + '/1/' + d.getFullYear());
					$m.append('<button class="cj-button cj-button-month ui-state-default ui-corner-all" data-month="' + i + '">' + opts.monthNames[d.getMonth()] + '</button>');
				}

				// create the year buttons
				$y.append(
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - opts.bigInc) + '" data-inc="prevbig">' + (opts.showInc ? '-' + opts.bigInc : '&lt;&lt;') + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - opts.tinyInc) + '" data-inc="prevtiny">' + (opts.showInc ? '-' + opts.tinyInc : '&lt;') + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - 1) + '" data-inc="prev">' + (d.getFullYear() - 1) + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all ui-state-focus" data-year="' + d.getFullYear() + '" data-inc="current">' + d.getFullYear() + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + 1) + '" data-inc="next">' + (d.getFullYear() + 1) + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + opts.tinyInc) + '" data-inc="nexttiny">' + (opts.showInc ? '+' + opts.tinyInc : '&gt;') + '</button>' +
					'<button class="cj-button cj-button-year ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + opts.bigInc) + '" data-inc="nextbig">' + (opts.showInc ? '+' + opts.bigInc : '&gt;&gt;') + '</button>'
				);

				// bind our month and year buttons with a click handler
				$obj.find('.nav-months button').on('click', function () {
					var $this = $(this);
					setDateNav(1, $this.attr('data-month'), null, function(cdate) {
						if ($.isFunction(opts.onClick)) {
							opts.onClick.call($obj.get(0), cdate);
						}
					});
				});
				$obj.find('.nav-years button').on('click', function () {
					var $this = $(this),
						cdate = new Date($obj.data('cdate'));
					setDateNav(1, cdate.getMonth() + 1, $this.attr('data-inc'), function(cdate) {
						if ($.isFunction(opts.onClick)) {
							opts.onClick.call($obj.get(0), cdate);
						}
					});
				});

				// set the initial buttons states
				$obj.fadeIn('fast');
				setDateNav(null, null, null, function() {
					//if the user provided a onLoad, then call it
					if ($.isFunction(opts.onLoad)) {
						opts.onLoad.call($obj.get(0), $obj.data('cdate'));
					}
				});
			}
		}

		// extend our options with user passed settings
		$.extend(opts, settings);

		// init our navbar
		initDateNav();

	};

	$.fn.extend({

		cjDatePickerBar: function (settings) {

			// call to the plug-in
			return this.each(function () {

				$.cjDatePickerBar($(this), settings);

			});

		}
	});

}(jQuery));