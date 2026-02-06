var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Plugins;
        (function (Plugins) {
            var DWSNumbersOnlyFields = /** @class */ (function () {
                function DWSNumbersOnlyFields() {
                }
                DWSNumbersOnlyFields.numbersOnly = function (element) {
                    jQuery(element).on('input', function (event) {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        if ((event.which < 48 || event.which > 57)) {
                            event.preventDefault();
                        }
                    });
                };
                DWSNumbersOnlyFields.numberOnlyAmountField = function (element) {
                    jQuery(element).on('input', function (event) {
                        this.value = this.value.replace(/[^0-9.]/g, '');
                        // Allow: 0 to 9
                        if (this.value.length > 0 && this.value[0] === '.') {
                            this.value = this.value.substr(1);
                        }
                        if (this.value.length > 1 && this.value[0] === '0' && this.value[1] !== '.') {
                            this.value = this.value.substr(1);
                        }
                        if (this.value.indexOf('.') !== -1) {
                            this.value = this.value.substr(0, this.value.indexOf('.') + 3);
                        }
                        // limit to one decimal point
                        var decimalCount = (this.value.match(/\./g) || []).length;
                        if (decimalCount > 1) {
                            this.value = this.value.substr(0, this.value.lastIndexOf('.'));
                        }
                        if ((event.which < 48 || event.which > 57)) {
                            event.preventDefault();
                        }
                    });
                };
                DWSNumbersOnlyFields.stripLeadingZeros = function (element) {
                    jQuery(element).on('input', function (event) {
                        var $this = jQuery(this);
                        if ($this.val().length > 0 && $this.val().charAt(0) === '0') {
                            $this.val($this.val().replace(/^0+/, ''));
                        }
                    });
                };
                return DWSNumbersOnlyFields;
            }());
            Plugins.DWSNumbersOnlyFields = DWSNumbersOnlyFields;
        })(Plugins = WebSite.Plugins || (WebSite.Plugins = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
