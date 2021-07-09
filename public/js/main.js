var _Application = function () {
    var $app = this;
    init = function () {
        configuration();
        $app.plugins();
        $app.assignScopes();
        $app.maskInputs();
        $app.fixMenu();
        $app.newMenu();
        bindEvents();
    };
    configuration = function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': _JS.X_CSRF_TOKEN
            }
        });
    };
    bindEvents = function () {
        $(document).on('keyup', function (e) {
            if (e.key === "Escape") {
                $app.closeMenu();
            }
            if (e.shiftKey && e.altKey && (String.fromCharCode(e.which) == 'M')) {
                $app.altMenu();
            }
            if (e.shiftKey && e.altKey && (String.fromCharCode(e.which) == 'P')) {
                if ($('.js-procura-rapida').is(':visible')) {
                    $('.js-procura-rapida').select();
                }
            }
        });
    };
    $app.altMenu = function () {
        if ($('#body-menu').is(':visible')) {
            $('#body-menu').hide();
            $('#body-page').show();
        } else {
            $('#body-menu').show();
            $('#body-page').hide();
        }
    };
    $app.closeMenu = function () {
        $('#body-menu').hide();
        $('#body-page').show();
    };
    $app.ajax = function (options) {
        $app.overlay.show();
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
    };
    this.plugins = function () {
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
    };
    this.maskInputs = function () {
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
    };
    this.assignScopes = function () {
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
    };
    this.overlay = {
        show: function () {
            $('#overlay').show();
            $('#overlay a').on('focusout', function () {
                setTimeout(function () {
                    $('#overlay a').focus();
                }, 1);
            }).focus();
        },
        hide: function () {
            $('#overlay').hide();
        }
    };
    this.message = {
        alert: function (message, type, timeout) {
            type = type || 'alert';
            timeout = timeout || 6000;
            var n = new Noty({
                text: message,
                type: type,
                theme: 'bootstrap-v3'
            });
            n.show();
            if (timeout !== 'noClose') {
                setTimeout(function () {
                    n.close();
                }, timeout);
            }
        },
        success: function (message) {
            this.alert($('<div>').append($('<i>').icon('fa-check-circle')).html() + ' ' + message, 'success');
        },
        error: function (message, timeout) {
            timeout = timeout || 6000;
            this.alert($('<div>').append($('<i>').icon('fa-times-circle')).html() + ' ' + message, 'error', timeout);
        },
        warning: function (message) {
            this.alert($('<div>').append($('<i>').icon('fa-exclamation-triangle')).html() + ' ' + message, 'warning');
        },
        info: function (message) {
            this.alert($('<div>').append($('<i>').icon('fa-info-circle')).html() + ' ' + message, 'info');
        },
        confirm: function (message, fnYes, fnNo, type) {
            type = type || 'alert';
            fnYes = fnYes || function () {};
            fnNo = fnNo || function () {};
            var conf = {
                text: $('<div>').append($('<i>').icon('fa-question-circle')).html() + ' ' + message,
                type: type,
                layout: 'center',
                theme: 'bootstrap-v3',
                closeWith: 'button',
                buttons: [
                    Noty.button($('<div>').append($('<i>').icon('fa-check')).html() + ' Sim ', 'btn btn-success', function () {
                        fnYes();
                        n.close();
                        System.overlay.hide();
                    }, {id: 'button1', 'data-status': 'ok'}),

                    Noty.button($('<div>').append($('<i>').icon('fa-times')).html() + ' Não ', 'btn btn-danger', function () {
                        fnNo();
                        n.close();
                        System.overlay.hide();
                    })
                ],
            };
            var n = new Noty(conf);
            System.overlay.show();
            n.show();
        }
    };
    this.newMenu = function () {
        $('#body-menu input').on('keyup',function(e){
            var search = $(this).val();
            if(!search){
                $('#body-menu .mn-item-menu').show();
            }else{
                $('#body-menu .mn-item-menu').hide().filter(function(){
                    var re = new RegExp(search);
                    return re.test($(this).attr('data-search'));
                }).show();
            }
            $.each($('#body-menu .mn-group-menu').show(),function(){
                $(this)[$(this).find('.mn-item-menu:visible').length ? 'show' : 'hide']();
            });
        });
    };
    this.fixMenu = function () {
        $app.ajax({
            url: _JS.URL_ROOT + '../inc/inc.menu-ajax.php',
            dataType: 'html'
        }).done(function (res) {
            var $pageMenu = $('<section>').append(res);
            var $topbar = $pageMenu.find('div').first();
            var $sidebar = $(res).find('.page-sidebar-menu');
            var fnSrc = function () {
                var src = $(this).attr('src');
                var match = false;
                if ((match = src.match(/^\.\.\/(.*)/))) {
                    $(this).attr('src', _JS.URL_ROOT + '../' + match[1]);
                }
            };
            $.each($topbar.find('[src]'), fnSrc);
            $.each($sidebar.find('[src]'), fnSrc);
            $.each($sidebar.find('[href]'), function () {
                var url = $(this).attr('href');
                var match = false;
                if ((match = url.match(/^\.\.\/(.*)/))) {
                    $(this).attr('href', _JS.URL_ROOT + '../' + match[1]);
                } else {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        var $ul = $(this).siblings('ul');
                        if ($ul.is(':visible')) {
                            $ul.show();
                            $(this).find('.fa-chevron-down').addClass('fa-chevron-left').removeClass('fa-chevron-down')
                        } else {
                            $ul.hide();
                            $(this).find('.fa-chevron-left').addClass('fa-chevron-down').removeClass('fa-chevron-left')
                        }
                        $ul[$ul.is(':visible') ? 'hide' : 'show'](300);
                    });
                }
            });
            $.each($sidebar.find('span.arrow'), function () {
                $(this).addClass('fas fa-chevron-left pull-right').removeClass('arrow');
            });
            $('#body-menu .menu-content-top-bar').append($topbar.clone());
            $('div.header').find('.header-inner').after($topbar).remove();
            $('.page-sidebar-menu').after($sidebar).remove();
        });
    };

    init();
};

