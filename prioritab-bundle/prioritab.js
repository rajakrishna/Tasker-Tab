var dateFormat = "YYYY-MM-DD",
	timeFormat = "HH:mm A";
function GetTime() {
	var prettyTime = moment().format(window.timeFormat);
	document.getElementById("clockbox").innerHTML = prettyTime;
}
function GetDate() {
	var dayOfWeek = moment().format("dddd"),
		prettyDate = moment().format(window.dateFormat);
	document.getElementById("daybox").innerHTML = dayOfWeek;
	document.getElementById("datebox").innerHTML = prettyDate;
}
function CheckDayCountdown() {
	if ($("#workday-checkbox").is(":checked")) {
		chrome.storage.sync.set({ "user-use-workday": "true" });
		CountdownWorkday();
	} else {
		chrome.storage.sync.set({ "user-use-workday": "false" });
		CountdownDay();
	}
}
function CountdownDay() {
	var now = new Date(),
		todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
		progressMS = now - todayStart,
		totalDayMS = 24 * 60 * 60 * 1000,
		progressPCT = (progressMS / totalDayMS) * 100,
		prettyPCT = Math.round(progressPCT);
	$("#countdown-day .countdown-label").replaceWith(
		"<div class='countdown-label'>...of the day</div>"
	);
	document.getElementById("countdown-day-amount").innerHTML =
		Math.round(100 - prettyPCT) + "%";
}
function CountdownWorkday() {
	var workdayStartString,
		workdayEndString,
		workdayStartHour,
		workdayStartMin,
		workdayEndHour,
		workdayEndMin,
		progressPCT;
	chrome.storage.sync.get(
		["user-workday-start", "user-workday-end"],
		function (retrieved) {
			workdayStartString = retrieved["user-workday-start"]
				? retrieved["user-workday-start"]
				: "09:00";
			workdayEndString = retrieved["user-workday-end"]
				? retrieved["user-workday-end"]
				: "18:00";
			workdayStartHour = workdayStartString.split(":")[0];
			workdayStartMin = workdayStartString.split(":")[1];
			workdayEndHour = workdayEndString.split(":")[0];
			workdayEndMin = workdayEndString.split(":")[1];
			var now = new Date(),
				workdayStart = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					parseInt(workdayStartHour),
					parseInt(workdayStartMin)
				),
				workdayEnd = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					parseInt(workdayEndHour),
					parseInt(workdayEndMin)
				);
			if (now < workdayStart) {
				progressPCT = 0;
			} else if (now > workdayEnd) {
				progressPCT = 100;
			} else {
				var progressMS = now - workdayStart,
					totalDayMS = workdayEnd - workdayStart;
				progressPCT = (progressMS / totalDayMS) * 100;
			}
			var prettyPCT = Math.round(progressPCT);
			$("#countdown-day .countdown-label").replaceWith(
				"<div class='countdown-label'>...of the workday</div>"
			);
			document.getElementById("countdown-day-amount").innerHTML =
				Math.round(100 - prettyPCT) + "%";
		}
	);
}
function CountdownMonthYear() {
	var now = new Date(),
		monthStart = new Date(now.getFullYear(), now.getMonth(), 1),
		progressMonthMS = now - monthStart,
		totalMonthMS = moment().daysInMonth() * 24 * 60 * 60 * 1000,
		monthProgressPCT = (progressMonthMS / totalMonthMS) * 100,
		yearStart = new Date(now.getFullYear(), 0, 1),
		progressYearMS = now - yearStart,
		totalYearMS = 365 * 24 * 60 * 60 * 1000,
		yearProgressPCT = (progressYearMS / totalYearMS) * 100,
		prettyYearPCT = Math.floor(yearProgressPCT);

	document.getElementById("countdown-month-amount").innerHTML =
		Math.round(100 - monthProgressPCT) + "%";
	document.getElementById("countdown-year-amount").innerHTML =
		Math.round(100 - prettyYearPCT) + "%";
	setTimeout(CountdownMonthYear, 1000);
}
$(document).on("click", function (event) {
	if (!$(event.target).closest("#customize-corner").length) {
		if ($("#customize-corner").is(":visible")) {
			$("#customize-selectors").hide();
			$("#customize-button").fadeIn();
		}
	}
	if (!$(event.target).closest("#list-left").length) {
		if ($("#list-left .edit-priorities").is(":visible")) {
			$("#list-left .edit-priorities").hide();
			$("#list-left .edit-priorities-link").show();
		}
	}
	if (!$(event.target).closest("#list-mid").length) {
		if ($("#list-mid .edit-priorities").is(":visible")) {
			$("#list-mid .edit-priorities").hide();
			$("#list-mid .edit-priorities-link").show();
		}
	}
	if (!$(event.target).closest("#list-right").length) {
		if ($("#list-right .edit-priorities").is(":visible")) {
			$("#list-right .edit-priorities").hide();
			$("#list-right .edit-priorities-link").show();
		}
	}
});
function SetColorProperty(classToChange, propToChange, newValue) {
	var style = $(
		"<style>." +
			classToChange +
			" { " +
			propToChange +
			": " +
			newValue +
			"; }</style>"
	);
	$("html > head").append(style);
}
function SetColors() {
	chrome.storage.sync.get("user-background-color", function (result) {
		var bgcolor = result["user-background-color"]
			? result["user-background-color"]
			: "#222222";
		SetColorProperty("main-bgcolor", "background-color", bgcolor);
	});
	chrome.storage.sync.get("user-font-color", function (result) {
		var fontColor = result["user-font-color"]
			? result["user-font-color"]
			: "white";
		SetColorProperty("main-font-color", "color", fontColor);
		SetColorProperty("main-border-color", "color", fontColor);
	});
	chrome.storage.sync.get("user-shadow-color", function (result) {
		var shadowColor = result["user-shadow-color"]
			? result["user-shadow-color"]
			: "rgba(255, 255, 255, 0.3)";
		SetColorProperty("shadow-color", "color", shadowColor);
		SetColorProperty("shadow-border-color", "color", shadowColor);
	});
}
function SetDateTimeFormat() {
	chrome.storage.sync.get(
		{ "user-date-format": "MMM D, YYYY" },
		function (result) {
			dateFormat = result["user-date-format"];
			GetDate();
			$("#date-format-input").val(dateFormat);
		}
	);
	chrome.storage.sync.get(
		{ "user-time-format": "h:mm:ss A" },
		function (result) {
			timeFormat = result["user-time-format"];
			GetTime();
			$("#time-format-input").val(timeFormat);
		}
	);
}
$(window).on("load", function () {
	SetDateTimeFormat();
	chrome.storage.sync.get("user-use-workday", function (result) {
		if (result["user-use-workday"] === "true") {
			CountdownWorkday();
			$("#workday-checkbox").prop("checked", !0);
		} else {
			CountdownDay();
		}
	});
	CountdownMonthYear();
	setInterval(GetTime, 1000);
	setInterval(CountdownDay, 900000);
	SetColors();
	chrome.storage.sync.get("update-20151231", function (result) {
		if (!result["update-20151231"]) {
			$("#update-footer").fadeIn(500).fadeOut(500).fadeIn(500);
			chrome.storage.sync.set({ "update-20151231": !0 });
		}
	});
	$("#update-hide").on("click", function (e) {
		$("#update-footer").hide();
		chrome.storage.sync.set({ "update-20151231": !0 });
	});
	chrome.storage.sync.get(
		["user-workday-start", "user-workday-end"],
		function (retrieved) {
			workdayStart = retrieved["user-workday-start"]
				? retrieved["user-workday-start"]
				: "09:00";
			workdayEnd = retrieved["user-workday-end"]
				? retrieved["user-workday-end"]
				: "18:00";
			$("#workday-start-timeinput")[0].value = workdayStart;
			$("#workday-end-timeinput")[0].value = workdayEnd;
		}
	);
	$(".edit-priorities-link").on("click", function (e) {
		$(".edit-priorities").each(function (index) {
			$(this).hide();
			$(this).siblings(".edit-priorities-link").fadeIn();
		});
		$(this).hide();
		prioritiesList = $(this).siblings(".edit-priorities")[0];
		$(prioritiesList).fadeIn();
		$(prioritiesList).find("input.todo").trigger("focus");
	});
	$(".hide-edit").on("click", function (e) {
		$(this).parent().hide();
		$(this).parent().siblings(".edit-priorities-link").show();
	});
	$("#info-corner").on(
		"hover",
		function () {
			$(this).children("#info-button").hide();
			$(this).children("#info").fadeIn();
		},
		function () {
			$(this).children("#info").hide();
			$(this).children("#info-button").fadeIn();
		}
	);
	$("#customize-button").on("click", function () {
		$("#customize-button").hide();
		$("#customize-selectors").fadeIn();
	});
	$("#hide-customize-selectors").on("click", function () {
		$("#customize-selectors").hide();
		$("#customize-button").fadeIn();
	});
	$("#background-color-selector").colpick({
		layout: "full",
		submit: !1,
		colorScheme: "dark",
		color: "#222222",
		onChange: function (hsb, hex, rgb, el, bySetColor) {
			SetColorProperty("main-bgcolor", "background-color", "#" + hex);
			chrome.storage.sync.set({ "user-background-color": "#" + hex });
		},
		onHide: function (cpobj) {
			$(".color-selector-label").css("visibility", "visible");
			$(".color-selector-label").css("font-weight", "normal");
		},
	});
	$("#font-color-selector").colpick({
		layout: "full",
		submit: !1,
		colorScheme: "dark",
		color: "#FFFFFF",
		onChange: function (hsb, hex, rgb, el, bySetColor) {
			SetColorProperty("main-font-color", "color", "#" + hex);
			SetColorProperty("main-border-color", "color", "#" + hex);
			chrome.storage.sync.set({ "user-font-color": "#" + hex });
		},
		onHide: function (cpobj) {
			$(".color-selector-label").css("visibility", "visible");
			$(".color-selector-label").css("font-weight", "normal");
		},
	});
	$("#shadow-color-selector").colpick({
		layout: "full",
		submit: !1,
		colorScheme: "dark",
		color: "rgba(255, 255, 255, 0.3)",
		onChange: function (hsb, hex, rgb, el, bySetColor) {
			SetColorProperty("shadow-color", "color", "#" + hex);
			SetColorProperty("shadow-border-color", "color", "#" + hex);
			chrome.storage.sync.set({ "user-shadow-color": "#" + hex });
		},
		onHide: function (cpobj) {
			$(".color-selector-label").css("visibility", "visible");
			$(".color-selector-label").css("font-weight", "normal");
		},
	});
	$(".customize-selector-label").on("click", function (e) {
		$(this).siblings(".color-selector-label").css("visibility", "hidden");
		$(this).show();
		$(this).css("font-weight", "bold");
	});
	$("#restore-default-colors").on("click", function (e) {
		SetColorProperty("main-bgcolor", "background-color", "#222222");
		chrome.storage.sync.set({ "user-background-color": "#222222" });
		SetColorProperty("main-font-color", "color", "white");
		SetColorProperty("main-border-color", "color", "white");
		chrome.storage.sync.set({ "user-font-color": "white" });
		SetColorProperty("shadow-color", "color", "rgba(255, 255, 255, 0.3)");
		SetColorProperty(
			"shadow-border-color",
			"color",
			"rgba(255, 255, 255, 0.3)"
		);
		chrome.storage.sync.set({
			"user-shadow-color": "rgba(255, 255, 255, 0.3)",
		});
	});
	$("#workday-checkbox").on("click", function (e) {
		CheckDayCountdown();
	});
	$("#workday-time-save").on("click", function (e) {
		var workdayStart = $("#workday-start-timeinput")[0].value,
			workdayEnd = $("#workday-end-timeinput")[0].value;
		chrome.storage.sync.set({
			"user-workday-start": workdayStart,
			"user-workday-end": workdayEnd,
		});
		CheckDayCountdown();
	});
	$("#date-time-format-save").on("click", function (e) {
		dateFormat = $("#date-format-input option:selected").text();
		timeFormat = $("#time-format-input option:selected").text();
		chrome.storage.sync.set({ "user-time-format": timeFormat });
		chrome.storage.sync.set({ "user-date-format": dateFormat });
		GetDate();
		GetTime();
	});
	$("#uninstall-extension-button").on("click", function (e) {
		chrome.management.uninstallSelf({ showConfirmDialog: !0 });
	});
});
