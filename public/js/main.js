JSON.extend = function (a, b) {
    for (var key in b)
        if (b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
};

class HtmlInputMasks {
    constructor() {
        var SPMaskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        };
        var spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
            }
        };

        $(':input.data').mask('00/00/0000').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        }).inputGroup({'before': $('<i>').icon('fa-calendar-alt')});
        $(':input.hora').mask('00:00:00').inputGroup({'before': $('<i>').icon('fa-clock')});
        $(':input.datahora').mask('00/00/0000 00:00:00').inputGroup({'before': $('<i>').icon('fa-calendar-alt')});
        $(':input.cep').mask('00.000-000').inputGroup({'before': $('<i>').icon('fa-envelope')});
        $(':input.cnpj').mask('000.000.000/0000-00').inputGroup({'before': $('<i>').icon('fa-building')});
        $(':input.cpf').mask('000.000.000-00').inputGroup({'before': $('<i>').icon('fa-user-tie')});
        $(':input.telefone').mask(SPMaskBehavior, spOptions).inputGroup({'before': $('<i>').icon('fa-phone')});
        $(':input.celular').mask('(00) 00000-0000').inputGroup({'before': $('<i>').icon('fa-mobile-alt')});
        $(':input.moeda').mask('000.000.000.000,00', {'reverse': true}).css('text-align', 'right').inputGroup({'before': $('<i>').icon('fa-money-bill-alt')});
        $(':input.email').inputGroup({'before': '@'});
    }
}

class HtmlOverLay {
    constructor() {

    }
    static block() {
        $('#overlay a').on('focusout', function () {
            setTimeout(function () {
                $('#overlay a').focus();
            }, 1);
        }).focus();
    }
    static open() {
        $('#overlay').show();
        return HtmlOverLay;
    }
    static close() {
        $('#overlay a').off('focusout');
        $('#overlay').hide();
    }
}

class HtmlMenu {
    constructor() {
        var _this = this;
        $(document).on('keyup', function (e) {
            if (e.key === "Escape") {
                _this.close();
            }
            if (e.shiftKey && e.altKey && (String.fromCharCode(e.which) == 'M')) {
                _this.toggle();
            }
            if (e.shiftKey && e.altKey && (String.fromCharCode(e.which) == 'P')) {
                if ($('.js-quick-search').is(':visible')) {
                    $('.js-quick-search').select();
                }
            }
        });
        $('.js-main-menu').on('click', function () {
            _this.toggle();
        });
        $('menu .js-quick-search').on('keyup', function (e) {
            var search = $(this).val();
            if (!search) {
                $('menu .mn-item-menu').show();
            } else {
                $('menu .mn-item-menu').hide().filter(function () {
                    var re = new RegExp(search);
                    return re.test($(this).attr('data-search'));
                }).show();
            }
            $.each($('menu .mn-group-menu').show(), function () {
                $(this)[$(this).find('.mn-item-menu:visible').length ? 'show' : 'hide']();
            });
        });
    }
    toggle() {
        if ($('main').is(':visible')) {
            $('main').hide();
            $('menu').show()
        } else {
            $('menu').hide();
            $('main').show()
        }
    }
    close() {
        $('menu').hide();
        $('main').show()
    }
}

class HtmlMsg {
    static theme = 'bootstrap-v4';
    static layout = 'bottomRight';
    static defaultConfig(options) {
        return JSON.extend({
            theme: HtmlMsg.theme,
            layout: HtmlMsg.layout,
            setTimeout: false
        }, options);
    }
    static message(text, options) {
        options = HtmlMsg.defaultConfig(options);
        options.text = text;
        var n = new Noty(options).show().setTimeout(options.setTimeout);
        return n;
    }
    static info(text) {
        HtmlMsg.message(text, {type: 'info', 'setTimeout': 5000});
    }
    static success(text) {
        HtmlMsg.message(text, {type: 'success', 'setTimeout': 5000});
    }
    static error(text) {
        HtmlMsg.message(text, {type: 'error', 'setTimeout': 7000});
    }
    static warning(text) {
        HtmlMsg.message(text, {type: 'warning', 'setTimeout': 5000});
    }
    static ok(text, fnOk) {
        fnOk = fnOk || function () {};
        var n = new Noty({
            theme: HtmlMsg.theme,
            layout: HtmlMsg.layout,
            type: 'info',
            text: text,
            buttons: [
                Noty.button('Ok', 'btn btn-info', function () {
                    fnOk();
                    n.close();
                    HtmlOverLay.close();
                })
            ]
        }).show();
    }
    static confirm(text, fnYes, fnNo) {
        fnYes = fnYes || function () {};
        fnNo = fnNo || function () {}
        HtmlOverLay.open();
        var n = new Noty({
            theme: HtmlMsg.theme,
            layout: 'center',
            text: text,
            buttons: [
                Noty.button('YES', 'btn btn-success', function () {
                    fnYes();
                    n.close();
                    HtmlOverLay.close();
                }, {id: 'button1', 'data-status': 'ok'}),

                Noty.button('NO', 'btn btn-danger', function () {
                    fnNo();
                    n.close();
                    HtmlOverLay.close();
                })
            ]
        }).show();
    }
}

