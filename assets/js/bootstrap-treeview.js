! function (a, b, c, d) {
    "use strict";
    var e = "treeview",
        f = function (b, c) {
            this.$element = a(b), this._element = b, this._elementId = this._element.id, this._styleId = this._elementId + "-style", this.tree = [], this.nodes = [], this.selectedNode = {}, this._init(c)
        };
    f.defaults = {
        injectStyle: !0,
        levels: 2,
        expandIcon: "fa fa-plus",
        collapseIcon: "fa fa-minus",
        nodeIcon: "fa fa-folder",
        color: d,
        backColor: d,
        borderColor: d,
        onhoverColor: "#76c2bd",
        selectedColor: "#22615d",
        selectedBackColor: "",
        enableLinks: !1,
        highlightSelected: !0,
        showBorder: !1,
        showTags: !1,
        onNodeSelected: d
    }, f.prototype = {
        remove: function () {
            this._destroy(), a.removeData(this, "plugin_" + e), a("#" + this._styleId).remove()
        },
        _destroy: function () {
            this.initialized && (this.$wrapper.remove(), this.$wrapper = null, this._unsubscribeEvents()), this.initialized = !1
        },
        _init: function (b) {
            b.data && ("string" == typeof b.data && (b.data = a.parseJSON(b.data)), this.tree = a.extend(!0, [], b.data), delete b.data), this.options = a.extend({}, f.defaults, b), this._setInitialLevels(this.tree, 0), this._destroy(), this._subscribeEvents(), this._render()
        },
        _unsubscribeEvents: function () {
            this.$element.off("click")
        },
        _subscribeEvents: function () {
            this._unsubscribeEvents(), this.$element.on("click", a.proxy(this._clickHandler, this)), "function" == typeof this.options.onNodeSelected && this.$element.on("nodeSelected", this.options.onNodeSelected)
        },
        _clickHandler: function (b) {
            this.options.enableLinks || b.preventDefault();
            var c = a(b.target),
                d = c.attr("class") ? c.attr("class").split(" ") : [],
                e = this._findNode(c); - 1 != d.indexOf("click-expand") || -1 != d.indexOf("click-collapse") ? (this._toggleNodes(e), this._render()) : e && this._setSelectedNode(e)
        },
        _findNode: function (a) {
            var b = a.closest("li.list-group-item").attr("data-nodeid"),
                c = this.nodes[b];
            return c || console.log("Error: node does not exist"), c
        },
        _triggerNodeSelectedEvent: function (b) {
            this.$element.trigger("nodeSelected", [a.extend(!0, {}, b)])
        },
        _setSelectedNode: function (a) {
            a && (a === this.selectedNode ? this.selectedNode = {} : this._triggerNodeSelectedEvent(this.selectedNode = a), this._render())
        },
        _setInitialLevels: function (b, c) {
            if (b) {
                c += 1;
                var e = this;
                a.each(b, function (a, b) {
                    c >= e.options.levels && e._toggleNodes(b);
                    var f = b.nodes ? b.nodes : b._nodes ? b._nodes : d;
                    return f ? e._setInitialLevels(f, c) : void 0
                })
            }
        },
        _toggleNodes: function (a) {
            (a.nodes || a._nodes) && (a.nodes ? (a._nodes = a.nodes, delete a.nodes) : (a.nodes = a._nodes, delete a._nodes))
        },
        _render: function () {
            var b = this;
            b.initialized || (b.$element.addClass(e), b.$wrapper = a(b._template.list), b._injectStyle(), b.initialized = !0), b.$element.empty().append(b.$wrapper.empty()), b.nodes = [], b._buildTree(b.tree, 0)
        },
        _buildTree: function (b, c) {
            if (b) {
                c += 1;
                var d = this;
                a.each(b, function (b, e) {
                    e.nodeId = d.nodes.length, d.nodes.push(e);
                    for (var f = a(d._template.item).addClass("node-" + d._elementId).addClass(e === d.selectedNode ? "node-selected" : "").attr("data-nodeid", e.nodeId).attr("style", d._buildStyleOverride(e)), g = 0; c - 1 > g; g++) f.append(d._template.indent);
                    return e._nodes ? f.append(a(d._template.iconWrapper).append(a(d._template.icon).addClass("click-expand").addClass(d.options.expandIcon))) : e.nodes ? f.append(a(d._template.iconWrapper).append(a(d._template.icon).addClass("click-collapse").addClass(d.options.collapseIcon))) : f.append(a(d._template.iconWrapper).append(a(d._template.icon).addClass("fa"))), f.append(a(d._template.iconWrapper).append(a(d._template.icon).addClass(e.icon ? e.icon : d.options.nodeIcon))), d.options.enableLinks ? f.append(a(d._template.link).attr("href", e.href).append(e.text)) : f.append(e.text), d.options.showTags && e.tags && a.each(e.tags, function (b, c) {
                        f.append(a(d._template.badge).append(c))
                    }), d.$wrapper.append(f), e.nodes ? d._buildTree(e.nodes, c) : void 0
                })
            }
        },
        _buildStyleOverride: function (a) {
            var b = "";
            return this.options.highlightSelected && a === this.selectedNode ? b += "color:" + this.options.selectedColor + ";" : a.color && (b += "color:" + a.color + ";"), this.options.highlightSelected && a === this.selectedNode ? b += "background-color:" + this.options.selectedBackColor + ";" : a.backColor && (b += "background-color:" + a.backColor + ";"), b
        },
        _injectStyle: function () {
            this.options.injectStyle && !c.getElementById(this._styleId) && a('<style type="text/css" id="' + this._styleId + '"> ' + this._buildStyle() + " </style>").appendTo("head")
        },
        _buildStyle: function () {
            var a = ".node-" + this._elementId + "{";
            return this.options.color && (a += "color:" + this.options.color + ";"), this.options.backColor && (a += "background-color:" + this.options.backColor + ";"), this.options.showBorder ? this.options.borderColor && (a += "border:1px solid " + this.options.borderColor + ";") : a += "border:none;", a += "}", this.options.onhoverColor && (a += ".node-" + this._elementId + ":hover{background-color:" + this.options.onhoverColor + ";}"), this._css + a
        },
        _template: {
            list: '<ul class="list-group"></ul>',
            item: '<li class="list-group-item list-group-item-danger"></li>',
            indent: '<span class="indent"></span>',
            iconWrapper: '<span class="icon"></span>',
            icon: "<i></i>",
            link: '<a href="#" style="color:inherit;"></a>',
            badge: '<span class="badge"></span>'
        },
        _css: ".list-group-item{cursor:pointer;}span.indent{margin-left:10px;margin-right:10px}span.icon{margin-right:5px}"
    };
    var g = function (a) {
        b.console && b.console.error(a)
    };
    a.fn[e] = function (b, c) {
        return this.each(function () {
            var d = a.data(this, "plugin_" + e);
            "string" == typeof b ? d ? a.isFunction(d[b]) && "_" !== b.charAt(0) ? ("string" == typeof c && (c = [c]), d[b].apply(d, c)) : g("No such method : " + b) : g("Not initialized, can not call method : " + b) : d ? d._init(b) : a.data(this, "plugin_" + e, new f(this, a.extend(!0, {}, b)))
        })
    }
}(jQuery, window, document);