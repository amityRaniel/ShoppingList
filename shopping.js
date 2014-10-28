

        _.templateSettings.variable = "rc";
 
        //create my templates from the html page:
        var template1 = _.template(
            $( "script.template1" ).html()
        );
 
        var template2 = _.template(
        	$( "script.template2" ).html()
        );
        var template3 = _.template(
        	$( "script.template3" ).html()
        );

        //make the model:
        var Item = Backbone.Model.extend({
        	id: null,
        	name: "",
        	price: null,
            numOfItems: null
        });

        //make the collections:
        var Selected = Backbone.Collection.extend({
        	index: 0,
        	model: Item
        });
        var ItemsList = Backbone.Collection.extend({model:Item});

		//make the views:
		var selectedItemsList = new Selected(); //same collection shared by the ItemsListView and SelectedItemsView
        var ItemsListView = Backbone.View.extend({
        	el: "#items-list",
        	i:23,
        	initialize: function(options) {
        		this.list = options.model;
                getData();
        		this.render();
                this.listenTo(this.list, "add", this.render);
        	},
        	render: function() {
        		this.$el.html(template2({
        			listItems: this.list.toJSON()
        		}));
        		this.list.each(function(item, key) { //add the item to the selected list.
        			$('button.' + item.get("name")).bind("click", item, function(event) {
        				var ind = selectedItemsList.findWhere({name: item.get("name")});
                        if (ind != undefined) {
                            var num = ind.get("numOfItems");
                            ind.set("numOfItems", num+1);
                            selectedItemsList.trigger("add", ind);
                        }
                        else {
                            var newIt = event.data.clone();
                            newIt.set("numOfItems", 1);
                            selectedItemsList.add(newIt);
                            
                        }
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
        		$("#sum").html(template3({
        			listTitle: this.sum
        		}));
        		return this;
        	},
        	render: function() {
        		this.$el.html(template1({
        			listItems: this.list.toJSON()
        		}));
        		var that = this;
        		this.list.each(function(item, key) {//if remove button clicked, remove from selected list
        			$('button.remove' + item.get("id")).bind("click", item, function(event) {
        				var it = selectedItemsList.at(key);
                        var num = it.get("numOfItems");
                        it.set("numOfItems", num - 1);
        				that.sum -= it.get("price");
        				if (num == 1) {
                            selectedItemsList.remove(it);
                        }
                        else {
                            selectedItemsList.trigger("remove", it);
                        }
        			});
        		});
        		return this.renderSum();
        	},
        	setAndRender: function(data) {
        		var it = this.list.at(this.list.length - 1);
        		it.set("id", this.list.index++);
        		this.sum += data.get("price");
        		return this.render();
        	}
        });

		//load the items list from the DB:
		var itemsList = new ItemsList();
        function getData() {
   			Backbone.ajax({
   				type: "GET",
   				url: "http://localhost:8081/hey",
   				crossDomain: true,
   				success: function(data, str, jqxhr) {
                    // alert("hi there");
        			for (var i in data["rows"]) {
        				itemsList.add(new Item({"name": data["rows"][i]["name"], "price": data["rows"][i]["price"]}));
   					}
        		},
                error: function() {
                    alert("failure!");
                }
   			});
		}

        var v = new SelectedItemsView();
 		var itemsListView = new ItemsListView({model: itemsList});
        