/*
 * jQuery Internationalization library | 2014-06-23
 * Copyright (c) 2014 sladex | MIT License
 * https://github.com/sladex/jquery.i18n
 */

(function($) {

    var dic = {},
        $locEls = $.find('[data-i18n]'),
        $locClassNames = $.find('[data-i18n-class]'),
        $html = $('html'),
        defaultLang = $html.attr('lang') || '_original',
        lastLang;

    dic[defaultLang] = {};

    // store default data
    $.each($locEls, function(index, el) {
        var $el = $(el),
            key = $el.data('i18n'),
            isImg = $el.is('img'),
            originalText = $el.html() || isImg && $el.attr('alt');
        if (originalText !== '') {
            dic[defaultLang][key] = originalText;
        }
        if (isImg) {
            dic[defaultLang][key + '__src'] = el.src;
        }
    });

    function load(path, lang) {
        var dfd = $.Deferred();
        $.getJSON(path).done(function(data) {
            extend(lang, data);
            dfd.resolve();
        });
        return dfd.promise();
    }

    function extend(lang, obj) {
        if (!dic[lang]) {
            dic[lang] = {};
        }
        $.extend(dic[lang], obj);
    }

    function toggle(lang) {
        if (!dic[lang]) {
            return;
        }
        $.each($locEls, function(index, el) {
            var $el = $(el),
                key = $el.data('i18n'),
                str = dic[lang][key];
            if ($el.is('img')) {
                if (!dic[lang][key + '__src']) {
                    dic[lang][key + '__src'] = 'i18n/' + lang + '/' + $el.attr('src');
                }
                el.src = dic[lang][key + '__src'];
                if (str) {
                    el.alt = str;
                }
            }
            else if (str) {
                $el.html(str);
            }
        });
        $.each($locClassNames, function(index, el) {
            var $el = $(el),
                className = $el.data('i18n-class');
            if (className) {
                $el.removeClass(className + '-i18n-' + lastLang);
                if (lang !== defaultLang) {
                    $el.addClass(className + '-i18n-' + lang);
                }
            }
        });
        lastLang = lang;
        $html.attr('lang', lastLang);
    }

    function reset() {
        this.toggle(defaultLang);
    }

    function t(lang) {
        this.each(function(i, el) {
            var $el = $(el),
                str = dic[lang][$el.data('i18n')];
            $el.html(str);
        });
    }

    $.i18n = {
        load: load,
        extend: extend,
        toggle: toggle,
        reset: reset
    };
    $.fn._t = t;

})(jQuery);