/**
 * Define o funcionamento de um CRUD do sistema
 * @param {type} $contexto
 */
_Application.Crud = function ($contexto) {
    $contexto = $contexto || $('body');
    var tela = this;
    tela.$ = {
        contexto: function () {
            return $contexto;
        }
    };

    tela.evento = {
        inicializar: function () {
            tela.Pesquisa.evento.inicializar();
            tela.Cadastro.evento.inicializar();
        }
    };

    tela.Pesquisa = {
        $: {
            contexto: function () {
                return tela.$.contexto().find('.pesquisa')
            }
        },
        evento: {
            antes: {
                inicializar: function () {},
                mostrar: function () {},
            },
            depois: {
                inicializar: function () {},
                mostrar: function () {},
            },
            inicializar: function () {
                this.antes.inicializar();
                tela.Pesquisa.Filtro.evento.inicializar();
                tela.Pesquisa.Listagem.evento.inicializar();
                this.depois.inicializar();
            },
            mostrar: function () {
                if (this.antes.mostrar() !== false) {
                    tela.Pesquisa.Listagem.$.corpo()
                            .find(tela.Pesquisa.Listagem.Linha.$.selecionada)
                            .removeClass(tela.Pesquisa.Listagem.Linha.$.selecionada.slice(1));
                    tela.Pesquisa.$.contexto().show();
                    tela.Cadastro.$.contexto().hide();
                    this.depois.mostrar();
                }
            },
        },
        Filtro: {
            $: {
                contexto: function () {
                    return tela.Pesquisa.$.contexto().find('.filtro');
                },
                form: function () {
                    return this.contexto().find('form');
                },
                pesquisar: function () {
                    return this.contexto().find('.js-pesquisar');
                },
                verNovo: function () {
                    return this.contexto().find('.js-ver-novo');
                }
            },
            emUso: {
                pagina: 1,
                modelo: function () {
                    return tela.Cadastro.emUso.modelo();
                },
                dados: {},
                extra:{}
            },
            evento: {
                antes: {
                    inicializar: function () {},
                    validar: function () {},
                    extrairDados: function (dados) {},
                    pesquisar: function () {},
                },
                depois: {
                    inicializar: function () {},
                    validar: function () {},
                    extrairDados: function (dados) {},
                    pesquisar: function () {},
                },
                inicializar: function () {
                    if (this.antes.inicializar() !== false) {
                        tela.Pesquisa.Filtro.$.form().on('submit', function (event) {
                            tela.Pesquisa.Filtro.$.pesquisar().trigger('click');
                            event.preventDefault();
                        });
                        tela.Pesquisa.Filtro.$.pesquisar().on('click', function (event) {
                            tela.Pesquisa.Listagem.emUso.ultimaPagina = false;
                            tela.Pesquisa.Listagem.emUso.autoPaginar = true;
                            tela.Pesquisa.Listagem.$.procuraRapida().val('');
                            tela.Pesquisa.Listagem.$.proximaPagina().removeClass('disabled').show();
                            var filtro = tela.Pesquisa.Filtro.evento.extrairDados();
                            tela.Pesquisa.Filtro.emUso.dados = filtro;
                            tela.Pesquisa.Filtro.emUso.pagina = 1;
                            tela.Pesquisa.Filtro.evento.pesquisar(filtro);
                            tela.Pesquisa.Listagem.$.proximaPagina().show();
                            tela.Pesquisa.Listagem.$.corpo().html('');
                            event.preventDefault();
                        });
                        tela.Pesquisa.Filtro.$.verNovo().on('click', function (event) {
                            tela.Cadastro.emUso.status = 'incluir';
                            tela.Cadastro.evento.limpar();
                            tela.Cadastro.$.excluir().hide();
                            tela.Cadastro.evento.mostrar();
                            tela.Pesquisa.Listagem.Linha.emUso.$linha = tela.Pesquisa.Listagem.Linha.$.template().clone(true);
                            event.preventDefault();
                        });
                        tela.Pesquisa.Filtro.evento.pesquisar();
                        this.depois.inicializar();
                    }
                },
                validar: function ($form, dados) {
                    if (this.antes.validar($form, dados) !== false) {
                        if ($form.formValidate() !== false) {
                            return this.depois.validar($form, dados) !== false;
                        }
                    }
                    return false;
                },
                extrairDados: function () {
                    if (this.antes.extrairDados(tela.Pesquisa.Filtro.$.form()) !== false) {
                        var dados = $.deparam(tela.Pesquisa.Filtro.$.form().serialize());
                        this.depois.extrairDados(tela.Pesquisa.Filtro.$.form(), dados);
                    }
                    return dados;
                },
                pesquisar: function (filtro) {
                    filtro = filtro ? filtro : tela.Pesquisa.Filtro.emUso.dados;
                    if (this.antes.pesquisar(filtro) !== false) {
                        if (tela.Pesquisa.Filtro.evento.validar(tela.Pesquisa.Filtro.$.form(), filtro)) {
                            var url = tela.Pesquisa.Filtro.$.form().attr('action');
                            url = url.indexOf('?') == -1 ? url + '?' : url;
                            tela.Pesquisa.Filtro.$.form().formSend({
                                'action': url + $.param({'pagina': tela.Pesquisa.Filtro.emUso.pagina++}),
                                'data': filtro
                            }, function (res) {
                                tela.Pesquisa.Listagem.emUso.extra = res.extraData;
                                tela.Pesquisa.Listagem.evento.preencher(res.data);
                                tela.Pesquisa.Filtro.evento.depois.pesquisar();
                                tela.Pesquisa.evento.mostrar();
                            });
                        }
                    }
                }
            },
        },
        Listagem: {
            $: {
                contexto: function () {
                    return tela.Pesquisa.$.contexto().find('.listagem');
                },
                procuraRapida: function () {
                    return this.contexto().parent().find('.js-procura-rapida');
                },
                corpo: function () {
                    return this.contexto().find('.js-listagem-corpo');
                },
                proximaPagina: function () {
                    return tela.Pesquisa.$.contexto().find('.js-proxima-pagina');
                }
            },
            emUso: {
                dados: false,
                procuraRapida: false,
                ultimaPagina: false
            },
            evento: {
                antes: {
                    inicializar: function () {},
                    preencher: function () {},
                    procuraRapida: function () {}
                },
                depois: {
                    inicializar: function () {},
                    preencher: function () {},
                    procuraRapida: function () {}
                },
                inicializar: function () {
                    if (this.antes.inicializar() !== false) {
                        tela.Pesquisa.Listagem.Linha.evento.inicializar();
                        if (tela.Pesquisa.Listagem.emUso.dados) {
                            tela.Pesquisa.Listagem.evento.preencher(tela.Pesquisa.Listagem.emUso.dados);
                        }
                        tela.Pesquisa.Listagem.$.proximaPagina().on('click', function (event) {
                            if (tela.Pesquisa.Listagem.emUso.ultimaPagina || tela.Pesquisa.Listagem.emUso.procuraRapida) {
                                return;
                            }
                            tela.Pesquisa.Filtro.evento.pesquisar();
                            event.preventDefault();
                        });
                        tela.Pesquisa.Listagem.$.procuraRapida().on('change', function () {
                            tela.Pesquisa.Listagem.evento.procuraRapida($(this).val());
                        });
                        $(window).scroll(function () {
                            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                                if (tela.Pesquisa.Listagem.$.contexto().is(':visible')) {
                                    var $proxima = tela.Pesquisa.Listagem.$.proximaPagina();
                                    if ($proxima.is(':visible') && !$proxima.hasClass('disabled')) {
                                        $proxima.trigger('click');
                                    }
                                }
                            }
                        });
                        this.depois.inicializar();
                    }
                },
                preencher: function (dados) {
                    if (this.antes.preencher(dados) !== false) {
                        var i;
                        for (i in dados) {
                            var $linha = tela.Pesquisa.Listagem.Linha.$.template().clone(true);
                            tela.Pesquisa.Listagem.Linha.evento.adicionar($linha, dados[i]);
                        }
                        if (!i) {
                            tela.Pesquisa.Listagem.emUso.ultimaPagina = true;
                            tela.Pesquisa.Listagem.$.proximaPagina().addClass('disabled');
                        }
                        this.depois.preencher(dados);
                    }
                },
                procuraRapida: function (valor) {
                    if (this.antes.procuraRapida(valor) !== false) {
                        $('.matched').removeClass('matched');
                        $linhas = tela.Pesquisa.Listagem.$.corpo().find(tela.Pesquisa.Listagem.Linha.$.seletor);
                        tela.Pesquisa.Listagem.emUso.procuraRapida = valor;
                        tela.Pesquisa.Listagem.$.proximaPagina()[valor ? 'hide' : 'show']();
                        if (valor) {
                            $linhas.hide();
                            var procura = new RegExp(valor, 'i');
                            $linhas.filter(function () {
                                var res = false;
                                $.each($(this).children(), function () {
                                    if ($(this).text().match(procura)) {
                                        res = true;
                                        $(this).addClass('matched');
                                        return false;
                                    }
                                });
                                return res;
                            }).show();
                        } else {
                            $linhas.show();
                        }
                        this.depois.procuraRapida(valor);
                    }
                }
            },
            Linha: {
                $: {
                    seletor: '.js-tpl-linha',
                    selecionada: '.js-linha-selecionada',
                    contexto: function () {
                        return tela.Pesquisa.Listagem.Linha.emUso.$linha;
                    },
                    contextoTemplate: function () {
                        return tela.$.contexto().find('.templates');
                    },
                    template: function () {
                        return tela.Pesquisa.Listagem.Linha.$.contextoTemplate().find(tela.Pesquisa.Listagem.Linha.$.seletor).first();
                    },
                    verEdicao: function () {
                        return this.contextoTemplate().find('.js-ver-edicao');
                    },
                    excluir: function () {
                        return this.contextoTemplate().find('.js-excluir');
                    }
                },
                emUso: {
                    dados: {},
                    $linha: $(),
                },
                evento: {
                    antes: {
                        inicializar: function () {},
                        adicionar: function ($tpl, dados) {},
                        selecionar: function ($linha) {},
                        desselecionar: function ($linha) {},
                        extrairDados: function ($linha, dados) {},
                        excluir: function ($linha, dados) {}
                    },
                    depois: {
                        inicializar: function () {},
                        adicionar: function ($tpl, dados) {},
                        selecionar: function ($linha) {},
                        desselecionar: function ($linha) {},
                        extrairDados: function ($linha, dados) {},
                        excluir: function ($linha, dados) {}
                    },
                    inicializar: function () {
                        if (this.antes.inicializar() !== false) {
                            tela.Pesquisa.Listagem.Linha.$.verEdicao().on('click', function (event) {
                                var $linha = $(this).parents(tela.Pesquisa.Listagem.Linha.$.seletor).first();
                                tela.Pesquisa.Listagem.Linha.emUso.$linha = $linha;
                                tela.Pesquisa.Listagem.Linha.evento.selecionar($linha);
                                var modelo = tela.Cadastro.emUso.modelo();
                                tela.Cadastro.emUso.dados = tela.Pesquisa.Listagem.Linha.evento.extrairDados($linha, modelo);
                                tela.Cadastro.emUso.status = 'alterar';
                                tela.Cadastro.evento.preencher(tela.Cadastro.emUso.dados);
                                tela.Cadastro.$.excluir().show();
                                tela.Cadastro.evento.mostrar();
                                event.preventDefault();
                            });
                            tela.Pesquisa.Listagem.Linha.$.excluir().on('click', function (event) {
                                var $linha = $(this).parents(tela.Pesquisa.Listagem.Linha.$.seletor).first();
                                tela.Pesquisa.Listagem.Linha.emUso.$linha = $linha;
                                tela.Pesquisa.Listagem.Linha.evento.selecionar($linha);
                                var modelo = tela.Cadastro.emUso.modelo();
                                tela.Cadastro.emUso.dados = tela.Pesquisa.Listagem.Linha.evento.extrairDados($linha, modelo);
                                tela.Pesquisa.Listagem.Linha.evento.excluir($linha, tela.Cadastro.emUso.dados);
                                event.preventDefault();
                            });
                            this.depois.inicializar();
                        }
                    },
                    adicionar: function ($tpl, dados) {
                        if (this.antes.adicionar($tpl, dados) !== false) {
                            tela.Pesquisa.Listagem.$.corpo().append($tpl.view('assign', dados));
                            this.depois.adicionar($tpl, dados);
                        }
                    },
                    selecionar: function ($linha) {
                        if (this.antes.selecionar($linha) !== false) {
                            tela.Pesquisa.Listagem.Linha.$.contexto().addClass(tela.Pesquisa.Listagem.Linha.$.selecionada.slice(1));
                            this.depois.selecionar($linha);
                        }
                    },
                    desselecionar: function ($linha) {
                        if (this.antes.desselecionar($linha) !== false) {
                            tela.Pesquisa.Listagem.Linha.$.contexto().removeClass(tela.Pesquisa.Listagem.Linha.$.selecionada.slice(1));
                            this.depois.desselecionar($linha);
                        }
                    },
                    extrairDados: function ($linha, dados) {
                        if (this.antes.extrairDados($linha, dados) !== false) {
                            dados = $linha.view('extract', dados);
                            this.depois.extrairDados($linha, dados);
                        }
                        return dados;
                    },
                    excluir($linha, dados) {
                        $linha.addClass('danger');
                        if (this.antes.excluir($linha, dados) !== false) {
                            tela.Cadastro.evento.excluir(tela.Pesquisa.Listagem.Linha.$.excluir(), dados);
                            this.depois.excluir($linha, dados);
                        }
                    }
                },
            },
        },
    };

    tela.Cadastro = {
        $: {
            contexto: function () {
                return tela.$.contexto().find('.cadastro');
            },
            form: function () {
                return this.contexto().find('form');
            },
            cancelar: function () {
                return this.contexto().find('.js-cancelar');
            },
            gravar: function () {
                return this.contexto().find('.js-gravar');
            },
            excluir: function () {
                return this.contexto().find('.js-excluir')
            },
            limpar: function () {
                return this.contexto().find('.js-limpar');
            }
        },
        emUso: {
            status: 'incluir',
            modelo: function () {
                return {};
            },
            dados: {},
        },
        evento: {
            antes: {
                mostrar: function () {},
                inicializar: function () {},
                preencher: function (dados) {},
                extrairDados: function () {},
                validar: function ($form, dados) {},
                gravar: function () {},
                incluir: function (resultado) {},
                alterar: function (resultado) {},
                excluir: function (dados) {},
                cancelar: function () {},
                limpar: function () {},
                finalizarTela: {
                    incluir: function (resultado) {},
                    alterar: function (resultado) {},
                    excluir: function (resultado) {}
                }
            },
            depois: {
                mostrar: function () {},
                inicializar: function () {},
                preencher: function (dados) {},
                extrairDados: function (dados) {},
                validar: function ($form, dados) {},
                gravar: function (result) {},
                incluir: function (result) {},
                alterar: function (result) {},
                excluir: function (dados) {},
                cancelar: function () {},
                limpar: function () {},
                finalizarTela: {
                    incluir: function (resultado) {
                        System.message.success('Registro incluído com sucesso');
                    },
                    alterar: function (resultado) {
                        System.message.success('Registro alterado com sucesso');
                    },
                    excluir: function (resultado) {
                        System.message.success('Registro excluído com sucesso');
                    }
                }
            },
            inicializar: function () {
                if (this.antes.inicializar() !== false) {
                    tela.Cadastro.$.cancelar().on('click', function () {
                        tela.Cadastro.evento.cancelar();
                    });
                    tela.Cadastro.$.gravar().on('click', function () {
                        tela.Cadastro.evento.gravar();
                    });
                    tela.Cadastro.$.excluir().on('click', function (event) {
                        tela.Cadastro.evento.excluir($(this), tela.Cadastro.emUso.dados);
                        event.preventDefault();
                    });
                    tela.Cadastro.$.limpar().on('click', function (event) {
                        tela.Cadastro.evento.limpar();
                        event.preventDefault();
                    })
                    this.depois.inicializar();
                }
            },
            mostrar: function () {
                if (this.antes.mostrar() !== false) {
                    tela.Pesquisa.$.contexto().hide();
                    tela.Cadastro.$.contexto().show();
                    this.depois.mostrar();

                }
            },
            preencher: function (dados) {
                if (this.antes.preencher(dados) !== false) {
                    tela.Cadastro.$.contexto().view('assign', dados);
                    this.depois.preencher(dados);
                }
            },
            extrairDados: function () {
                if (this.antes.extrairDados() !== false) {
                    var dados = $.deparam(tela.Cadastro.$.form().serialize());
                    this.depois.extrairDados(dados);
                }
                return dados;
            },
            validar: function ($form, dados) {
                if (this.antes.validar($form, dados) !== false) {
                    if ($form.formValidate() !== false) {
                        return this.depois.validar($form, dados) !== false;
                    }
                }
                return false;
            },
            gravar: function () {
                var operacao = tela.Cadastro.emUso.status;
                var dados = tela.Cadastro.evento.extrairDados();
                if (this.antes[operacao](dados) !== false) {
                    if (this.antes.gravar(dados) !== false) {
                        System.message.confirm('Confirma a gravação deste registro?', function () {
                            if (tela.Cadastro.evento.validar(tela.Cadastro.$.form(), dados)) {
                                tela.Cadastro.$.form().formSend({'data': dados}, function (res) {
                                    if (res.error) {
                                        System.message.error(res.message);
                                    } else {
                                        tela.Cadastro.evento.depois.gravar(res.data);
                                        tela.Cadastro.evento.finalizarTela[operacao](res.data);
                                        tela.Cadastro.evento.depois[operacao](res.data);
                                    }
                                });
                            }
                        }, function () {
                        });
                    }
                }
            },
            excluir: function ($link, dados) {
                if (tela.Cadastro.evento.antes.excluir(dados) !== false) {
                    System.message.confirm('Deseja excluir este registro?', function () {
                        $link.linkSend({'data': dados}, function (res) {
                            tela.Pesquisa.Listagem.Linha.$.contexto().remove();
                            tela.Cadastro.evento.depois.excluir(dados);
                            tela.Cadastro.evento.finalizarTela.excluir(dados);
                        }, function (res) {
                            tela.Pesquisa.Listagem.Linha.$.contexto().removeClass('danger');
                        });
                    }, function () {
                        tela.Pesquisa.Listagem.Linha.$.contexto().removeClass('danger');
                    });
                }
            },
            cancelar: function () {
                if (this.antes.cancelar() !== false) {
                    tela.Pesquisa.evento.mostrar();
                    tela.Cadastro.evento.depois.cancelar();
                }
            },
            limpar: function () {
                if (this.antes.limpar() !== false) {
                    var modelo = tela.Cadastro.emUso.modelo();
                    tela.Cadastro.$.contexto().view('assign', modelo);
                    tela.Cadastro.emUso.dados = modelo;
                    tela.Cadastro.$.contexto().find('.has-error').removeClass('has-error');
                    this.depois.limpar();
                }
            },
            finalizarTela: {
                'incluir': function (result) {
                    if (tela.Cadastro.evento.antes.finalizarTela.incluir(result) !== false) {
                        tela.Pesquisa.Listagem.$.corpo().prepend(
                                tela.Pesquisa.Listagem.Linha.$.contexto().view('assign', result));
                        tela.Cadastro.evento.limpar();
                        tela.Cadastro.evento.depois.finalizarTela.incluir(result);
                    }
                },
                'alterar': function (result) {
                    if (tela.Cadastro.evento.antes.finalizarTela.alterar(result) !== false) {
                        tela.Pesquisa.Listagem.Linha.$.contexto().view('assign', result);
                        tela.Pesquisa.evento.mostrar();
                        tela.Cadastro.evento.depois.finalizarTela.alterar(result);
                    }
                },
                'excluir': function (result) {
                    if (tela.Cadastro.evento.antes.finalizarTela.excluir(result) !== false) {
                        tela.Pesquisa.evento.mostrar();
                        tela.Cadastro.evento.depois.finalizarTela.excluir(result);
                    }
                }
            }
        },
    };
};

var System;
$(document).ready(function () {
    System = new _Application();
});
