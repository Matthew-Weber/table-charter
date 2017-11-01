Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};

Reuters.Graphics.SortableTable = Backbone.View.extend({
	data: undefined,
	dataURL:undefined,
	template: Reuters.Graphics.tableCharter.Template.tabletemplate,
	svgwidth: 100,
	svgHeight: 15,
	barScale: {},

	initialize: function(opts){

		this.options = opts; 	
		var self = this;
		
		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function(item, key){
			self[key] = item;
		});	

		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)){
			d3.json(self.dataURL, function(data){
				self.parseData (data);
			});
		} 
		if (this.dataURL.indexOf("csv") > -1){
			d3.csv(self.dataURL, function(data){
				self.parseData (data);
			});
		}
		if (_.isObject(this.dataURL)){
			setTimeout(function(){
				self.parseData (self.dataURL);											
			}, 100);
		}	
	//end of initialize		
	},

	parseData: function(data){
		var self = this;

		self.targetDiv = $(self.el).attr("id");		

		self.noDecimal = d3.format(",.0f");
		self.oneDecimal = d3.format(",.1f");
		self.twoDecimal = d3.format(",.2f");
		self.dollar = d3.format("$,.2f");
		self.percentOneDecimal = d3.format(",.1f%");
		self.percentTwoDecimal = d3.format(",.2f%");
		self.text = function(d){return d;};

		self.data = new Reuters.Graphics.TableCollection(data);
		self.tableData = self.data.toJSON();		
		
		self.dataColumnHeaders = self.dataColumnHeaders || _.keys(data[0]);
		self.headerDisplay = self.headerDisplay || self.dataColumnHeaders;
		self.initialSort = self.initialSort || self.dataColumnHeaders[1];
		self.baseRender();

		
	},
	barFill: function(d){
		var self = this;
		return cyan3;	
	},
	addBars: function(colName){
		var self = this;

		self.barScale[colName] = d3.scale.linear()
			.range([0,self.svgWidth])
			.domain([
				Math.min(0,d3.min(self.tableData, function(d){return parseFloat(d[colName]);})),
				Math.max(0,d3.max(self.tableData, function(d){return parseFloat(d[colName]);}))
			]);

		d3.selectAll("#"+self.targetDiv + " ."+colName)
			.data(self.tableData)
			.append("svg")
			.attr("height", self.svgHeight)
			.attr("width", self.svgWidth)
			.append("rect")
			.attr("height",self.svgHeight)
			.attr("width",  function(d){				
				return Math.abs(self.barScale[colName](parseFloat(d[colName])) - self.barScale[colName](0));
			})
			.attr("x",  function(d){								
				return self.barScale[colName](  Math.min(0,parseFloat(d[colName]))  );
			})
			.style("fill", function(d){
				return self.barFill(d);
			});
	},
	addSorters:function(){
		var self = this;
		$.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'toNumber', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s) { 
	            // format your data for normalization 
	            return Number(s.replace(/[^0-9\.]+/g,""));
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    });				

		$("#" +self.targetDiv+" table").tablesorter({
			sortList: [[self.dataColumnHeaders.indexOf(self.initialSort),1]],
			 headers: { 
			    0: { 
			        type:'text' 
			    },			               
			}	  
		});
	},
	
	
	baseRender: function() { 
		var self = this;
		self.trigger("renderChart:start")		
		self.$el.html(self.template({data:self.tableData, self:self}));
		console.log(self.tableData);
		self.svgWidth = self.svgwidth;
		
		if ($(window).width() <600 ){
			self.svgWidth = 100;
		}
		
		if (self.chartcol){
			self.chartcol.forEach(function(d){
				self.addBars(d);		
			});
		}
		
		self.addSorters()
			

		
		self.tableRows = d3.selectAll("#" +self.targetDiv+" tbody tr");
		self.tableCells = self.tableRows.selectAll("th, td");


		d3.selectAll("#" +self.targetDiv+" thead tr th")
			.on("click", function(d,i){
				var index = i;
				self.tableCells.classed("highlight", function(d,i){
					if (i == index){
						return true;
					}else{return false;}						
				});
		});

		$(window).on("resize", _.debounce(function(event) {
			if (self.chartcol){
				self.chartcol.forEach(function(d){
					self.update(d);				
				});
			}						
		},100));	
		self.trigger("renderChart:end")		

	},
	update: function(colName){
		var self = this;
		self.trigger("update:start")		

		if ($(window).width() <600 ){
			self.svgWidth = 100;
		}else{
			self.svgWidth = self.svgwidth;
		}

		self.barScale[colName]
			.range([0,self.svgWidth]);

		d3.selectAll("#"+self.targetDiv + " ."+colName+" svg")
			.transition()
			.attr("width", self.svgWidth);

		d3.selectAll("#"+self.targetDiv + " ."+colName+" svg rect")
			.transition()
			.attr("width",  function(d){				
				return Math.abs(self.barScale[colName](parseFloat(d[colName])) - self.barScale[colName](0));
			})
			.attr("x",  function(d){								
				return self.barScale[colName](  Math.min(0,parseFloat(d[colName]))  );
			});
		self.trigger("update:emd")		
		
	}
//end of view
});


Reuters.Graphics.TableModel = Backbone.Model.extend({
	initialize:function(attributes, options) {
		return;
    },
	parse: function(point){
		return;
	},
});
//the collection of datapoint which will sort by date.
Reuters.Graphics.TableCollection = Backbone.Collection.extend({
	comparator: function(item) {
		return;
    },
	model: Reuters.Graphics.TableModel,
	parse: function(data){
		return data;
	},
});






