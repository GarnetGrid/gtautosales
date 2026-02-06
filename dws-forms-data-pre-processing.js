var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DWSFormsDataPreProcessing {
                constructor() {
                }
                /**
                 * Method to add value to form data
                 * @param field_map field map
                 * @param value value
                 * @param form main form
                 * @returns void
                 */
                addToFormData(field_map, value, form) {
                    var data = form.data('form-data');
                    var field_map_arr = field_map.split('.');
                    for (var i = 0; i < field_map_arr.length; i++) {
                        if (i == field_map_arr.length - 1) {
                            if (data[field_map_arr[i]] != '') {
                                data[field_map_arr[i]] = value;
                            }
                        }
                        else {
                            if (!data[field_map_arr[i]]) {
                                data[field_map_arr[i]] = {};
                            }
                            data = data[field_map_arr[i]];
                        }
                    }
                }
                /**
                 * Method to add prefer email and phone to form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                addPreferEmailAndPhoneToFormData(field, form) {
                    var fieldValue = field.prop('checked');
                    // check if field is phone number
                    if (field.attr('id') == 'dws-forms-contact-preference-phone') {
                        // set prefer phone value
                        this.addToFormData('applicant.preferPhone', fieldValue, form);
                    }
                    // check if field is email
                    if (field.attr('id') == 'dws-forms-contact-preference-email') {
                        // set prefer email value
                        this.addToFormData('applicant.preferEmail', fieldValue, form);
                    }
                    // check if field is sms
                    if (field.attr('id') == 'dws-forms-contact-preference-sms') {
                        // set prefer sms value
                        this.addToFormData('applicant.preferSMS', fieldValue, form);
                    }
                }
                /**
                 * Method to add schedule appointment to form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                addScheduleAppointment(field, form) {
                    // check if field is test drive date
                    if (field.data('form-json-field-map') == 'appointment.date') {
                        var testDriveDateValue = form.find('input[data-form-json-field-map="appointment.date"]').val();
                        var testDriveTimeValue = form.find('input[data-form-json-field-map="appointment.time"]').val() ? form.find('input[data-form-json-field-map="appointment.time"]').val() : '12:00am';
                        if (testDriveDateValue) {
                            var value = this.convertToDateFormat(`${testDriveDateValue} ${testDriveTimeValue}`);
                            // set appointment date time in form data
                            this.addToFormData('appointment.dateTime', value, form);
                        }
                    }
                    if (field.data('form-json-field-map') == 'appointment.time') {
                        // check if appointment dateTime is empty
                        if (!form.data('form-data').appointment.dateTime) {
                            // remove appointment property
                            return delete form.data('form-data').appointment;
                        }
                        // remove appointment date property
                        delete form.data('form-data').appointment.date;
                        // remove appointment time property
                        delete form.data('form-data').appointment.time;
                    }
                }
                /**
                 * Method to add appraisal date to form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                addAppraisalDate(field, form) {
                    if (field.attr('name') == 'appraisal_date') {
                        var appraisalDateValue = field.val();
                        var appraisalTimeValue = '12:00am';
                        var value = '';
                        if (appraisalDateValue) {
                            var value = this.convertToDateFormat(`${appraisalDateValue} ${appraisalTimeValue}`);
                            // set appointment date time in form data
                            this.addToFormData('appraisalDate', value, form);
                        }
                        else {
                            // delete appraisal date time property
                            delete form.data('form-data').appraisalDate;
                        }
                    }
                }
                /**
                 * Method to add full name to form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                addFullNameToFormData(field, form) {
                    // check if field is first name and have inquiry type of car finder
                    if (field.attr('id') == 'dws-forms-first-name-input') {
                        var firstName = field.val();
                        var lastName = form.find('#dws-forms-last-name-input').val();
                        var fullName = '';
                        if (firstName && lastName) {
                            fullName = `${firstName} ${lastName}`;
                        }
                        else if (firstName) {
                            fullName = firstName;
                        }
                        else if (lastName) {
                            fullName = lastName;
                        }
                        // set full name in form data
                        this.addToFormData('applicant.name.fullName', fullName, form);
                    }
                }
                /**
                 * Method to change phone to mobile phone in form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                changePhoneToMobilePhone(field, form) {
                    var _a;
                    // check if field dataset is applicant.homePhone
                    if (field.data('form-json-field-map') == 'applicant.homePhone') {
                        // set mobile phone value
                        this.addToFormData('applicant.mobilePhone', (_a = form.data('form-data').applicant.homePhone) !== null && _a !== void 0 ? _a : '', form);
                        // remove phone property
                        delete form.data('form-data').applicant.homePhone;
                    }
                }
                /**
                 * Method to add address type to form data
                 * @param field input field
                 * @param form main form
                 * @returns void
                 */
                addAddressTypeToFormData(field, form) {
                    // check if field includes address
                    if (field.data('form-json-field-map') && field.data('form-json-field-map').includes('applicant.address')) {
                        // set mobile phone value
                        this.addToFormData('applicant.address.addressTypeId', 1, form);
                    }
                }
                /**
                 * Method to convert date to ISO format
                 * @param inputDate input date
                 * @returns string
                 */
                convertToDateFormat(inputDate) {
                    if (inputDate == '') {
                        return '';
                    }
                    // Split the input date and time into components
                    const parts = inputDate.split(/[/\s:]+/);
                    // Extract date and time components
                    var month = parseInt(parts[0]) - 1; // Months are 0-based in JavaScript
                    var day = parseInt(parts[1]);
                    var year = parseInt(parts[2]);
                    var hours = parseInt(parts[3]);
                    var minutes = parseInt(parts[4]);
                    var ampm = inputDate.indexOf('am') > -1 ? 'am' : 'pm';
                    // Adjust hours for AM/PM
                    if (ampm === 'pm' && hours !== 12) {
                        hours += 12;
                    }
                    else if (ampm === 'am' && hours === 12) {
                        hours = 0;
                    }
                    // Create a Date object with the extracted components
                    const date = new Date(year, month, day, hours, minutes);
                    // check if parse date is invalid
                    if (isNaN(date.getTime())) {
                        return null;
                    }
                    return date.toISOString();
                }
                /**
                 * Method to add comment to form data
                 * @param comment comment
                 * @param form main form
                 * @returns void
                 */
                addCommentToFormData(comment, form) {
                    if (comment == '') {
                        return;
                    }
                    // set comment in form data
                    this.addToFormData('applicant.comments', comment, form);
                }
                addToFormDataComment(key, value, form, isCoBuyer = false) {
                    // Determine which comments field to use based on isCoBuyer flag
                    const commentsPath = isCoBuyer ? 'coApplicant.comments' : 'applicant.comments';
                    const formData = form.data('form-data');
                    // Get comments from the appropriate path
                    let comments = isCoBuyer ?
                        (formData.coApplicant && formData.coApplicant.comments) :
                        formData.applicant.comments;
                    // Escape special regex characters in the key
                    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    if (!comments) {
                        this.addToFormData(commentsPath, `\n${key}: ${value}`, form);
                        return;
                    }
                    if (comments.indexOf(`\n${key}`) > -1) {
                        comments = comments.replace(new RegExp(`${escapedKey}:.*`, 'g'), `${key}: ${value}`);
                    }
                    else {
                        comments += ` \n${key}: ${value}`;
                    }
                    this.addToFormData(commentsPath, comments, form);
                }
                /**
                 * Method to convert form data value to int
                 */
                convertFormDataValueToInteger(fieldMap, field, form) {
                    if (!fieldMap) {
                        return;
                    }
                    let value = field.val();
                    if (jQuery.isNumeric(value)) {
                        value = parseInt(value);
                    }
                    else {
                        value = null;
                    }
                    if (value == null) {
                        // remove to form data
                        delete form.data('form-data')[fieldMap];
                        return;
                    }
                    this.addToFormData(fieldMap, value, form);
                }
                /**
                 * Method to convert form data price value to int
                 */
                convertFormDataPriceValueToInteger(fieldMap, field, form) {
                    if (!fieldMap) {
                        return;
                    }
                    let value = field.val().replace(/[,$]/g, '').replace('.00', '');
                    if (jQuery.isNumeric(value)) {
                        value = parseInt(value);
                    }
                    else {
                        value = null;
                    }
                    if (value == null) {
                        // remove to form data
                        delete form.data('form-data')[fieldMap];
                        return;
                    }
                    this.addToFormData(fieldMap, value, form);
                }
            }
            Plugins.DWSFormsDataPreProcessing = DWSFormsDataPreProcessing;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
jQuery(() => {
    new DealerCenter.WebSite.Plugins.DWSFormsDataPreProcessing();
});
