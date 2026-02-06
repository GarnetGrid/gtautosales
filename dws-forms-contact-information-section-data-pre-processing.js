"use strict";
var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DWSFormsContactInformationSectionDataPreProcessing extends DealerCenter.WebSite.Plugins.DWSFormsDataPreProcessing {
                constructor(field, form) {
                    super();
                    this.field = field;
                    this.form = form;
                }
                /**
                 * initialize class
                 */
                init() {
                    var _a;
                    var $ = jQuery;
                    // check if valid inquiry type
                    if (this.form.data('form-data').inquiryType == 4 || // car finder
                        (this.form.data('form-data').inquiryType == 13 && this.form.data('form-data').secondaryInquiryType == 'TextMessage') // text message
                    ) {
                        this.addFullNameToFormData(this.field, this.form);
                    }
                    // check if valid inquiry type
                    if ((this.form.data('form-data').inquiryType == 13 && this.form.data('form-data').secondaryInquiryType == 'TextMessage') || // text message
                        (this.form.data('form-data').inquiryType == 13 && this.form.data('form-data').secondaryInquiryType == 'TextVehicleDetail') || // text vehicle detail
                        (this.form.data('form-data').inquiryType == 18 && this.form.data('form-data').secondaryInquiryType == 'TextUsAboutThisVehicle') // text us about this vehicle
                    ) {
                        // change phone number to mobile phone
                        this.changePhoneToMobilePhone(this.field, this.form);
                    }
                    // check if inquiry type is make us an offer, confirm availability, request a quote
                    if (this.form.data('form-data').inquiryType == 6 || // make us an offer
                        this.form.data('form-data').inquiryType == 5 || // confirm availability
                        this.form.data('form-data').inquiryType == 2 || // request a quote
                        this.form.data('form-data').inquiryType == 8 || // schedule a test drive
                        this.form.data('form-data').inquiryType == 15 || // service appointment
                        (this.form.data('form-data').inquiryType == 20 && this.form.data('form-data').secondaryInquiryType == 'LocalHomeDelivery') || // local home delivery
                        (this.form.data('form-data').inquiryType == 21 && this.form.data('form-data').secondaryInquiryType == 'VirtualAppointment') || // virtual appointment
                        (this.form.data('form-data').inquiryType == 22 && this.form.data('form-data').secondaryInquiryType == 'TestDriveFromHome') || // test drive from home
                        (this.form.data('form-data').inquiryType == 11) || // sell us your car
                        (this.form.data('form-data').inquiryType == 32) || // trade in
                        (this.form.data('form-data').inquiryType == 7) // contact us
                    ) {
                        this.addPreferEmailAndPhoneToFormData(this.field, this.form);
                    }
                    // check if inquiry type is make us an offer
                    if (this.form.data('form-data').inquiryType == 5) {
                        if (this.field.data('form-json-field-map') == 'vehicleOffer') {
                            this.convertFormDataPriceValueToInteger('vehicleOffer', this.field, this.form);
                        }
                    }
                    // check if inquiry type is schedule a test drive, local home delivery
                    if (this.form.data('form-data').inquiryType == 15 || // service appointment
                        (this.form.data('form-data').inquiryType == 8 && this.form.data('form-data').secondaryInquiryType == 'ScheduleATestDrive') || // schedule test drive
                        (this.form.data('form-data').inquiryType == 22 && this.form.data('form-data').secondaryInquiryType == 'TestDriveFromHome') || // test drive from home
                        (this.form.data('form-data').inquiryType == 21 && this.form.data('form-data').secondaryInquiryType == 'VirtualAppointment') || // virtual appointment
                        (this.form.data('form-data').inquiryType == 20 && this.form.data('form-data').secondaryInquiryType == 'LocalHomeDelivery') // local home delivery
                    ) {
                        // set schedule appointment
                        this.addScheduleAppointment(this.field, this.form);
                    }
                    // check if inquiry type is sell us your car
                    if (this.form.data('form-data').inquiryType == 11 || // sell us your car
                        this.form.data('form-data').inquiryType == 32 // trade in
                    ) {
                        // set appraisal date
                        this.addAppraisalDate(this.field, this.form);
                    }
                    // check if valid inquiry type
                    if ((this.form.data('form-data').inquiryType == 20 && this.form.data('form-data').secondaryInquiryType == 'LocalHomeDelivery') || // local home delivery
                        (this.form.data('form-data').inquiryType == 22 && this.form.data('form-data').secondaryInquiryType == 'TestDriveFromHome') || // test drive from home
                        (this.form.data('form-data').inquiryType == 24 && this.form.data('form-data').secondaryInquiryType == 'ReferralForm') || // referral form
                        (this.form.data('form-data').inquiryType == 11) || // sell us your car
                        (this.form.data('form-data').inquiryType == 32) // trade in
                    ) {
                        // add address type to form data
                        this.addAddressTypeToFormData(this.field, this.form);
                    }
                    // check if valid inquiry type
                    if (this.form.data('form-data').inquiryType == 24 && this.form.data('form-data').secondaryInquiryType == 'ReferralForm' // referral form
                    ) {
                        // set referral form comment
                        this.setReferralFormComment(this.field, this.form);
                    }
                    // check if valid inquiry type
                    if (this.form.data('form-data').inquiryType == 4 // car finder
                    ) {
                        // set car finder comment
                        this.setCarFinderComment(this.field, this.form);
                    }
                    // check if valid inquiry type
                    if ((this.form.data('form-data').inquiryType == 11) || // sell us your car
                        (this.form.data('form-data').inquiryType == 32) // trade in
                    ) {
                        // if data form-json-field-map is applicant.comments
                        if (this.field.data('form-json-field-map') == 'applicant.comments') {
                            // map some fields in comments
                            var customVehicleInformation = $('.dws-forms-section-customer-vehicle-information', this.form);
                            var otherVehicleInformation = $('.dws-forms-other-vehicle-information', this.form);
                            var fieldsToCommentsMapping = '\n';
                            if (otherVehicleInformation.length) {
                                var lienHolder = otherVehicleInformation.find('[name="lienholder"]').val() ? `\nLien Holder: ${otherVehicleInformation.find('[name="lienholder"]').val()}` : '';
                                var payoffAmount = otherVehicleInformation.find('[name="payoff_amount"]').val() ? `\nPayoff Amount: ${otherVehicleInformation.find('[name="payoff_amount"]').val()}` : '';
                                var wrecked = otherVehicleInformation.find('[name="wrecked"]').val() ? `\nWrecked: ${otherVehicleInformation.find('[name="wrecked"]').val()}` : '';
                                var clear_title = otherVehicleInformation.find('[name="clear_title"]').val() ? `\nClear Title: ${otherVehicleInformation.find('[name="clear_title"]').val()}` : '';
                                fieldsToCommentsMapping += `${lienHolder} ${payoffAmount} ${wrecked} ${clear_title}`.trim();
                            }
                            if (customVehicleInformation.length) {
                                var trim = customVehicleInformation.find('[name="trim"]').val() ? `\nTrim: ${customVehicleInformation.find('[name="trim"]').val()}` : '';
                                var engine = customVehicleInformation.find('[name="engine"]').val() ? `\nEngine: ${customVehicleInformation.find('[name="engine"]').val()}` : '';
                                var transmission = customVehicleInformation.find('[name="transmission"]').val() ? `\nTransmission: ${customVehicleInformation.find('[name="transmission"]').val()}` : '';
                                fieldsToCommentsMapping += '\n' + `${trim} ${engine} ${transmission}`.trim();
                            }
                            var comments = ((_a = this.field.val()) !== null && _a !== void 0 ? _a : '') + `${fieldsToCommentsMapping}`;
                            this.addToFormData('applicant.comments', comments, this.form);
                        }
                    }
                    // check if valid inquiry type
                    if (this.form.data('form-data').secondaryInquiryType == 'GenericContactForm' // generic contact form
                    ) {
                        // map inquiry type to form data
                        this.setGenericContactFormInquiryType(this.field, this.form);
                    }
                    // check if the enquiry type is service appointment
                    if (this.form.data('form-data').inquiryType == 15) {
                        // add value for the specific fields required for address
                        this.addToFormData('applicant.address.addressTypeId', 3, this.form);
                    }
                }
                setCarFinder(field, form) {
                    // check if field is first name and have inquiry type of car finder
                    if (field.attr('id') == 'dws-forms-first-name-input' && form.data('form-data').inquiryType == 4) {
                        // set full name in form data
                        this.addToFormData('applicant.name.fullName', `${field.val()} ${form.find('#dws-forms-last-name-input').val()}`, form);
                    }
                }
                setPreferEmailPhoneSMSToFormData(field, form) {
                    // add prefer email and phone to form data
                    this.addPreferEmailAndPhoneToFormData(field, form);
                }
                setReferralFormComment(field, form) {
                    // check if field is comment and have inquiry type of referral form
                    if (field.attr('id') == 'dws-forms-business-name-input' && form.data('form-data').inquiryType == 24) {
                        // set comment in form data
                        if (field.val() != '') {
                            var comment = `Referrer Business: ${field.val()}`;
                            this.addCommentToFormData(comment, form);
                        }
                    }
                }
                setCarFinderComment(field, form) {
                    // check if field is comment and have inquiry type of car finder
                    if ((field.data('form-json-field-map') == 'applicant.comments') && form.data('form-data').inquiryType == 4) {
                        var desiredFeatures = form.find('#dws-forms-desired-features-input').val();
                        // set comment in form data
                        if (desiredFeatures != '') {
                            var desiredFeaturesComment = `Desired Features: ${desiredFeatures}\n`;
                            var comments = form.data('form-data').applicant.comments;
                            var finalComment = comments + '\n' + desiredFeaturesComment;
                            this.addCommentToFormData(finalComment, form);
                        }
                    }
                }
                setGenericContactFormInquiryType(field, form) {
                    var formType = form.find('[name="confirm_availability"]').val();
                    // set inquiry type to form data
                    if (formType != '') {
                        this.addToFormData('inquiryType', parseInt(formType), form);
                    }
                }

                
            }
            Plugins.DWSFormsContactInformationSectionDataPreProcessing = DWSFormsContactInformationSectionDataPreProcessing;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
