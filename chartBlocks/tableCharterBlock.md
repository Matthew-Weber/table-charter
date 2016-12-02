			Reuters.Graphics.tablegraphic = new Reuters.Graphics.SortableTable({
				el: "#reuters-table",
				dataURL:"http://sfb-proxy-prod-1197393060.us-east-1.elb.amazonaws.com/json/mw_candidate_twitter",
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
//				template:Reuters.Graphics.Template.tabletemplate,				
//				barFill:function(d){
//					var self = this;
//					return cyan3
//				}
//	            template: Reuters.Graphics.Template.tabletemplate,

			});
