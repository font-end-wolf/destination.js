/** @license
 * Destination <https://github.com/vincentracine/destination.js>
 * Author: Vincent Racine | MIT License
 * v0.0.1 (31/12/2015 20:39)
 */
(function(){

	var destination,
		VERSION = '0.0.1';

	function isFunction(val) {
		return typeof val === 'function';
	}

	function decodeQueryString() {
		var query_string = {},
			query = view.split('?')[1];

		if(query){
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = decodeURIComponent(pair[1]);
					// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
					query_string[pair[0]] = [query_string[pair[0]],decodeURIComponent(pair[1])];
					// If third or later entry with this name
				} else {
					query_string[pair[0]].push(decodeURIComponent(pair[1]));
				}
			}
		}
		return query_string;
	}

	// Destination -------
	//====================

	/**
	 * @constructor
	 */
	function Destination(){
		this._routes = [];
		this.dataCache = null;
		this.rootElement = document.getElementById('app-view');

		if ("onhashchange" in window) {
			window.onhashchange = function(){
				var route = window.location.hash.slice(1);
				for(var i = 0; i < this._routes.length; i++){
					if(route === this._routes[i].url){
						this.rootElement.innerHTML = this._routes[i].template.innerHTML;
						this._routes[i].controller();
						return;
					}
				}
				return console.error('Route',route,'has not been defined');
			}.bind(this);
		}else{
			console.error('Browser does not support onhashchange event. DestinationJS will not work.');
		}
	}

	Destination.prototype = {

		define: function(route,template,controller){
			if(typeof route !== 'string'){
				return console.error('Route must be a string');
			}
			if(typeof template !== 'string'){
				return console.error('Template must be a string');
			}
			if(typeof controller !== 'undefined' && typeof controller !== 'function'){
				return console.error('Controller must be a function');
			}

			this._routes.push(new Route(route,template,controller));

		},

		go: function(route,data){
			if(typeof route !== 'string'){
				return console.error('You must specify a destination route as a string');
			}

			if(route[0] !== '/'){
				route = '/'.concat(route);
			}

			if(typeof data === 'object'){
				this.dataCache = data;
			}

			window.location.hash = route;
		},

		length: function(){
			return this._routes.length;
		},

		ready: function(){
			window.onhashchange();
		}
	};

	// Route -------------
	//====================

	/**
	 * @constructor
	 */
	function Route(){
		if(arguments.length === 3){
			this.url = arguments[0];
			try{
				this.template = document.querySelector("template[name='" + arguments[1] + "']");
			}catch(e){console.error(e)}
			this.controller = arguments[2];
		}

		return this;
	}

	destination = new Destination();

	destination.VERSION = VERSION;

	window['Destination'] = destination;

})();
