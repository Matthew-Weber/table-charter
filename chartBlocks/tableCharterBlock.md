			Reuters.Graphics.tablegraphic = new Reuters.Graphics.SortableTable({
				el: "#reutersGraphic-chart1",
				dataURL:"//d3sl9l9bcxfb5q.cloudfront.net/json/mw_candidate_twitter",
				dataColumnHeaders:["name","year", "tweets", "followers", "following"],
				headerDisplay:["Candidate", "Joined", "Tweets", "Followers", "Following"],
				initialSort:"tweets",
				formats:["text","text","noDecimal","noDecimal","noDecimal"], //"text", "noDecimal", "oneDecimal", "twoDecimal", "dollar", "percentOneDecimal" "percentTwoDecimal", "customFormat" definedbelow
				chartcol:["tweets", "followers", "following"],
				svgwidth:100,
//				customFormat:function(d){
//					var self = this;
//					if (d == "0"){return}
//					return "$"+self.oneDecimal(d)+" mln"
//				}, 
//				template:Reuters.Template.tabletemplate,				
//				barFill:function(d){
//					var self = this;
//					return cyan3
//				}
//	            template: Reuters.Template.tabletemplate,

			});
			
Reuters.Graphics.tablegraphic.on("renderChart:start", function(evt){
    var self = this;
    
})		
Reuters.Graphics.tablegraphic.on("renderChart:end", function(evt){
    var self = this;
    
})		
Reuters.Graphics.tablegraphic.on("update:start", function(evt){
    var self = this;
    
})		
Reuters.Graphics.tablegraphic.on("update:end", function(evt){
    var self = this;
    
})		