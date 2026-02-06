"use strict";
var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DWSFormsDeliveryDetailsSectionDataPreProcessing extends DealerCenter.WebSite.Plugins.DWSFormsDataPreProcessing {
                constructor(field, form) {
                    super();
                    this.field = field;
                    this.form = form;
                }
                /**
                 * initialize class
                 */
                init() {
                    // check if valid inquiry type
                    if ((this.form.data('form-data').inquiryType == 20 && this.form.data('form-data').secondaryInquiryType == 'LocalHomeDelivery') // local home delivery
                    ) {
                        this.addDeliveryDetailsToCommentField(this.field, this.form);
                    }
                }
                addDeliveryDetailsToCommentField(field, form) {
                    // check if field is exists
                    var commentField = form.find('textarea[data-form-json-field-map="applicant.comments"]');
                    var deliveryStreetField = form.find('input#dws-forms-street-input[data-form-section="delivery_details"]');
                    if (commentField.length > 0 && deliveryStreetField.length > 0 && (field.attr('id') == 'dws-forms-street-input' && field.data('form-section') == 'delivery_details')) {
                        // get delivery street value
                        var deliveryStreetValue = deliveryStreetField.val();
                        var deliveryCityValue = this.sanitizedElementValue(form.find('input#dws-forms-city-input[data-form-section="delivery_details"]'));
                        var deliveryStateValue = this.sanitizedElementValue(form.find('select#dws-forms-state-input[data-form-section="delivery_details"]'));
                        var deliveryZipCodeValue = this.sanitizedElementValue(form.find('input#dws-forms-zip-code-input[data-form-section="delivery_details"]'));
                        var deliveryDateValue = this.sanitizedElementValue(form.find('input#dws-forms-delivery-date-input[data-form-section="delivery_details"]'));
                        var deliveryTimeValue = this.sanitizedElementValue(form.find('input#dws-forms-delivery-time-input[data-form-section="delivery_details"]'));
                        var deliveryTimeZoneValue = this.sanitizedElementValue(form.find('select#dws-forms-timezone-method-input[data-form-section="delivery_details"]'));
                        // add delivery street value to comment field
                        commentField.val(`${commentField.val()}\n\n~~~\nDelivery Address: ${deliveryStreetValue}, ${deliveryCityValue}, ${deliveryStateValue} ${deliveryZipCodeValue} \nPreferred date/time of delivery: ${deliveryDateValue}, ${deliveryTimeValue} ${deliveryTimeZoneValue}`);
                        // set comment field value to form data
                        this.addToFormData('applicant.comments', commentField.val(), form);
                    }
                }
                sanitizedElementValue(element) {
                    if (element.length == 0) {
                        return '';
                    }
                    return element.val();
                }
            }
            Plugins.DWSFormsDeliveryDetailsSectionDataPreProcessing = DWSFormsDeliveryDetailsSectionDataPreProcessing;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
