(function () {
	window["Reuters"] = window["Reuters"] || {};
	window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
	window["Reuters"]["Graphics"]["tableCharter"] = window["Reuters"]["Graphics"]["tableCharter"] || {};
	window["Reuters"]["Graphics"]["tableCharter"]["Template"] = window["Reuters"]["Graphics"]["tableCharter"]["Template"] || {};

	window["Reuters"]["Graphics"]["tableCharter"]["Template"]["tabletemplate"] = function (t) {
		var __t,
		    __p = '',
		    __j = Array.prototype.join;
		function print() {
			__p += __j.call(arguments, '');
		}
		__p += '<div class="table-responsive hidden-xs-down">\n	<table id="dataTable1" cellspacing="1" class="tablesorter table table-condensed">\n	  <thead>\n	    <tr>\n			';
		t.self.headerDisplay.forEach(function (d) {
			;
			__p += '\n				<th>' + ((__t = d) == null ? '' : __t) + '</th>\n			';
		});
		__p += '\n	    </tr>\n	  </thead>\n	  <tbody>\n			';
		t.data.forEach(function (row) {
			;
			__p += '\n				<tr role="row">\n					';
			t.self.dataColumnHeaders.forEach(function (header, index) {
				var value = row[header];
				var formater = t.self[t.self.formats[index]] || t.self.text;
				if (index == 0) {
					;
					__p += '\n							<th>' + ((__t = value) == null ? '' : __t) + '</th>\n						';
				} else {
					;
					__p += '\n							<td class="';
					if (header == t.self.initialSort) {
						;
						__p += 'highlight ';
					};
					__p += ' ' + ((__t = header) == null ? '' : __t) + '">' + ((__t = formater(value)) == null ? '' : __t) + '</td>	\n						\n					';
				}
			});
			__p += '\n				</tr>\n			';
		});
		__p += '	  \n	  </tbody>\n	</table>\n</div>\n<div class="table-mobile-version hidden-sm-up">\n	';
		t.data.forEach(function (d) {
			t.self.dataColumnHeaders.forEach(function (key, i) {
				var formater = t.self[t.self.formats[i]] || t.self.text;
				__p += '\n			';
				if (i == 0) {
					;
					__p += '\n				<div class="header">' + ((__t = formater(d[key])) == null ? '' : __t) + '</div>\n			';
				} else {
					;
					__p += '\n				<div class="row">\n					<div class="category col-xs-6">' + ((__t = t.self.headerDisplay[i]) == null ? '' : __t) + '</div>\n					<div class="value text-right col-xs-6">' + ((__t = formater(d[key])) == null ? '' : __t) + '</div>\n				</div>\n			';
				};
				__p += '\n		';
			});
			__p += '	\n	<hr>\n\n	';
		});
		__p += '\n\n</div>';
		return __p;
	};
})();
Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};

