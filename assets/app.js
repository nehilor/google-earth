/**
 * @website www.tango.com
 * @description This file contains functions related to the GoogleEarth Picture Viewer
 * @date 20/10/2021
 * @author Gabriel Villalobos
 * @version 1.0
 * @dependencies jQuery
 * Copyright(c) 2021
 */

//Declaration of the namespace
var GoogleEarth = GoogleEarth || {};

//Declaration of child object
GoogleEarth.ImageFinder = GoogleEarth.ImageFinder || {};

//Initializes the UI Manager
GoogleEarth.ImageFinder.UIManager = function () {
	var cache = {
		birthDateForm: $('#form'),
		imageContainer: $('#image-container'),
		image: $('#google-image'),
		date: $('#date'),
		dateContainer: $('.date-container'),
		inputContainer: $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body",
		message: $('#message')
	};

	//Instance of the listener
	var listener = new GoogleEarth.ImageFinder.Listener(cache, this);

	/**
	 * @name initialize
	 * @description Calls the listener initialize function
	 */
	this.initialize = function () {
		listener.initialize();
	};

	/**
	 * @name getGoogleImage
	 * @description Gets the selected date and retrieves the google earth picture
	 * @param {Event} e 
	 */
	this.getGoogleImage = function (e) {
		e.preventDefault();
		var date = cache.date.val();
		if (!date) {
			cache.dateContainer.addClass('has-error');
		} else {
			cache.dateContainer.removeClass('has-error');
			var  selectedDate = cache.date.val();
			selectedDate = selectedDate.split('/');
			var selectedMonth = parseInt(selectedDate[0]) < 10 ? selectedDate[0] : parseInt(selectedDate[0]);;
			var selectedDay = parseInt(selectedDate[1]) < 10 ? selectedDate[1] : parseInt(selectedDate[1]);
			var currentTime = new Date()
			var currentYear = currentTime.getFullYear();
			var currentMonth = currentTime.getMonth() + 1;
			var currentDay = currentTime.getDate();
			if(parseInt(selectedMonth) >= currentMonth && parseInt(selectedDay) > currentDay) {
				currentYear = currentYear - 1;
			}
			var picDate = currentYear + '-' + selectedMonth + '-' + selectedDay;
			$.ajax('https://epic.gsfc.nasa.gov/api/enhanced/date/' + picDate, {
				success: function (response, stat, xhr) {
					if(response.length) {
						var imageUrl = 'https://epic.gsfc.nasa.gov/archive/natural/{{year}}/{{month}}/{{day}}/png/epic_1b_{{identifier}}.png';
						var identifier = response[0].identifier;
						var imageSrc = imageUrl.replace('{{year}}', currentYear).replace('{{month}}', selectedMonth).replace('{{day}}', selectedDay).replace('{{identifier}}', identifier);
						cache.message.html('Showing a picture of the earth for the date ' + picDate);
						cache.image.attr('src', imageSrc);
						cache.imageContainer.show();
					} else {
						cache.image.attr('src', '');
						cache.imageContainer.hide();
					}
				}
			});
		}
	};
};

//Initializes the listener
GoogleEarth.ImageFinder.Listener = function (cache, UIManager) {

	var bindingElements = function () {
		cache.birthDateForm.on('submit', $.proxy(UIManager.getGoogleImage, UIManager));
	};

	this.initialize = function () {
		bindingElements();
		cache.date.datepicker({
			format: 'mm/dd/yyyy',
			container: cache.inputContainer,
			todayHighlight: true,
			autoclose: true,
		})
	};
};
//Initializes the UIManager once the Document is Ready
$(document).ready(function () {
	var uiManager = new GoogleEarth.ImageFinder.UIManager();
	uiManager.initialize();
});