var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DwsFormsDepositFormFunctionality extends DealerCenter.WebSite.Plugins.DWSFormsScript {
                constructor(form) {
                    super(form);
                    this.paymentProcessInit = false;
                    this.paymentProcessCount = 0;
                    this.runHostedCheckoutCount = 0;
                    this.form = form;
                    this.initDepositForm();
                }
                /**
                 * Initialize form
                 * @param form
                 * @returns {}
                 */
                initDepositForm() {
                    var $ = jQuery;
                    console.log('setting contact and billing information...');
                    this.setContactBillingInformation();
                    this.setDepositPaymentInformation();
                    this.moveToStep4();
                    this.resetSteps();
                }
                setContactBillingInformation() {
                    var $ = jQuery;
                    var form = this.form;
                    $(form).on('click', '#depositStep1 .dws-forms-payment-button-submit', (event) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            this.paymentProcessInit = true;
                            this.paymentProcessCount = 0;
                            this.runHostedCheckoutCount = 0;
                            // hide error message wrapper
                            this.formErrorMessageWrapper.hide();
                            // hide validation error message wrapper
                            this.formValidationErrorMessageWrapper.hide();
                            var step2Parent = $('#depositStep2', form);
                            step2Parent.find('#dws-forms-deposit-amount-input').prop("disabled", true);
                            let countInvalidFields = yield this.markDepositFormFieldsInvalid();
                            // if there are invalid fields, then show error message and return
                            if (countInvalidFields > 0) {
                                console.log('invalid field input found.');
                                this.showSubmissionValidationErrorMessage();
                                return;
                            }
                            else {
                                var btn = form.find('.dws-forms-payment-button-submit');
                                this.setLoadingBtn(btn);
                                // map form fields to form-data object
                                yield this.mapFormFields();
                                yield this.mapDepositFormFields();
                                // set reCAPTCHA token in form-data object
                                yield this.setReCaptchaToken();
                                var csrfToken = yield this.getCsrfToken();
                                // set referer and traffic source from cookies
                                this.setRefererAndTrafficSource();
                                // do submit form process
                                var ajaxOptions = this.getAjaxOptions();
                                ajaxOptions.url = '/api/dealerwebsite/form';
                                var submitResult = yield this.submitDepositForm(ajaxOptions, csrfToken, btn);
                                this.response = submitResult;
                                if (('statusCode' in submitResult) && (submitResult.statusCode == 'OK')) {
                                    // assign values to step 2
                                    step2Parent.find('.dws-deposit-amount').text('$' + submitResult.depositInfo.requiredDepositAmount.toFixed(2));
                                    step2Parent.find('#dws-forms-deposit-amount-input').prop("disabled", false);
                                    step2Parent.find('#dws-forms-deposit-amount-input').prop('required', true);
                                    step2Parent.find('#dws-forms-deposit-amount-input').attr('min', submitResult.depositInfo.requiredDepositAmount);
                                    if (submitResult.depositInfo.cardProcessFeeType == null) {
                                        step2Parent.find('.dws-forms-processing-fee').hide();
                                        step2Parent.find('.dws-forms-total-amount').hide();
                                    }
                                    else {
                                        var processFee = '';
                                        if (submitResult.depositInfo.cardProcessFeeType == 1 && (submitResult.depositInfo.cardProcessFeeAmount != null && submitResult.depositInfo.cardProcessFeeAmount > 0)) {
                                            processFee = '$' + submitResult.depositInfo.cardProcessFeeAmount.toFixed(2);
                                            step2Parent.find('#dws-forms-processing-fee-input').val('Processing Fee $' + submitResult.depositInfo.cardProcessFeeAmount.toFixed(2));
                                        }
                                        if (submitResult.depositInfo.cardProcessFeeType == 2 && (submitResult.depositInfo.cardProcessFeePercent != null && submitResult.depositInfo.cardProcessFeePercent > 0)) {
                                            processFee = submitResult.depositInfo.cardProcessFeeAmount.toFixed(2) + '%';
                                            step2Parent.find('#dws-forms-processing-fee-input').val('Processing Fee $0');
                                        }
                                        step2Parent.find('.dws-deposit-processing-fee').text(`${processFee}`);
                                    }
                                    this.showNextStep(step2Parent);
                                    if (submitResult.depositInfo.depositGoodThroughDays != 0) {
                                        let takeDepositCurrentDate = new Date();
                                        takeDepositCurrentDate.setDate(takeDepositCurrentDate.getDate() + submitResult.depositInfo.depositGoodThroughDays);
                                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        let depositGoodThroughDate = monthNames[takeDepositCurrentDate.getMonth()] + ' ' + takeDepositCurrentDate.getDate() + ', ' + takeDepositCurrentDate.getFullYear();
                                        var depositIsNonRefundable = '';
                                        if (submitResult.depositInfo.depositIsNonRefundable) {
                                            depositIsNonRefundable = ' and is <strong>NON-REFUNDABLE</strong>';
                                        }
                                        $('#deposit-details', form).html(`This deposit will be good through <strong>${depositGoodThroughDate}</strong>${depositIsNonRefundable}.`);
                                    }
                                }
                                else {
                                    // show error message
                                    this.showSubmissionErrorMessage();
                                }
                            }
                        }
                        catch (e) {
                            console.log('form submit error: ' + e);
                            // show error message
                            this.showSubmissionErrorMessage();
                        }
                        finally {
                            // enable submit button
                            this.setLoadingBtn(btn, false);
                        }
                    }));
                }
                setDepositPaymentInformation() {
                    var $ = jQuery;
                    var form = this.form;
                    var step2Parent = $('#depositStep2', form);
                    $('#dws-forms-deposit-amount-input', form).on('change', (event) => {
                        var _a, _b;
                        var amount = $(event.currentTarget).val() ? $(event.currentTarget).val() : 0;
                        var type = this.response.depositInfo.cardProcessFeeType;
                        var cardProcessFeeAmount = (_a = this.response.depositInfo.cardProcessFeeAmount) !== null && _a !== void 0 ? _a : 0;
                        var cardProcessFeePercent = (_b = this.response.depositInfo.cardProcessFeePercent) !== null && _b !== void 0 ? _b : 0;
                        var total = 0;
                        if (type == 1) {
                            total = parseFloat(amount) + parseFloat(cardProcessFeeAmount);
                        }
                        else {
                            var processFeeAmount = cardProcessFeePercent > 0 ? cardProcessFeePercent / 100 : 0;
                            var processFee = parseFloat((parseFloat(amount) * processFeeAmount).toFixed(2));
                            total = parseFloat((parseFloat(amount) + processFee).toFixed(2));
                            step2Parent.find('#dws-forms-processing-fee-input').val('Processing Fee $' + processFee);
                        }
                        $('#dws-forms-total-amount-input', form).val('Total Amount $' + total.toFixed(2));
                        this.depositAmount = amount;
                        this.amountToPay = total.toFixed(2);
                        if (amount < this.response.depositInfo.requiredDepositAmount) {
                            $('.dws-forms-validation-feedback-deposit_details-deposit_amount', form).text("The minimum deposit amount required for this vehicle is $" + this.response.depositInfo.requiredDepositAmount.toFixed(2));
                        }
                    });
                    $(form).on('click', '#depositStep2 .dws-forms-payment-button-submit', (event) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            // hide error message wrapper
                            this.formErrorMessageWrapper.hide();
                            // hide validation error message wrapper
                            this.formValidationErrorMessageWrapper.hide();
                            let countInvalidFields = yield this.markInvalidFormFields();
                            // if there are invalid fields, then show error message and return
                            if (countInvalidFields > 0) {
                                console.log('invalid field input found.');
                                this.showSubmissionValidationErrorMessage();
                                return;
                            }
                            else {
                                var form = this.form;
                                var btn = form.find('.dws-forms-payment-button-submit');
                                this.setLoadingBtn(btn);
                                // map form fields to form-data object
                                yield this.mapFormFields();
                                yield this.setRetrieveDepositVantivHostedCheckoutUrl();
                                // set reCAPTCHA token in form-data object
                                yield this.setReCaptchaToken();
                                var csrfToken = yield this.getCsrfToken();
                                var ajaxOptions = this.getAjaxOptions();
                                ajaxOptions.url = '/api/dealerwebsite/form/retrieve-deposit-vantiv-hosted-checkout-url';
                                var response = yield this.submitDepositForm(ajaxOptions, csrfToken, btn);
                                if (response.statusCode == 'SUCCESS' && response.success) {
                                    var step3Parent = $('#depositStep3');
                                    var step3VantivIframe = $('.bhph-vantiv-iframe-container #vantiv-iframe', form);
                                    if (step3VantivIframe.length == 0) {
                                        $('.bhph-vantiv-iframe-container', form).html('<iframe class="vantiv-hosted-checkout-iframe is-loading" id="vantiv-iframe"></iframe>');
                                        step3VantivIframe = $('.bhph-vantiv-iframe-container #vantiv-iframe', form);
                                    }
                                    if ((response.checkoutUrl).includes("hostedpayments.com")) {
                                        step3VantivIframe.removeClass("is-loading");
                                        step3VantivIframe.addClass("worldpay");
                                    }
                                    step3VantivIframe.attr('src', response.checkoutUrl);
                                    $('.bhph-vantiv-iframe-container', form).show();
                                    this.showNextStep(step3Parent);
                                    var paymentId = '';
                                    var url = new URL(response.checkoutUrl);
                                    if (url.searchParams.has("pid")) {
                                        paymentId = url.searchParams.get("pid");
                                    }
                                    if (url.searchParams.has("TransactionSetupID")) {
                                        paymentId = url.searchParams.get("TransactionSetupID");
                                    }
                                    if (url.searchParams.has("setupID")) {
                                        paymentId = url.searchParams.get("setupID");
                                    }
                                    if (paymentId != '') {
                                        this.runHostedCheckout(paymentId, response.customerGuid, response.inventoryGuid);
                                    }
                                }
                                else {
                                    // show error message
                                    this.showSubmissionErrorMessage();
                                }
                            }
                        }
                        catch (e) {
                            console.log('form submit error: ' + e);
                            // show error message
                            this.showSubmissionErrorMessage();
                        }
                        finally {
                            // enable submit button
                            this.setLoadingBtn(btn, false);
                        }
                    }));
                }
                runHostedCheckout(paymentId, customerGuid, inventoryGuid) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var form = this.form;
                        if (this.paymentProcessInit && this.runHostedCheckoutCount < 6 && typeof form.data('form-data') !== 'undefined' && form.data('form-data') !== null) {
                            console.log('running hosted checkout...');
                            var payload = {
                                dcCompanyId: form.data('form-data').dcCompanyId,
                                vantivPaymentId: paymentId
                            };
                            var csrfToken = yield this.getCsrfToken();
                            var response = yield this.submitPaymentProcessHandler('/api/dealerwebsite/form/run-deposit-hosted-checkout', payload, csrfToken);
                            if (response.responseCode == 1) {
                                console.log('payment was successful');
                                this.processCompletePayment(response, paymentId, customerGuid, inventoryGuid);
                            }
                            else {
                                console.log('payment is still pending, checking again...');
                                setTimeout(() => {
                                    if (this.runHostedCheckoutCount > 0) {
                                        console.log('remaining runHostedCheckout attempts - ', this.runHostedCheckoutCount, 'of 5', 'Retrying..');
                                        this.runHostedCheckoutCount++;
                                    }
                                    this.runHostedCheckout(paymentId, customerGuid, inventoryGuid);
                                }, 3000);
                            }
                        }
                        if (this.paymentProcessInit && this.runHostedCheckoutCount >= 6) {
                            console.log('runHostedCheckout failed after 5 attempts');
                            var activeTab = $('.dws-tab-container a.nav-link.active', form);
                            if (activeTab.attr('id') != 'depositStep4Tab') {
                                $("#dws-forms-process-complete-state", form).trigger("click");
                            }
                            var step3VantivIframeContainer = $('.bhph-vantiv-iframe-container', form);
                            step3VantivIframeContainer.html(`<div class="failed-transaction-page-container">
                <h3>We are unable to process your transaction at this time. Please try again later.</h3>
            </div>`);
                            this.paymentProcessInit = false;
                            this.paymentProcessCount = 0;
                            this.runHostedCheckoutCount = 0;
                        }
                    });
                }
                submitPaymentProcessHandler(apiUrl, payload, csrfToken) {
                    console.log('submitting payment process...');
                    var $ = jQuery;
                    // submit form via AJAX POST
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: apiUrl,
                            method: 'post',
                            headers: {
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            contentType: 'application/json',
                            processData: true,
                            data: JSON.stringify(payload),
                            success: (response) => {
                                console.log('submitted successfully');
                                resolve(response);
                            },
                            error: (response) => {
                                console.log('submit error');
                                reject(response);
                            }
                        });
                    });
                }
                processCompletePayment(hostedCheckoutResponse, paymentId, customerGuid, inventoryGuid) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var $ = jQuery;
                        var form = this.form;
                        console.log('processing complete payment...');
                        var payload = {
                            "dcid": form.data('form-data').dcCompanyId,
                            "lId": (form.data('form-data').leadId).toString(),
                            "inquiryType": form.data('form-data').inquiryType,
                            "secondaryInquiryType": form.data('form-data').secondaryInquiryType,
                            "cid": customerGuid,
                            "iid": inventoryGuid,
                            "inr": form.data('form-data').isNonRefundable ? '0' : '1',
                            "da": (form.data('form-data').depositAmount).toString(),
                            "gdtd": (form.data('form-data').goodThroughDays).toString(),
                            "paymentID": paymentId,
                            "returnCode": (hostedCheckoutResponse.responseCode).toString(),
                            "returnMessage": hostedCheckoutResponse.responseMessage,
                            "session": form.data('form-data').session,
                        };
                        var csrfToken = yield this.getCsrfToken();
                        var response = yield this.submitPaymentProcessHandler('/api/dealerwebsite/form/deposit-process-complete-url', payload, csrfToken);
                        if (response.success && response.statusCode == 'OK') {
                            console.log('payment was successfully processed');
                            console.log('Showing receipt button...');
                            var activeTab = $('.dws-tab-container a.nav-link.active', form);
                            if (activeTab.attr('id') != 'depositStep4Tab') {
                                $("#dws-forms-process-complete-state", form).trigger("click");
                            }
                            var step3VantivIframeContainer = $('.bhph-vantiv-iframe-container', form);
                            var printBtn = response.hasReceipt ? '<div class="invoke-print-receipt btn">Print Receipt Here!</div>' : '';
                            step3VantivIframeContainer.html(`<div class="process-complete-page-container">
                <h3 id="process-complete-message">${(response.message).toUpperCase()}</h3>
                ${printBtn}
            </div>`);
                            if (response.receiptString != "") {
                                let receiptLocation = response.hostName + '/deposit/receipt';
                                var target = 'print_popup';
                                if (navigator.userAgent.match(/iPhone|iPad|iPod/i) && navigator.userAgent.match(/DuckDuckGo/i)) {
                                    target = '_parent';
                                }
                                var existingForm = $("form#reciept-form-open-new-tab");
                                if (existingForm.length > 0) {
                                    existingForm.remove();
                                }
                                var form = $("<form id='reciept-form-open-new-tab' action='" + receiptLocation + "' target='" + target + "' method='post'></form>");
                                form.append($("<input type='hidden' name='receipt_string' value='" + response.receiptString + "'/>"));
                                $("body").append(form);
                            }
                            $(document).on('click', '.bhph-vantiv-iframe-container .invoke-print-receipt', (event) => {
                                this.printBhphPdfReceipt(event);
                            });
                        }
                        if (!response.success) {
                            this.paymentProcessCount++;
                            console.log('payment did not successfully process. remaining attempts - ', this.paymentProcessCount, 'of 5', 'Retrying..');
                            if (this.paymentProcessInit && this.paymentProcessCount >= 5) {
                                console.log('payment process failed after 5 attempts');
                                var activeTab = $('.dws-tab-container a.nav-link.active', form);
                                if (activeTab.attr('id') != 'depositStep4Tab') {
                                    $("#dws-forms-process-complete-state", form).trigger("click");
                                }
                                var step3VantivIframeContainer = $('.bhph-vantiv-iframe-container', form);
                                step3VantivIframeContainer.html(`<div class="failed-transaction-page-container">
                  <h3>We are unable to process your transaction at this time. Please try again later.</h3>
              </div>`);
                                this.paymentProcessInit = false;
                                this.paymentProcessCount = 0;
                            }
                            if (this.paymentProcessInit && this.paymentProcessCount < 5) {
                                setTimeout(() => {
                                    this.processCompletePayment(hostedCheckoutResponse, paymentId, customerGuid, inventoryGuid);
                                }, 3000);
                            }
                        }
                    });
                }
                printBhphPdfReceipt(event) {
                    event.preventDefault();
                    $("#reciept-form-open-new-tab").submit();
                }
                moveToStep4() {
                    var $ = jQuery;
                    var form = this.form;
                    var step4Parent = $('#depositStep4', form);
                    $('#dws-forms-process-complete-state', form).on('click', (event) => {
                        this.runHostedCheckoutCount++;
                        this.showNextStep(step4Parent);
                    });
                    $('#dws-forms-payment-completed', form).on('click', (event) => {
                        this.paymentProcessInit = false;
                    });
                }
                setRetrieveDepositVantivHostedCheckoutUrl() {
                    return new Promise(resolve => {
                        var form = this.form;
                        form.data('form-data').leadId = this.response.leadId;
                        form.data('form-data').customerId = this.response.customerGuid;
                        form.data('form-data').inventoryId = form.data('form-data').interestedVehicle.inventoryId;
                        form.data('form-data').amountToPay = this.amountToPay;
                        form.data('form-data').depositAmount = this.depositAmount;
                        form.data('form-data').goodThroughDays = this.response.depositInfo.depositGoodThroughDays;
                        form.data('form-data').isNonRefundable = this.response.depositInfo.depositIsNonRefundable;
                        // add mobile flag to form data
                        form.data('form-data').isMobile = this.isMobile();
                        resolve();
                    });
                }
                submitDepositForm(ajaxOptions, csrfToken, submitBtn = null) {
                    var $ = jQuery;
                    // submit form via AJAX POST
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: ajaxOptions.url,
                            method: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': csrfToken
                            },
                            contentType: ajaxOptions.contentType,
                            processData: ajaxOptions.processData,
                            data: ajaxOptions.data,
                            success: (response) => {
                                console.log('form submitted successfully: ' + response.statusCode);
                                this.setLoadingBtn(submitBtn, false);
                                resolve(response);
                            },
                            error: (response) => {
                                console.log('form submit error: ' + response.message);
                                this.setLoadingBtn(submitBtn, false);
                                reject(response);
                            }
                        });
                    });
                }
                showNextStep(stepParent) {
                    var $ = jQuery;
                    var form = this.form;
                    form.removeClass('was-validated');
                    // hide step 1 and show step 2
                    var activePanel = $('.dws-forms-tab-content-dwsTabContentdeposit .tab-pane.active', form);
                    var activeTab = $('.dws-tab-container a.nav-link.active', form);
                    // hide current tab
                    activeTab.removeClass('active');
                    activePanel.removeClass('active');
                    activeTab.parent('.nav-item').removeClass('active').addClass('disabled');
                    activeTab.parent('.nav-item').find('.nav-link').removeAttr('data-toggle');
                    activeTab.parent('.nav-item').find('.nav-link').removeAttr('data-target');
                    // show next tab
                    activeTab.parent('.nav-item').next('.nav-item').addClass('active').removeClass('disabled');
                    activeTab.parent('.nav-item').next('.nav-item').find('.nav-link').addClass('active');
                    activeTab.parent('.nav-item').next('.nav-item').find('.nav-link').attr('data-toggle', 'tab');
                    activeTab.parent('.nav-item').next('.nav-item').find('.nav-link').attr('data-target', '#' + stepParent.attr('id'));
                    activePanel.next('.tab-pane').addClass('active');
                    this.form.removeClass('was-validated');
                }
                resetSteps() {
                    var $ = jQuery;
                    var form = this.form;
                    var dwsFormsModal = $('.dws-forms-modal-deposit');
                    dwsFormsModal.on('hidden.bs.modal', (event) => {
                        if (event.target.classList.contains('dws-forms-modal-deposit')) {
                            var activeTab = $('.dws-tab-container li.nav-item.active', form);
                            var activeTabLink = $('.dws-tab-container a.nav-link.active', form);
                            var lastTab = $('.dws-tab-container .last-step-item', form);
                            var activePanel = $('.dws-forms-tab-content-dwsTabContentdeposit .tab-pane.active', form);
                            // hide current tab
                            activeTab.removeClass('active');
                            activeTabLink.removeClass('active');
                            lastTab.removeClass('active');
                            activePanel.removeClass('active');
                            form.find('.nav a:first').addClass('active');
                            form.find('.dws-forms-tab-content-dwsTabContentdeposit .tab-pane:first').addClass('active');
                            var iframe = form.find('.bhph-vantiv-iframe-container #vantiv-iframe');
                            iframe.empty();
                            iframe.attr('src', '');
                            $('.bhph-vantiv-iframe-container', form).hide();
                            this.paymentProcessInit = false;
                            this.paymentProcessCount = 0;
                            this.runHostedCheckoutCount = 0;
                        }
                    });
                }
                markDepositFormFieldsInvalid() {
                    var $ = jQuery;
                    var form = this.form;
                    var visibleFormField = form.find('.tab-pane.active');
                    console.log('getting list of invalid fields...');
                    var invalidFields = visibleFormField.find('.dws-forms-form-control:invalid, .dws-forms-form-select:invalid, .dws-forms-form-radio:invalid, .dws-forms-form-checkbox:invalid, .dws-forms-form-textarea:invalid');
                    // add auto focus to the first invalid field
                    invalidFields.first().focus();
                    console.log(invalidFields);
                    return new Promise((resolve, reject) => {
                        let count = invalidFields.length;
                        form.addClass('was-validated');
                        resolve(count);
                    });
                }
                mapDepositFormFields() {
                    return new Promise(resolve => {
                        var form = this.form;
                        // add addressTypeId to form-data object
                        this.form.data('form-data').applicant.address.addressTypeId = 1;
                        if (typeof form.data('form-data').applicant.employer !== 'undefined' && form.data('form-data').applicant.employer !== null) {
                            form.data('form-data').hasAdditionalApplicantDetail = true;
                        }
                        else {
                            form.data('form-data').hasAdditionalApplicantDetail = false;
                        }
                        resolve();
                    });
                }
                /**
                 * Method to get and set referer and traffic source from cookies
                 */
                setRefererAndTrafficSource() {
                    console.log('setting referer and traffic source...');
                    var form = this.form;
                    // get referer and traffic source from cookies
                    var referer = '';
                    var trafficSource = decodeURIComponent(DwsFormsDepositFormFunctionality.getCookie('dws-trs'));
                    if (trafficSource != '') {
                        var trafficSourceObj = JSON.parse(trafficSource);
                        referer = trafficSourceObj.RF;
                    }
                    var trafficSourceFromScript = decodeURIComponent(DwsFormsDepositFormFunctionality.getCookie('dws-ts-js'));
                    form.data('form-data').session.referrer = referer != '' ? referer : null;
                    form.data('form-data').session.sourceMedian = trafficSourceFromScript != '' ? trafficSourceFromScript : null;
                }
                /**
                 * Method to get cookie value
                 * @param cookieName
                 * @returns {string}
                 */
                static getCookie(cookieName) {
                    var nameWithEqual = cookieName + '=';
                    var cookieStrings = document.cookie.split(';');
                    for (var i = 0; i < cookieStrings.length; i++) {
                        var cookieString = cookieStrings[i];
                        while (cookieString.charAt(0) == ' ') {
                            cookieString = cookieString.substring(1);
                        }
                        if (cookieString.indexOf(nameWithEqual) == 0) {
                            return cookieString.substring(nameWithEqual.length, cookieString.length);
                        }
                    }
                    return '';
                }
                setLoadingBtn(btn, isLoading = true) {
                    var $ = jQuery;
                    if (!btn || !btn.length) {
                        return;
                    }
                    if (isLoading) {
                        btn.prop('disabled', true);
                        btn.find('.dws-forms-payment-button-submit-label').hide();
                        btn.find('.spinner-border').css('display', 'block');
                    }
                    else {
                        btn.prop('disabled', false);
                        btn.find('.dws-forms-payment-button-submit-label').show();
                        btn.find('.spinner-border').hide();
                    }
                }
                /**
                 * Method to check if user is on mobile device
                 * @returns {boolean}
                 */
                isMobile() {
                    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent);
                }
            }
            Plugins.DwsFormsDepositFormFunctionality = DwsFormsDepositFormFunctionality;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
