
    if (!window.AS) AS = {};
    if (!window.autosweetGA) autosweetGA = {};
    AS.pixel = {
        bodyText: null,
        doPixelWork: function () {
            if (document.readyState != "complete") {
                setTimeout(function () {
                    AS.pixel.doPixelWork();
                }, 250);
            } else {
                AS.pixel.bodyText = AS.pixel.getText();
                  AS.pixel.loadFacebookAPI();
                  AS.pixel.doPhoneNumberSwapWork();

        			    AS.pixel.doFacebookWork(6687, "732447354707391", "VIN");
            }
        },

    
        loadFacebookAPI: function () {
        !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        }; if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        },
        doFacebookWork: function (dealerID, pixelID, productIdType) {
        if (!window.fbq) {
        setTimeout(function () {
        AS.pixel.doFacebookWork(dealerID, pixelID, productIdType);
        }, 250);
        } else {
        AS.pixel.connectFB(pixelID, productIdType);
        }
        },
        connectFB: function (pixelID, productIdType) {
        if (window.fbq) {
        window.fbq('init', pixelID);
        window.fbq('track', 'PageView');
        AS.pixel.analyzePage(pixelID, productIdType);
        }
        },
        analyzePage: function (pixelID, productIdType) {
        var pIds = productIdType == "VIN" ? AS.pixel.getPageVins() : AS.pixel.getPageStockNumbers();
        if (pIds && pIds.length) {
        window.fbq("trackSingle", pixelID, "ViewContent", {
        content_type: "product",
        content_ids: pIds
        });
        window.fbq("trackSingle", pixelID, "ViewContent", {
        content_type: "vehicle",
        content_ids: pIds
        });
        }
        },
        getPageVins: function () {
        var retVins = [];
        var vRe = /\b[a-hj-npr-z0-9]{17}\b/gi;

        for (var p = 0, props = [AS.pixel.bodyText, document.body['innerHTML']]; p < props.length; p++) {
        if (!retVins.length) {
        var dit = props[p];
        var curVin;
        do {
        curVin = vRe.exec(dit);
        if (curVin && curVin.length) {
        curVin = curVin[0];
        var wasFound = false;
        for (var i = 0; i < retVins.length; i++) {
        if (retVins[i].toUpperCase() == curVin.toUpperCase()) {
        wasFound = true;
        break;
        }
        }
        if (!wasFound && curVin.match(/[a-z]/i) && !curVin.substr(12,5).match(/[a-z]/i)) retVins.push(curVin.toUpperCase());
        }
        } while (curVin != null);
        }
        }
        return retVins;
        },
        getPageStockNumbers: function () {
        var retStockNumbers = [];
        var vRe = /(St(o?c)?k\s*|ID)(?:ID|#|N(?:o[\.]?|um(?:ber)?))?[:-\s]\s*([\w-]*)/gi;

        for (var p = 0, props = [AS.pixel.bodyText, document.body['innerHTML']]; p < props.length; p++) {
        if (!retStockNumbers.length) {
        var dit = props[p];
        var curStockNumber;
        do {
        curStockNumber = vRe.exec(dit);
        if (curStockNumber && curStockNumber.length > 1) {
        curStockNumber = curStockNumber[curStockNumber.length - 1];
        var wasFound = false;
        for (var i = 0; i < retStockNumbers.length; i++) {
        if (retStockNumbers[i] == curStockNumber) {
        wasFound = true;
        break;
        }
        }
        if (!wasFound) retStockNumbers.push(curStockNumber);
        }
        } while (curStockNumber != null);
        }
        }

        return retStockNumbers;
        },
    

    

        
        doPhoneNumberSwapWork: function () {
        var asCookie = AS.pixel.cookieHandler.getCookie("AutoSweetSource");
        var urlVars = AS.pixel.getURLVars();
        var sourceMatch = /AutoSweet/gi.exec(urlVars["utm_source"]);
        var mediumMatch = /referral|email/gi.exec(urlVars["utm_medium"]);
        var campaignMatch = /autosweet/gi.exec(urlVars["utm_campaign"]);
        
        if (asCookie || (sourceMatch && mediumMatch) || campaignMatch) {
        AS.pixel.cookieHandler.setCookie("AutoSweetSource", "true", 3);
        
        var trackingNumbers = AS.pixel.determineTrackingNumbers(urlVars["utm_source"], mediumMatch, campaignMatch);
        if (trackingNumbers != null) {
        
        var pageNumberInfo = AS.pixel.getPageNumberInfo(trackingNumbers);
        
        var possiblePhoneNumbers = pageNumberInfo.possiblePhoneNumbers;
        if (possiblePhoneNumbers.length > 0) {
        
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++)
        {
        var number = null;
        if (anchors[i].href.length >= 10) {
        number = anchors[i].href.substr(anchors[i].href.length - 10);
        }
        if (number && trackingNumbers[number]) {
        anchors[i].href = anchors[i].href.replace(number, trackingNumbers[number]);
        }
        }
        var nds = document.querySelectorAll("*");
        for (var i = 0; i < nds.length; i++)
        {
        var childNodes = nds[i].childNodes;
        for (var j = 0; j < childNodes.length; j++)
        {
        var cNode = childNodes[j];
        if (cNode.nodeType == Node.TEXT_NODE)
        {
        for (var k = 0; k < possiblePhoneNumbers.length; k++) {
        var numberConfig = possiblePhoneNumbers[k];
        for (var l = 0; l < numberConfig.variants.length; l++) {
        var oldPhoneNumber = numberConfig.variants[l];
        
        var newPhoneNumber = AS.pixel.getReplacementNumber(numberConfig.phoneNumber, trackingNumbers[numberConfig.phoneNumber], numberConfig.variants[l]);
        if (cNode.textContent && cNode.textContent.indexOf(oldPhoneNumber) > -1)
        {
        cNode.textContent = cNode.textContent.replace(oldPhoneNumber, newPhoneNumber);
        break;
        }
        }
        }
        }
        }
        }
        }
        
        if (pageNumberInfo.allNumbers != null) {
        var recentlySeenNumbers = [];
        var rulesToUpsert = [];
        for (var i = 0; i < pageNumberInfo.allNumbers.length; i++) {
        var phoneNumber = pageNumberInfo.allNumbers[i];
        
        if (recentlySeenNumbers.indexOf(phoneNumber) == -1) {
        rulesToUpsert.push(phoneNumber);
        }
        }
        if (rulesToUpsert.length) {
        AS.pixel.upsertPhoneNumbers(rulesToUpsert);
        }
        }
        }
        }
        },
        determineTrackingNumbers: function (source, mediumMatch, campaignMatch) {
        var retNumberMap = null;

        if (source != null && campaignMatch != null)
        {
        switch (source.toLowerCase())
        {
        case "facebook":
        retNumberMap = null;
        break;
        case "facebookmarketplace":
        retNumberMap = null;
        break;
        case "autosweet":
        if (mediumMatch && mediumMatch[0].toLowerCase() == "email")
        {
        retNumberMap = null;
        }
        break;
        case "craigslist":
        retNumberMap = null;
        break;
        case "google":
        retNumberMap = null;
        break;
        default:
        break;
        }
        if (retNumberMap != null && Object.keys(retNumberMap).length)
        {
        var trackingNumber = retNumberMap[Object.keys(retNumberMap)[0]];
        var enabledDNRs = [];
        for (var i = 0; i < enabledDNRs.length; i++) {
        var number = enabledDNRs[i];
        retNumberMap[number] = trackingNumber;
        }
        }
        }
        return retNumberMap;
        },
        getPageNumberInfo: function (trackingNumbers) {
        var dnrNumbers = [];
        var allNumbers = [];
        var possiblePhoneNumbers = [];
        var phoneNumberRegex = /(\+?1[-.\s]?)?(\(?[2-9][0-8][0-9]\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4})/gi;
        var phoneNumberMatch = phoneNumberRegex.exec(document.body.innerText);
        while (phoneNumberMatch != null) {
        var foundNumber = phoneNumberMatch[2];
        
        var cleanedNumber = foundNumber.replace(/[-.\s()]/gi, '');
        if (cleanedNumber.length == 10) {
        var wasFound = false;
        for (var i = 0; i < possiblePhoneNumbers.length; i++) {
        if (possiblePhoneNumbers[i].phoneNumber == cleanedNumber) {
        wasFound = true;
        
        if (possiblePhoneNumbers[i].variants.indexOf(foundNumber) < 0) {
        possiblePhoneNumbers[i].variants.push(foundNumber);
        }
        break;
        }
        }
        if (!wasFound && trackingNumbers != null && trackingNumbers[cleanedNumber] != null) {
        possiblePhoneNumbers.push({
        phoneNumber: cleanedNumber,
        variants: [foundNumber]
        });
        }
        
        if (allNumbers.indexOf(cleanedNumber) < 0 && trackingNumbers != null) {
        allNumbers.push(cleanedNumber);
        }
        }
        phoneNumberMatch = phoneNumberRegex.exec(document.body.innerText);
        }
        
        return {
        possiblePhoneNumbers: possiblePhoneNumbers,
        allNumbers: allNumbers
        };
        },
        upsertPhoneNumbers: function (phoneNumbers) {
        var newXHR = new XMLHttpRequest();
        newXHR.open('POST', 'https://extws.autosweet.com/ASPixel/DynamicNumberReplacementRules?did=6687&phoneNumbers=' + phoneNumbers.join(','));
        newXHR.send();
        },
        getReplacementNumber: function (oldNumber, newNumber, variant) {
        var retReplacement = variant;
        if (oldNumber && newNumber && variant) {
        if (/^\d{10}$/gi.test(oldNumber) && /^\d{10}$/gi.test(newNumber)) {
        var oldFirstThree = oldNumber.substring(0, 3);
        var oldMiddleThree = oldNumber.substring(3, 6);
        var oldLastFour = oldNumber.substring(6, 10);
        var newFirstThree = newNumber.substring(0, 3);
        var newMiddleThree = newNumber.substring(3, 6);
        var newLastFour = newNumber.substring(6, 10);

        var firstThreeIndex = variant.indexOf(oldFirstThree);
        retReplacement = retReplacement.substr(0, firstThreeIndex) + newFirstThree + retReplacement.substr(firstThreeIndex + newFirstThree.length);
        var middleThreeIndex = variant.indexOf(oldMiddleThree, firstThreeIndex);
        retReplacement = retReplacement.substr(0, middleThreeIndex) + newMiddleThree + retReplacement.substr(middleThreeIndex + newMiddleThree.length);
        var lastFourIndex = variant.indexOf(oldLastFour, middleThreeIndex);
        retReplacement = retReplacement.substr(0, lastFourIndex) + newLastFour + retReplacement.substr(lastFourIndex + newLastFour.length);
        }
        }
        return retReplacement;
        },
        getURLVars: function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
        });
        return vars;
        },
        cookieHandler: {
        getCookie: function (name) {
        var allCookies = document.cookie.split(';');
        if (allCookies) {
        for (var i = 0; i < allCookies.length; i++) {
        var key = allCookies[i].substr(0, allCookies[i].indexOf('=')).trim();
        var value = allCookies[i].substr(allCookies[i].indexOf('=') + 1);
        if (key == name) {
        return unescape(value);
        }
        }
        }
        return null;
        },
        setCookie: function (name, value, exmins, domain) {
        if (name) {
        var exDate = null;
        if (exmins) {
        exDate = new Date();
        exDate.setTime(exDate.getTime() + exmins * 60000);
        }
        var thisCookie = name + '=' + escape(value);
        if (exDate) {
        thisCookie += ';expires=' + exDate.toGMTString();
        }
        if (domain) {
        thisCookie += ';domain=' + domain;
        }
        thisCookie += ';path=/';
        document.cookie = thisCookie;
        }
        }
        },

    
        getText: function () {
            var textNodes = AS.pixel.getTextNodesIn(document.body);
            var textValues = [];
            for (var i = textNodes.length - 1; i >= 0 ; i--) {
                if (textNodes[i]) {
                    textValues.push(textNodes[i].textContent);
                }
            }
            return textValues.join(" ");
        },
        getTextNodesIn: function (elem) {
          var textNodes = [];
          if (elem) {
            for (var nodes = elem.childNodes, i = nodes.length; i--;) {
              var node = nodes[i], nodeType = node.nodeType;
              if (nodeType == 3) {
                  textNodes.push(node);
              }
              else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
                textNodes = textNodes.concat(AS.pixel.getTextNodesIn(node));
              }
            }
          }
          return textNodes;
        }
    };

    AS.pixel.doPixelWork();
