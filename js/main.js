
// Small prototype hack just to get unshift working in IE.
if (!Array.prototype.hasOwnProperty( "unshift2" )){

	// Define the unshift shim.
	Array.prototype.unshift2 = function(){
		
		// Create a set of arguments to be used in the underlying
		// splice() method call.
		var spliceArguments = Array.prototype.slice.call( arguments );
		
		// Add the zero for index and delete count. This will convert
		// the unshift() arguments collection into a collection that
		// can be used with spliec();
		spliceArguments.splice( 0, 0, 0, 0 );
		
		// Splice the unshifted elements on the array.
		Array.prototype.splice.apply( this, spliceArguments );
	
	};

}


// ----------------------------------------------------------- //
// ----------------------------------------------------------- //


// Define the paths to be used in the script mappings. Also, define
// the named module for certain libraries that are AMD compliant.
require.config({
	baseUrl: "js/",
	paths: {
		"controller": "controller",
		"domReady": "lib/require/domReady",
		"jquery": "lib/jquery/jquery-1.7.1",
		"model": "model",
		"signal": "lib/signal",
		"templates": "../templates",
		"text": "lib/require/text",
		"view": "view"
	}
});


// Load the application.
require(
	[
		"jquery",
		"application",
		"domReady"
	],
	function( $, Application ){
	
	
		// Bootstrap our application instance.
		var application = new Application();
					

	}
);
