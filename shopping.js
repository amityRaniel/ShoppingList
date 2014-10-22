

        _.templateSettings.variable = "rc";
 
        //create my templates from the html page:
        var template3 = _.template(
            $( "script.template3" ).html()
        );
 
        var template2 = _.template(
        	$( "script.template2" ).html()
        );
        var template5 = _.template(
        	$( "script.template5" ).html()
        );

        //make the model:
        var Item = Backbone.Model.extend({
        	id: null,
        	name: "",
        	price: null
        });

        //make the collections:
        var Selected = Backbone.Collection.extend({
        	index: 0,
        	model: Item
        });
        var ItemsList = Backbone.Collection.extend({model:Item});
        
        // var itemsListView = new ItemsListView();
        // var itemsList = new ItemsList([
        //         {
        //             name: "television",
        //             price: 324
        //         },
        //         {
        //             name: "camera",
        //             price: 25
        //         },
        //         {
        //             name: "refrigirator",
        //             price: 452
        //         },
        //         {
        //             name: "air-conditoiner",
        //             price: 234
        //         }
        //     ]);

		//make the views:
		var selectedItemsList = new Selected(); //same collection shared by the ItemsListView and SelectedItemsView
        var ItemsListView = Backbone.View.extend({
        	el: "#items-list",
        	i:23,
        	initialize: function(options) {
        		this.list = options.model;
        		this.render();
        	},
        	render: function() {
        		$(this.el).html(template2({
        			listItems: this.list.toJSON()
        		}));
        		this.list.each(function(item, key) { //add the item to the selected list.
        			$('button.' + item.get("name")).bind("click", item, function(event) {
        				selectedItemsList.add(event.data.clone());
        			});
        		});
        		
        		return this;
        	}
        });

        var SelectedItemsView = Backbone.View.extend({
        	el: "#another",
        	sum: Number(0),
        	initialize: function() {
        		this.list = selectedItemsList;
        		this.listenTo(this.list, "add", this.setAndRender);
        		this.listenTo(this.list, "remove", this.render);
        		this.render();

        	},
        	renderSum: function() {
        		$("#sum").html(template5({
        			listTitle: this.sum
        		}));
        		return this;
        	},
        	render: function() {
        		$(this.el).html(template3({
        			listItems: this.list.toJSON()
        		}));
        		var that = this;
        		this.list.each(function(item, key) {//if remove button clicked, remove from selected list
        			$('button.remove' + item.get("id")).bind("click", item, function(event) {
        				// alert(event.data.get("id"));
        				var it = selectedItemsList.at(key);
        				that.sum -= it.get("price");
        				selectedItemsList.remove(it);
        			});
        		});
        		return this.renderSum();
        	},
        	setAndRender: function() {
        		var it = this.list.at(this.list.length - 1);
        		it.set("id", this.list.index++);
        		this.sum += + it.get("price");
        		return this.render();
        	}
        });
		// $.getJSON("http://localhost:8081/",function(result){
  //     		$.each(result, function(i, field){
  //     			alert(i);
  //       		alert(field);
  //     		});
  //   	});

		//load the items list from the DB:
		var itemsList = new ItemsList();
		function server() {
   			$.ajax({
   				type: "GET",
   				url: "http://localhost:8081/hey",
   				crossDomain: true,
   				success: function(data, str, jqxhr) {
   					alert(data);
   					for (var i in data["rows"]) {
   						itemsList.add(new Item({name: data["rows"]["row" + i]["name"], price: data["rows"]["row" + i]["price"]}))
   					}
   				}
   			});
		}

		// server();
 		var v = new SelectedItemsView();
 		var itemsListView = new ItemsListView({model: itemsList});
        