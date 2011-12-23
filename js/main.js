
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
