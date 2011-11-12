/*global jQuery*/
/*
 * CJ Date Navigation Bar
 *
 * Copyright (c) 2011 Creative Juices Bo. Co.
 * Written by: Doug Jones (www.cjboco.com)
 * Licensed under the MIT.
 *
 * A jQuery plugin to display a date picker bar to allow quick and easy date selection.
 * Returns a JS date object.
 *
 * 1.1 - Added ability to prevent future dates.
 * 1.0 - initial release
 */
//@todo - Maybe add the ability to set return date format (i.e. mm/dd/yyyy, etc)
//@todo - Maybe add min and max allowed dates
(function ($) {
	"use strict";

	$.cjDateNavBar = function ($obj, settings) {

		var opts = {
			date: null,
			bigInc: 10,
			tinyInc: 5,
			monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			showInc: false,
			showFuture: true,
			callback: null
		},
			isDate = function (d) {
				return !isNaN(new Date(d).getYear());
			};

		function setDateNav(m, y) {

			var cdate = $obj.data('cdate'),
				now = new Date(),
				triggerClb = true;

			$obj.find('button').removeClass('ui-state-disabled').removeAttr('disabled');

			// check to see if our object exists and date is set
			if ($obj.length > 0 && cdate) {

				// grab current date and check passed arguments.
				cdate = new Date(cdate);
				if (!m || typeof m === 'undefined') {
					m = cdate.getMonth() + 1;
				}
				if (!y || typeof y === 'undefined') {
					y = cdate.getFullYear();
				}

				// remove highlight from month buttons
				$obj.find('.nav-months button.ui-state-focus').removeClass('ui-state-focus');

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

					// update the buttons
					$obj.find('.nav-months button[data-month="' + m + '"]').addClass('ui-state-focus');
					$obj.find('.nav-years button[data-inc="prev"]').text(cdate.getFullYear() - 1);
					$obj.find('.nav-years button[data-inc="current"]').text(cdate.getFullYear());
					$obj.find('.nav-years button[data-inc="next"]').text(cdate.getFullYear() + 1);

					// check future dates (if not allowed)
					if (!opts.showFuture) {
						if (cdate > now) {
							// this prevents if the user has a month selected that is greater than the now date.
							// also, we don't want to trigger the callback on this call, only on the next one.
							cdate = new Date(now.getMonth() + '/01/' + now.getFullYear());
							setDateNav(now.getMonth(), now.getFullYear());
							triggerClb = false;
						}
						if (cdate.getFullYear() >= now.getFullYear()) {
							$obj.find('button[data-month]:gt(' + cdate.getMonth() + ')').addClass('ui-state-disabled').attr('disabled', 'disabled');
							$obj.find('button[data-inc="next"]').addClass('ui-state-disabled').attr('disabled', 'disabled');
						}
						if ((cdate.getFullYear() + opts.tinyInc) >= now.getFullYear()) {
							$obj.find('button[data-inc="nexttiny"]').addClass('ui-state-disabled').attr('disabled', 'disabled');
						}
						if ((cdate.getFullYear() + opts.bigInc) >= now.getFullYear()) {
							$obj.find('button[data-inc="nextbig"]').addClass('ui-state-disabled').attr('disabled', 'disabled');
						}
					}

					// save out current date
					$obj.data('cdate', cdate);

					//if the user provided a callback, then call it
					if (triggerClb && $.isFunction(opts.callback)) {
						opts.callback.call($obj.get(0), cdate);
					}
				}
			}
		}

		function initDateNav() {

			var d, i, $m, $y;

			// check to see if our object exists
			if ($obj.length > 0) {

				// check to see if the user supplied a date to use.
				// If not, create one and set to current date.
				d = opts.date ? new Date(opts.date) : new Date();
				if (!isDate(d)) {
					d = new Date();
				}

				// the DAY is not being used, but we need to make sure that
				// the date object is valid for all days, so set DAY = 1
				// (i.e. January 31 is valid, but Feb 31 is not)
				d.setDate(1);

				// save out date object for reference
				$obj.data('cdate', d);

				// create the navigation bar DOM
				$obj.html('').hide().append('<span class="nav-months cj-buttonset"></span><span class="nav-years cj-buttonset"></span>');
				$m = $obj.find('.nav-months');
				$y = $obj.find('.nav-years');

				// create the month buttons
				for (i = 1; i <= 12; i++) {
					d = new Date(i + '/1/' + d.getFullYear());
					$m.append('<button class="cj-button ui-state-default ui-corner-all" data-month="' + i + '">' + opts.monthNames[d.getMonth()] + '</button>');
				}

				// create the year buttons
				$y.append(
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - opts.bigInc) + '" data-inc="prevbig">' + (opts.showInc ? '-' + opts.bigInc : '&lt;&lt;') + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - opts.tinyInc) + '" data-inc="prevtiny">' + (opts.showInc ? '-' + opts.tinyInc : '&lt;') + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() - 1) + '" data-inc="prev">' + (d.getFullYear() - 1) + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all ui-state-focus" data-year="' + d.getFullYear() + '" data-inc="current">' + d.getFullYear() + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + 1) + '" data-inc="next">' + (d.getFullYear() + 1) + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + opts.tinyInc) + '" data-inc="nexttiny">' + (opts.showInc ? '+' + opts.tinyInc : '&gt;') + '</button>' +
					'<button class="cj-button ui-state-default ui-corner-all" data-year="' + (d.getFullYear() + opts.bigInc) + '" data-inc="nextbig">' + (opts.showInc ? '+' + opts.bigInc : '&gt;&gt;') + '</button>'
				);

				// bind our month and year buttons with a click handler
				$obj.find('.nav-months button').bind('click', function () {
					setDateNav($(this).attr('data-month'));
				});
				$obj.find('.nav-years button').bind('click', function () {
					var cdate = new Date($obj.data('cdate'));
					setDateNav(cdate.getMonth() + 1, $(this).attr('data-inc'));
				});

				// set the initial buttons states
				$obj.fadeIn('fast');
				setDateNav();
			}
		}

		// extend our options with user passed settings
		$.extend(opts, settings);

		// init our navbar
		initDateNav();

	};

	$.fn.extend({

		cjDateNavBar: function (settings) {

			// call to the plug-in
			return this.each(function () {

				$.cjDateNavBar($(this), settings);

			});

		}
	});

}(jQuery));