Reuters.Graphics.SortableTable = Backbone.View.extend({
	data: undefined,
	dataURL: undefined,
	template: Reuters.Graphics.tableCharter.Template.tabletemplate,
	svgwidth: 100,
	svgHeight: 15,
	barScale: {},

	initialize: function initialize(opts) {

		this.options = opts;
		var self = this;

		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function (item, key) {
			self[key] = item;
		});

		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)) {
			d3.json(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (this.dataURL.indexOf("csv") > -1) {
			d3.csv(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (_.isObject(this.dataURL)) {
			setTimeout(function () {
				self.parseData(self.dataURL);
			}, 100);
		}
		//end of initialize		
	},

	parseData: function parseData(data) {
		var self = this;

		self.targetDiv = $(self.el).attr("id");

		self.noDecimal = d3.format(",.0f");
		self.oneDecimal = d3.format(",.1f");
		self.twoDecimal = d3.format(",.2f");
		self.dollar = d3.format("$,.2f");
		self.percentOneDecimal = d3.format(",.1f%");
		self.percentTwoDecimal = d3.format(",.2f%");
		self.text = function (d) {
			return d;
		};

		self.data = new Reuters.Graphics.TableCollection(data);
		self.tableData = self.data.toJSON();

		self.dataColumnHeaders = self.dataColumnHeaders || _.keys(data[0]);
		self.headerDisplay = self.headerDisplay || self.dataColumnHeaders;
		self.initialSort = self.initialSort || self.dataColumnHeaders[1];
		self.baseRender();
	},
	barFill: function barFill(d) {
		var self = this;
		return cyan3;
	},
	addBars: function addBars(colName) {
		var self = this;

		self.barScale[colName] = d3.scale.linear().range([0, self.svgWidth]).domain([Math.min(0, d3.min(self.tableData, function (d) {
			return parseFloat(d[colName]);
		})), Math.max(0, d3.max(self.tableData, function (d) {
			return parseFloat(d[colName]);
		}))]);

		d3.selectAll("#" + self.targetDiv + " ." + colName).data(self.tableData).append("svg").attr("height", self.svgHeight).attr("width", self.svgWidth).append("rect").attr("height", self.svgHeight).attr("width", function (d) {
			return Math.abs(self.barScale[colName](parseFloat(d[colName])) - self.barScale[colName](0));
		}).attr("x", function (d) {
			return self.barScale[colName](Math.min(0, parseFloat(d[colName])));
		}).style("fill", function (d) {
			return self.barFill(d);
		});
	},
	addSorters: function addSorters() {
		var self = this;
		$.tablesorter.addParser({
			// set a unique id 
			id: 'toNumber',
			is: function is(s) {
				// return false so this parser is not auto detected 
				return false;
			},
			format: function format(s) {
				// format your data for normalization 
				return Number(s.replace(/[^0-9\.]+/g, ""));
			},
			// set type, either numeric or text 
			type: 'numeric'
		});

		$("#" + self.targetDiv + " table").tablesorter({
			sortList: [[self.dataColumnHeaders.indexOf(self.initialSort), 1]],
			headers: {
				0: {
					type: 'text'
				}
			}
		});
	},

	baseRender: function baseRender() {
		var self = this;
		self.trigger("renderChart:start");
		self.$el.html(self.template({ data: self.tableData, self: self }));
		console.log(self.tableData);
		self.svgWidth = self.svgwidth;

		if ($(window).width() < 600) {
			self.svgWidth = 100;
		}

		if (self.chartcol) {
			self.chartcol.forEach(function (d) {
				self.addBars(d);
			});
		}

		self.addSorters();

		self.tableRows = d3.selectAll("#" + self.targetDiv + " tbody tr");
		self.tableCells = self.tableRows.selectAll("th, td");

		d3.selectAll("#" + self.targetDiv + " thead tr th").on("click", function (d, i) {
			var index = i;
			self.tableCells.classed("highlight", function (d, i) {
				if (i == index) {
					return true;
				} else {
					return false;
				}
			});
		});

		$(window).on("resize", _.debounce(function (event) {
			if (self.chartcol) {
				self.chartcol.forEach(function (d) {
					self.update(d);
				});
			}
		}, 100));
		self.trigger("renderChart:end");
	},
	update: function update(colName) {
		var self = this;
		self.trigger("update:start");

		if ($(window).width() < 600) {
			self.svgWidth = 100;
		} else {
			self.svgWidth = self.svgwidth;
		}

		self.barScale[colName].range([0, self.svgWidth]);

		d3.selectAll("#" + self.targetDiv + " ." + colName + " svg").transition().attr("width", self.svgWidth);

		d3.selectAll("#" + self.targetDiv + " ." + colName + " svg rect").transition().attr("width", function (d) {
			return Math.abs(self.barScale[colName](parseFloat(d[colName])) - self.barScale[colName](0));
		}).attr("x", function (d) {
			return self.barScale[colName](Math.min(0, parseFloat(d[colName])));
		});
		self.trigger("update:emd");
	}
	//end of view
});

Reuters.Graphics.TableModel = Backbone.Model.extend({
	initialize: function initialize(attributes, options) {
		return;
	},
	parse: function parse(point) {
		return;
	}
});
//the collection of datapoint which will sort by date.
Reuters.Graphics.TableCollection = Backbone.Collection.extend({
	comparator: function comparator(item) {
		return;
	},
	model: Reuters.Graphics.TableModel,
	parse: function parse(data) {
		return data;
	}
});
//# sourceMappingURL=tableCharter.js.map
