var DealerCenter;
(function (DealerCenter) {
    var WebSite;
    (function (WebSite) {
        var Common;
        (function (Common) {
            var LazyLoad = (function () {
                function LazyLoad() {
                }
                LazyLoad.startObserve = function (selector) {
                    if (selector === void 0) { selector = ''; }
                    // Before using this method make sure to check if parent class is accessible
                    // if((typeof DealerCenter.WebSite.Common.LazyLoad) === 'function'){ DealerCenter.WebSite.Common.LazyLoad.startObserve();
                    if (selector.length > 0) {
                        var el = document.querySelectorAll(selector);
                        lozad(el).observe();
                    }
                    else {
                        lozad().observe();
                    }
                };
                return LazyLoad;
            }());
            Common.LazyLoad = LazyLoad;
        })(Common = WebSite.Common || (WebSite.Common = {}));
    })(WebSite = DealerCenter.WebSite || (DealerCenter.WebSite = {}));
})(DealerCenter || (DealerCenter = {}));
