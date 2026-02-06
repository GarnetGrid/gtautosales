"use strict";
var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            class DWS_Input_Price_Format {
                static formatPrice(element) {
                    // format price without mask
                    jQuery(element).focusout(function () {
                        var inputValue = jQuery(element).val();
                        // if input value is empty, do nothing
                        if (!inputValue || inputValue == '') {
                            return;
                        }
                        var price = DWS_Input_Price_Format.sanitizedMoneyValue(inputValue);
                        jQuery(element).val(DWS_Input_Price_Format.formatCurrency(price));
                    });
                    // remove $ on focus
                    jQuery(element).focusin(function () {
                        var inputValue = jQuery(element).val();
                        if (inputValue && inputValue != '') {
                            jQuery(element).val(DWS_Input_Price_Format.sanitizedMoneyValue(inputValue));
                        }
                    });
                }
                static formatCurrency(value, isDecimal = false) {
                    let formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        useGrouping: true
                    });
                    if (isDecimal) {
                        formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                    }
                    return formatter.format(value);
                }
                static sanitizedMoneyValue(value) {
                    if (!value || value == '') {
                        return 0;
                    }
                    return value.replace('$', '').replace(/,/g, '');
                }
            }
            Plugins.DWS_Input_Price_Format = DWS_Input_Price_Format;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
