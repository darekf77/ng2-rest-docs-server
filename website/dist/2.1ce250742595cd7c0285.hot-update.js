webpackHotUpdate(2,{

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var ng2_translate_1 = __webpack_require__(281);
	var json_config_service_1 = __webpack_require__(562);
	function groupFiles(files) {
	    var groups = [];
	    files.forEach(function (f) {
	        if (f.group === undefined)
	            f.group = '-- undefined --';
	        console.log(f.group);
	        var a = groups.filter(function (g) { return g.name === f.group; });
	        if (a.length === 0) {
	            groups.push({
	                name: f.group,
	                files: JSON.parse(JSON.stringify(files.filter(function (ff) { return ff.group === f.group; })))
	            });
	        }
	    });
	    return groups;
	}
	function mergeExamples(files) {
	    var tmpFiles = [];
	    files.forEach(function (f) {
	        var a = tmpFiles.filter(function (d) { return d.url === f.url; });
	        if (a.length === 0) {
	            var docM = JSON.parse(JSON.stringify(f));
	            docM.examples = [];
	            docM.examples.push(JSON.parse(JSON.stringify(f)));
	            // TODO remove some shit from docM
	            tmpFiles.push(docM);
	        }
	        else {
	            console.log('aaa', a);
	            a[0].examples.push(JSON.parse(JSON.stringify(f)));
	        }
	    });
	    return tmpFiles;
	}
	var StartPageComponent = (function () {
	    function StartPageComponent(config) {
	        this.config = config;
	        this.groups = [];
	        this.handlers = [];
	    }
	    StartPageComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this.handlers.push(this.config.model.getGroupFilesList().subscribe(function (names) {
	            console.log('names', names);
	            _this.getGroups(names);
	        }));
	        this.handlers.push(this.config.model.getMessage().subscribe(function (msg) {
	            console.log('msg', msg);
	            _this.msg = msg;
	        }));
	    };
	    StartPageComponent.prototype.getGroups = function (names) {
	        var _this = this;
	        if (names.length === 0)
	            return;
	        this.handlers.push(this.config.model.getGroup(names.pop()).subscribe(function (group) {
	            _this.groups.push(group);
	            _this.getGroups(names);
	        }));
	    };
	    StartPageComponent.prototype.ngOnDestroy = function () {
	        this.handlers.forEach(function (h) { return h.unsubscribe(); });
	    };
	    StartPageComponent.prototype.cuttedUrl = function (file) {
	        return file.baseURL ? file.url.replace(file.baseURL, '') : file.url;
	    };
	    StartPageComponent.prototype.selectFile = function (file, e) {
	        var _this = this;
	        this.lastE = e;
	        if (this.activeFile === file) {
	            // console.log('unselect file')
	            this.activeFile = undefined;
	            setTimeout(function () {
	                var style = window.getComputedStyle(_this.lastDesc, undefined);
	                _this.lastElemem.style['padding-bottom'] = '0px';
	            });
	            return;
	        }
	        // console.log('select')
	        this.activeFile = file;
	        if (this.lastDesc !== undefined && this.lastElemem !== undefined) {
	            var style = window.getComputedStyle(this.lastDesc, undefined);
	            this.lastElemem.style['padding-bottom'] = '0px';
	        }
	        this.recalculatePadding();
	    };
	    StartPageComponent.prototype.recalculatePadding = function () {
	        var _this = this;
	        setTimeout(function () {
	            // console.log(e.srcElement)
	            var elem = _this.lastE.srcElement.parentElement;
	            var box = elem.getElementsByClassName('description').item(0);
	            _this.lastDesc = box;
	            var style = window.getComputedStyle(_this.lastDesc, undefined);
	            var method = elem.getElementsByClassName('method').item(0);
	            _this.lastElemem = method;
	            var pad = Number(style.height.replace('px', ''));
	            _this.lastElemem.style['padding-bottom'] = (pad + 20) + "px";
	        });
	    };
	    StartPageComponent.prototype.openExample = function (ex) {
	        if (!ex['isOpen']) {
	            ex['isOpen'] = true;
	        }
	        else {
	            ex['isOpen'] = !ex['isOpen'];
	        }
	        this.recalculatePadding();
	    };
	    StartPageComponent.prototype.removeReturn = function (s) {
	        return s.replace(/'\\n'/g, '<br>');
	    };
	    StartPageComponent = __decorate([
	        core_1.Component({
	            selector: 'start-page',
	            template: __webpack_require__(575),
	            styles: [__webpack_require__(573)],
	            pipes: [ng2_translate_1.TranslatePipe],
	            providers: [json_config_service_1.JsonConfigService]
	        }), 
	        __metadata('design:paramtypes', [json_config_service_1.JsonConfigService])
	    ], StartPageComponent);
	    return StartPageComponent;
	}());
	exports.StartPageComponent = StartPageComponent;


/***/ }

})
//# sourceMappingURL=main.map