"use strict";
var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DWSFormsInputDateTimeField {
                constructor() { }
                static inputDateField(datepickerField, schedHours, countSchedHours, default_min_time) {
                    var $ = jQuery;
                    var closedDaysString = $(datepickerField).data("closed-days").toString();
                    var closedDaysAttr = new Array();
                    // var closedDays = [];
                    if (closedDaysString.toString().includes(",")) {
                        // closedDaysAttr = new Array($(datepickerField).data("closed-days").split(','));
                        closedDaysAttr = $(datepickerField).data("closed-days").split(',');
                    }
                    else {
                        // if there is only one closed day, convert it to an array
                        if (closedDaysString != "") {
                            closedDaysAttr.push($(datepickerField).data("closed-days"));
                        }
                    }
                    $(datepickerField).datepicker({
                        beforeShowDay: function (date) {
                            var day = date.getDay();
                            // get closed days based on sales hours
                            for (var i = 0; i < closedDaysAttr.length; i++) {
                                if (day == closedDaysAttr[i]) {
                                    return [false];
                                }
                            }
                            ;
                            return [true];
                        },
                        beforeShow: function (input, inst) {
                            $('#ui-datepicker-div').insertAfter(input);
                            $('#ui-datepicker-div').addClass('dws-datepicker');
                        },
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'mm/dd/yy',
                        minDate: 0,
                        firstDay: 0,
                        defaultDate: new Date()
                    });
                    // adjust closed days based on default min appt time and current time
                    var temp_schedHours = [];
                    for (var i = 0; i < countSchedHours; i++) {
                        temp_schedHours.push(schedHours[i][1]);
                    }
                    schedHours = temp_schedHours;
                    var currentDate = new Date();
                    var dateToday = currentDate.getDay();
                    for (var i = 0; i < schedHours.length; i++) {
                        if (schedHours[i]['days'].includes(dateToday) && schedHours[i]['time_start'] != 'CLOSED') {
                            var time_end = schedHours[i]['time_end'];
                            var currentHour = currentDate.getHours();
                            var currentMinutes = currentDate.getMinutes();
                            let endTimeHours = parseInt(time_end.split(':')[0]);
                            var dealerEndTime;
                            var dateArray = new Array();
                            if (default_min_time != "") {
                                var currentAndDefaultMinTime = (currentHour + default_min_time);
                                // if currentHours is divisible by 24, add 1 day to current date
                                if (currentAndDefaultMinTime > 24) {
                                    var daysToAdd = Math.floor(currentAndDefaultMinTime / 24); // 1
                                    var stopDate = new Date();
                                    stopDate.setDate(stopDate.getDate() + daysToAdd);
                                    stopDate.setHours(0, 0, 0, 0);
                                    currentDate.setHours(0, 0, 0, 0);
                                    while (currentDate < stopDate) {
                                        dateArray.push($.datepicker.formatDate('mm/dd/yy', currentDate));
                                        currentDate.setDate(currentDate.getDate() + 1);
                                    }
                                    DWSFormsInputDateTimeField.remainingHours = default_min_time - (daysToAdd * 24);
                                    currentHour = DWSFormsInputDateTimeField.remainingHours + currentHour;
                                    DWSFormsInputDateTimeField.nextDayEnable = currentDate.getDate();
                                    dealerEndTime = (endTimeHours + DWSFormsInputDateTimeField.remainingHours);
                                }
                                else {
                                    dealerEndTime = (endTimeHours + default_min_time);
                                }
                                dealerEndTime = DWSFormsInputDateTimeField.convertTimeToDiffTimeFormat(dealerEndTime + ':' + time_end.split(':')[1]);
                            }
                            // convert time_end to 24 hour format
                            var timeEndHours = DWSFormsInputDateTimeField.convertTimeToDiffTimeFormat(time_end);
                            // check if current time is am or pm
                            var currentTimeAmpm = (currentHour >= 12 && currentHour < 24) ? 'PM' : 'AM';
                            var currentTime = DWSFormsInputDateTimeField.convertTimeToDiffTimeFormat(currentHour + ':' + currentMinutes + ' ' + currentTimeAmpm);
                            // adjust time on enable date based on default min time
                            if (DWSFormsInputDateTimeField.remainingHours != undefined) {
                                // if current time is greater than or equal to time_end, add the current day to closed days
                                if (parseInt(dealerEndTime) <= currentHour || currentTime >= timeEndHours) {
                                    dateArray.push($.datepicker.formatDate('mm/dd/yy', currentDate));
                                }
                                var defaultDate = $(datepickerField).datepicker("option", "defaultDate");
                                if (dateToday === defaultDate.getDay()) {
                                    // refresh datepicker option to add closed days
                                    $(datepickerField).datepicker("option", "beforeShowDay", function (date) {
                                        var string = $.datepicker.formatDate('mm/dd/yy', date);
                                        // add to closed days
                                        var day = date.getDay();
                                        for (var i = 0; i < closedDaysAttr.length; i++) {
                                            if (day == closedDaysAttr[i]) {
                                                return [false];
                                            }
                                        }
                                        ;
                                        if (dateArray.indexOf(string) != -1) {
                                            return [false];
                                        }
                                        return [true];
                                    });
                                }
                            }
                        }
                    }
                }
                static inputTimeField(timepickerField, datepickerField, schedHours, default_min_time, gmtOffset) {
                    var $ = jQuery;
                    $(timepickerField).attr("disabled", "disabled");
                    var temp_schedHours = [];
                    for (var i = 0; i < schedHours.length; i++) {
                        temp_schedHours.push(schedHours[i][1]);
                    }
                    schedHours = temp_schedHours;
                    $(datepickerField).on('change', function () {
                        var selectedDate = $(datepickerField).datepicker('getDate');
                        var selectedDay = new Date(selectedDate).getDay();
                        var selectedMonth = new Date(selectedDate).getMonth();
                        var dateToday = new Date();
                        var currentMonth = dateToday.getMonth();
                        var newStartTime = '';
                        for (var i = 0; i < schedHours.length; i++) {
                            if (schedHours[i]['days'].includes(selectedDay)) { // if selected date is within the sales hours
                                var time_start = schedHours[i]['time_start'];
                                var time_end = schedHours[i]['time_end'];
                                let currentHour = new Date().getHours();
                                let currentMinutes = new Date().getMinutes();
                                let ampm = (currentHour >= 12 && currentHour < 24) ? 'pm' : 'am';
                                // if selected date is today, set the min time to the next 30 minute interval
                                if (selectedDate.getDate() == dateToday.getDate() && selectedMonth == currentMonth) {
                                    let newHour = currentHour;
                                    let endTimeHours = parseInt(time_end.split(':')[0]);
                                    var dealerEndTime = '';
                                    if (default_min_time != "") {
                                        newHour = (currentHour + default_min_time);
                                        dealerEndTime = (endTimeHours + default_min_time);
                                        dealerEndTime = dealerEndTime + ':' + time_end.split(':')[1];
                                    }
                                    newStartTime = DWSFormsInputDateTimeField.adjustMinTime(newHour, ampm, currentMinutes);
                                }
                                else if (selectedDate.getDate() == DWSFormsInputDateTimeField.nextDayEnable) { // if selected date is the next day
                                    if (DWSFormsInputDateTimeField.remainingHours != undefined) {
                                        let newHour = parseInt(time_start.split(':')[0]);
                                        newHour = DWSFormsInputDateTimeField.remainingHours + currentHour;
                                        newStartTime = DWSFormsInputDateTimeField.adjustMinTime(newHour, ampm, currentMinutes);
                                    }
                                }
                                else {
                                    newStartTime = time_start;
                                }
                                ;
                                // convert appointment time to website dealer timezone
                                if (time_start != '' && time_end != '' && gmtOffset != "") {
                                    var dealerStartTime = DWSFormsInputDateTimeField.convertDealerTimezone(time_start, gmtOffset);
                                    if (dealerStartTime === '') {
                                        dealerStartTime = '12:00 am';
                                    }
                                    dealerEndTime = DWSFormsInputDateTimeField.convertDealerTimezone(time_end, gmtOffset);
                                    newStartTime = dealerStartTime;
                                }
                                $(timepickerField).timepicker({
                                    listWidth: 1,
                                    minTime: newStartTime,
                                    maxTime: time_end,
                                    timeFormat: 'g:i a',
                                    step: 15,
                                    appendTo: $(timepickerField).closest('.dws-time-field-container'),
                                    disableTextInput: true
                                });
                                $(timepickerField).val('');
                            }
                        }
                        $(timepickerField).removeAttr('disabled');
                    });
                }
                static adjustMinTime(newHour, ampm, currentMinutes) {
                    var newMinTime = '';
                    if (newHour >= 12) {
                        newHour = newHour - 12;
                        ampm = 'PM';
                    }
                    if (currentMinutes < 15) {
                        newMinTime = newHour + ':' + '15 ' + ampm;
                    }
                    else if (currentMinutes >= 15 && currentMinutes < 30) {
                        newMinTime = newHour + ':' + '30 ' + ampm;
                    }
                    else if (currentMinutes >= 30 && currentMinutes < 45) {
                        newMinTime = newHour + ':' + '45 ' + ampm;
                    }
                    else if (currentMinutes >= 45) {
                        newHour = newHour + 1;
                        if (newHour >= 12) {
                            newHour = newHour - 12;
                            ampm = 'PM';
                        }
                        newMinTime = newHour + ':' + '00 ' + ampm;
                    }
                    return newMinTime;
                }
                static convertTimeToDiffTimeFormat(stringTime) {
                    var ampm = stringTime.split(' ')[1];
                    stringTime = stringTime.split(' ')[0];
                    var arrTime = stringTime.split(':');
                    var hours = Number(arrTime[0]);
                    var minutes = Number(arrTime[1]);
                    var timeValue;
                    if (hours < 12 && (ampm == "PM" || ampm == "pm")) {
                        timeValue = hours + 12;
                    }
                    else {
                        timeValue = hours;
                    }
                    timeValue = timeValue + (minutes / 60);
                    return timeValue;
                }
                static convertDealerTimezone(stringTime, dealerTimeOffset) {
                    let returnValue = "";
                    let convertedHoursInMinsFormat = 0;
                    let hoursOpenInMins = DWSFormsInputDateTimeField.GetHoursOpenInMins(stringTime);
                    let dealerTimeOffSetMins = Math.abs(parseFloat(dealerTimeOffset) * 60);
                    let clientTimeOffSetMins = Math.abs(new Date().getTimezoneOffset());
                    let numberOfMinsToDeduct = 0;
                    let numberOfMinsToAdd = 0;
                    let convertedStoreHoursInMins = 0;
                    //Determine if i should minus or add in the dealerTimeZone
                    if (parseFloat(dealerTimeOffset) > DWSFormsInputDateTimeField.ConvertTimeZoneOffSetInMinsToHours(new Date().getTimezoneOffset())) {
                        numberOfMinsToDeduct = dealerTimeOffSetMins - clientTimeOffSetMins;
                        numberOfMinsToDeduct = Math.abs(numberOfMinsToDeduct);
                        convertedStoreHoursInMins = hoursOpenInMins - numberOfMinsToDeduct;
                    }
                    else {
                        numberOfMinsToAdd = dealerTimeOffSetMins + clientTimeOffSetMins;
                        numberOfMinsToAdd = Math.abs(numberOfMinsToAdd);
                        convertedStoreHoursInMins = hoursOpenInMins + numberOfMinsToAdd;
                    }
                    if (convertedStoreHoursInMins <= 0) {
                        convertedHoursInMinsFormat = 1440 - Math.abs(convertedStoreHoursInMins);
                    }
                    else if (convertedStoreHoursInMins >= 1440) {
                        convertedHoursInMinsFormat = Math.abs(convertedStoreHoursInMins) - 1440;
                    }
                    else {
                        convertedHoursInMinsFormat = Math.abs(convertedStoreHoursInMins);
                    }
                    returnValue = DWSFormsInputDateTimeField.ProcessConvertedMilitaryHoursToDealerStoreHours((convertedHoursInMinsFormat / 60));
                    return returnValue;
                }
                ;
                static GetHoursOpenInMins(stringTime) {
                    let returnValue = 0;
                    if (stringTime.indexOf(":") >= 0) {
                        let stringTimeArry = stringTime.split(":");
                        if (stringTimeArry.length > 1) {
                            let hoursNumber = parseInt(stringTimeArry[0]);
                            let hoursAmPm = stringTimeArry[1];
                            let storeHoursMins = parseInt(stringTimeArry[1].substr(0, 2));
                            if (hoursAmPm.indexOf("am") >= 0) {
                                returnValue = (hoursNumber * 60) + storeHoursMins;
                            }
                            if (hoursAmPm.indexOf("pm") >= 0) {
                                if (hoursNumber == 12) {
                                    returnValue = (hoursNumber * 60) + storeHoursMins;
                                }
                                else {
                                    returnValue = ((12 + hoursNumber) * 60) + storeHoursMins;
                                }
                            }
                        }
                    }
                    return returnValue;
                }
                static ConvertTimeZoneOffSetInMinsToHours(timeZoneOffSet) {
                    let returnValue = 0;
                    let timeZoneOffSetHrs = Math.round(timeZoneOffSet / 60);
                    //The number of minutes returned by getTimezoneOffset() is positive if the local time zone is behind UTC, 
                    //and negative if the local time zone is ahead of UTC.For example, for UTC + 10, -600 will be returned.
                    if (timeZoneOffSet < 0) {
                        returnValue = Math.abs(timeZoneOffSetHrs);
                    }
                    else {
                        returnValue = -Math.abs(timeZoneOffSetHrs);
                    }
                    return returnValue;
                }
                static ProcessConvertedMilitaryHoursToDealerStoreHours(convertedHoursInMinsFormat) {
                    let amPmTimeFormat = "";
                    let storeHoursMins = "00";
                    let convertedHours = 0;
                    let convertedHoursInMinsFormatString = convertedHoursInMinsFormat.toString();
                    if (convertedHoursInMinsFormatString.indexOf(".") >= 0) {
                        let convertedHoursInMinsFormatArray = convertedHoursInMinsFormatString.split(".");
                        convertedHours = parseInt(convertedHoursInMinsFormatArray[0]);
                        storeHoursMins = (parseFloat("." + convertedHoursInMinsFormatArray[1]) * 60).toString().substr(0, 2);
                    }
                    else {
                        convertedHours = convertedHoursInMinsFormat;
                    }
                    if (convertedHours >= 12 && convertedHours < 24) {
                        amPmTimeFormat = (convertedHours - 12).toString() + ":" + storeHoursMins + " pm";
                    }
                    else if (convertedHours >= 1 && convertedHours < 12) {
                        amPmTimeFormat = convertedHours.toString() + ":" + storeHoursMins + " am";
                    }
                    else if (convertedHours >= 24) {
                        amPmTimeFormat = "12:" + storeHoursMins + " am";
                    }
                    return amPmTimeFormat;
                }
            }
            Plugins.DWSFormsInputDateTimeField = DWSFormsInputDateTimeField;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
