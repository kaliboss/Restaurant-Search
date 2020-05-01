// method for writing error messages to screen
const handleError = (message) => {
	$(".errorMessage").text(message);
};

// method for redirecting to correct url
const redirect = (response) => {
	window.location = response.redirect;
};

// method for sending Ajax call
const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};