$ = jQuery;

$(function () {
    $.fn.valu = function () {
        var $this = $(this),
            _val = $this.eq(0).val();
        if (_val === $this.attr('placeholder'))
            return '';
        else
            return _val;
    };

    String.Format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }

        return s;
    };

    String.prototype.endsWith = function (suffix) {
        return this.substr(this.length - suffix.length) === suffix;
    };

    String.prototype.startsWith = function (prefix) {
        return this.substr(0, prefix.length) === prefix;
    };
});


var Bakery = (function () {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return {
        PreButton: function (ctrl, text) {
            if (ctrl !== undefined) {
                ctrl.innerHTML = text + " <i class='fa fa-spinner fa-fw fa-spin white'></i>";
                //$(ctrl).prop('disabled', true);
                $(ctrl).addClass('disabled');
            }
        },

        PostButton: function (ctrl, text) {
            if (ctrl !== undefined) {
                ctrl.innerHTML = text;
                //$(ctrl).prop('disabled', false);
                $(ctrl).removeClass('disabled');
            }
        },

        GetQueryStrings: function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        ConvertToDateFromJSON: function (_date) {
            if (_date === null)
                return '';
            else
                return new Date(parseInt(_date.replace(/\/Date\((.*?)\)\//gi, "$1")));
        },

        ConvertToJSONFromDate: function (date) {
            if (date === null || date === '')
                return '';
            else {
                var _date = new Date(date);
                var str = Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), 0);
                var JSONDate = "\/Date(" + str + ")\/";
                return JSONDate;
            }
        },

        FormatToShortDate: function (_date) {
            return $.format.date(_date, "dd-MMM-yyyy");
        },

        FormatToNormalDate: function (_date) {
            return $.format.date(_date, "MMM dd, yyyy");
        },

        FormatToLongDate: function (_date) {
            return $.format.date(_date, "ddd, MMMM dd, yyyy");
        },

        FormatToShortTime: function (_date) {
            return $.format.date(_date, "h:mm a");
        },

        FormatToLongTime: function (_date) {
            return $.format.date(_date, "HH:mm:ss");
        },

        CustomDateFormat: function (_date, format) {
            return $.format.date(_date, format);
        },

        FormatNumber: function (_number, decimals) {
            return $.number(_number, decimals);
        },

        Notify: function (config) {
            /*
             Type: alert, success, error, warning, info
             Layout: top, topLeft, topCenter, topRight, center, centerLeft, centerRight, bottom, bottomLeft, bottomCenter, bottomRight


             Layouts:
             notification , alert , success , warning , error , info/informations

            Types:
            top , topLeft , topCenter , topRight , center , centerLeft , centerRight ,
            bottom , bottomLeft , bottomCenter , bottomRight
             */

            var _type = config.type; //success, info, warning, error, notification
            var _title = config.title ? config.title : '';
            var _position = /*config.position ? config.position :*/ 'bottomRight';
            var _msg = config.msg;


            var options = {
                type: _type,
                layout: _position,
                text: _msg,
                progressBar: false,
                timeout: 5000,
                theme: "metroui",
                //animation: {
                //    open: "animated bounceInRight",
                //    close: "animated bounceOutRight"
                //}
                animation: {
                    open: function (promise) {
                        var n = this;
                        var Timeline = new mojs.Timeline();
                        var body = new mojs.Html({
                            el: n.barDom,
                            x: { 500: 0, delay: 0, duration: 500, easing: 'elastic.out' },
                            isForce3d: true,
                            onComplete: function () {
                                promise(function (resolve) {
                                    resolve();
                                })
                            }
                        });

                        var parent = new mojs.Shape({
                            parent: n.barDom,
                            width: 200,
                            height: n.barDom.getBoundingClientRect().height,
                            radius: 0,
                            x: { [150]: -150 },
                            duration: 1.2 * 500,
                            isShowStart: true
                        });

                        n.barDom.style['overflow'] = 'visible';
                        parent.el.style['overflow'] = 'hidden';

                        var burst = new mojs.Burst({
                            parent: parent.el,
                            count: 10,
                            top: n.barDom.getBoundingClientRect().height + 75,
                            degree: 90,
                            radius: 75,
                            angle: { [-90]: 40 },
                            children: {
                                fill: '#EBD761',
                                delay: 'stagger(500, -50)',
                                radius: 'rand(8, 25)',
                                direction: -1,
                                isSwirl: true
                            }
                        });

                        var fadeBurst = new mojs.Burst({
                            parent: parent.el,
                            count: 2,
                            degree: 0,
                            angle: 75,
                            radius: { 0: 100 },
                            top: '90%',
                            children: {
                                fill: '#EBD761',
                                pathScale: [.65, 1],
                                radius: 'rand(12, 15)',
                                direction: [-1, 1],
                                delay: .8 * 500,
                                isSwirl: true
                            }
                        });

                        Timeline.add(body, burst, fadeBurst, parent);
                        Timeline.play();
                    },
                    close: function (promise) {
                        var n = this;
                        new mojs.Html({
                            el: n.barDom,
                            x: { 0: 500, delay: 10, duration: 500, easing: 'cubic.out' },
                            skewY: { 0: 10, delay: 10, duration: 500, easing: 'cubic.out' },
                            isForce3d: true,
                            onComplete: function () {
                                promise(function (resolve) {
                                    resolve();
                                })
                            }
                        }).play();
                    }
                }
            };

            new Noty(options).show();
        },

        DataTable: function (ctrl, pglength, noOrderTargets, sortColumns) {
            /*$('#export-table')*/

            /*
            noOrderTargets - array of columns where sorting is disabled eg. [0, 1, 5]
            sortColumns - array of columns to be sorted, and in what order eg. [1, asc]
           */


            $(ctrl).DataTable({
                dom: "<'row'<'col-sm-4 col-md-4'l><'col-sm-4 col-md-4'B><'col-sm-4 col-md-4'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-5 col-md-5'i><'col-sm-7 col-md-7'p>>",
                buttons: {
                    buttons: [
                        { extend: 'copy', text: '<i class="fa fa-copy"></i>', titleAttr: 'Copy', title: $('h1').text(), exportOptions: { columns: ':not(.no-print)' }, footer: true },
                        { extend: 'excel', text: '<i class="fa fa-file-excel-o"></i>', titleAttr: 'Excel', title: $('h1').text(), exportOptions: { columns: ':not(.no-print)' }, footer: true },
                        { extend: 'csv', text: 'CSV', title: $('h1').text(), titleAttr: 'CSV', exportOptions: { columns: ':not(.no-print)' }, footer: true },
                        { extend: 'pdf', text: '<i class="fa fa-file-pdf-o"></i>', titleAttr: 'PDF', title: $('h1').text(), exportOptions: { columns: ':not(.no-print)' }, footer: true },
                        { extend: 'print', text: '<i class="fa fa-print"></i>', titleAttr: 'Print', title: $('h1').text(), exportOptions: { columns: ':not(.no-print)' }, footer: true, autoPrint: true }
                    ],
                    dom: {
                        container: {
                            className: 'dt-buttons'
                        },
                        button: {
                            className: 'btn btn-primary'
                        }
                    }
                },
                pageLength: pglength ? pglength : 10,
                columnDefs: [{ orderable: false, targets: noOrderTargets === undefined ? [] : noOrderTargets }],
                order: sortColumns === undefined ? [] : sortColumns
            });

            $(ctrl).each(function () {
                var datatable = $(this);
                // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                search_input.attr('placeholder', 'Search Table');
                search_input.removeClass('form-control-sm');
                // LENGTH - Inline-Form control
                var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                length_sel.removeClass('form-control-sm');
            });
        },

        GenerateGUID: function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    };
})();