class JQueryPlugins {
    constructor() {
        $.fn.csrf = function () {
            $input = $('<input>', {'type': 'hidden', 'name': 'X-CSRF-TOKEN', 'value': _JS.X_CSRF_TOKEN});
            $(this).append($input);
        };
        $.fn.inputGroup = function (options) {
            options = $.extend({
                'before': false,
                'after': false,
            }, options);
            $.each($(this), function () {
                if (!$(this).parents('.input-group')[0]) {
                    $(this).wrap($('<div>', {'class': 'input-group'}));
                }
                if (options.before) {
                    var inner = options.before instanceof jQuery ? options.before.clone(true) : options.before;
                    $(this).before($('<span>', {'class': 'input-group-addon'}).append(inner));
                }
                if (options.after) {
                    var inner = options.after instanceof jQuery ? options.after.clone(true) : options.after;
                    $(this).after($('<span>', {'class': 'input-group-addon'}).append(inner));
                }
            });
        };
        $.fn.icon = function (iconClass) {
            $(this).addClass('fa ' + iconClass);
            return $(this);
        };

        /**
         * Plugin inverso ao param do jquery
         * @param {string} h
         * @returns {Object}
         */
        (function (h) {
            h.deparam = function (i, j) {
                var d = {}, k = {"true": !0, "false": !1, "null": null};
                h.each(i.replace(/\+/g, " ").split("&"), function (i, l) {
                    var m;
                    var a = l.split("="), c = decodeURIComponent(a[0]), g = d, f = 0, b = c.split("]["), e = b.length - 1;
                    /\[/.test(b[0]) && /\]$/.test(b[e]) ? (b[e] = b[e].replace(/\]$/, ""), b = b.shift().split("[").concat(b), e = b.length - 1) : e = 0;
                    if (2 === a.length)
                        if (a = decodeURIComponent(a[1]), j && (a = a && !isNaN(a) ? +a : "undefined" === a ? void 0 : void 0 !== k[a] ? k[a] : a), e)
                            for (; f <= e; f++)
                                c = "" === b[f] ? g.length : b[f], m = g[c] = f < e ? g[c] || (b[f + 1] && isNaN(b[f + 1]) ? {} : []) : a, g = m;
                        else
                            h.isArray(d[c]) ? d[c].push(a) : d[c] = void 0 !== d[c] ? [d[c], a] : a;
                    else
                        c && (d[c] = j ? void 0 : "")
                });
                return d
            }
        })(jQuery);

        $.fn.formValidate = function (options) {
            var formValid = true;
            $.each($(this), function () {
                if ($(this).is('form')) {
                    $.each($(this).find('.obrigatorio'), function () {
                        if ($(this).is(':input')) {
                            if (!$(this).val()) {
                                var campo = $(this).attr('title') ? $(this).attr('title') : $(this).attr('name');
                                System.message.error('O campo [' + campo + '] é obrigatório');
                                $(this).parents('.form-group').first().addClass('has-error');
                                formValid = false;
                            }
                        }
                    });
                }
            });
            return formValid;
        };
        $.fn.formSend = function (options, callback, callbackError) {
            $.each($(this), function () {
                if ($(this).is('form')) {
                    var conf = {
                        'url': options.action ? options.action : $(this).attr('action'),
                        'data': options.data ? options.data : $(this).serialize(),
                        'dataType': 'json',
                        'type': options.method ? options.method : $(this).attr('method'),
                        'error': callbackError,
                        'success': callback
                    };
                    $app.ajax(conf);
                }
            });
        };
        $.fn.linkSend = function (options, callback, callbackError) {
            $.each($(this), function () {
                if ($(this).is('a')) {
                    var conf = {
                        'url': options.action ? options.action : $(this).attr('href'),
                        'data': options.data ? options.data : {},
                        'dataType': 'json',
                        'type': options.method ? options.method : 'get',
                        'error': callbackError,
                        'success': callback
                    };
                    $app.ajax(conf);
                }
            });
        };

    }
}

class Application {
    constructor() {
        this.Msg = HtmlMsg;
        this.Overlay = HtmlOverLay;
        this.Menu = new HtmlMenu();
        this.configuration();
        new JQueryPlugins();
        new HtmlInputMasks();
        this.assignScopes();
    }
    configuration() {
        if (_JS && _JS.X_CSRF_TOKEN) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': _JS.X_CSRF_TOKEN
                }
            });
        }
    }
    assignScopes() {
        $.each($('section[data-scope]'), function () {
            $.each($('[data-source]', $(this)), function () {
                try {
                    var $linha = $();
                    if ($(this).is('select')) {
                        $linha = $('<option>', {'data-attr-val': 'value', 'data-html-desc': true});
                    }
                    var callback = false;
                    if ($(this).attr('data-callback')) {
                        callback = eval($(this).attr('data-callback'));
                    }
                    $(this).view('iterate', {
                        'template': $(this).attr('data-template') ? $($(this).attr('data-template')).first() : $linha,
                        'collection': eval($(this).attr('data-source')),
                        'callbackItem': callback,
                        'cleanBeforeInit': $(this).attr('data-clean') ? true : false
                    });
                } catch (e) {
                    console.log(e);
                }
            });
            try {
                $(this).view('assign', eval($(this).attr('data-scope')));
            } catch (e) {
                console.log(e);
            }
        });
    }
    request(options) {
        options.dataType = options.dataType || 'json';
        var callbackError = options.error || function () {};
        var callback = options.success || function () {};
        return $.ajax($.extend(options, {
            'error': function (res) {
                $app.message.error(res.responseText, 'noClose');
                callbackError(res);
                $app.overlay.hide();
            },
            'success': function (res) {
                if (res.error) {
                    $app.message.error(res.message);
                    if (res.type == 'Productive\\Exception\\CsrfException') {
                        setTimeout(function () {
                            window.location = _JS.URL_ROOT + '../';
                        }, 1000);
                    } else {
                        callbackError(res);
                    }
                } else {
                    callback(res);
                }
                $app.overlay.hide();
            }
        }));
    }
}

var System;
$(document).ready(function () {
    System = new Application();
    
});
