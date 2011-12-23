//
// Copy the following into the command line in order to build
// out the JavaScript application:
//
// node ../../r.js -o app.build.js
// 
//
// Define the build configuration.
({

	// This is the name of the module being optimized.
	name: "main",
	
	// This it the name of the optimized file that is being written
	// out to disk.
	out: "main-build.js",
	
	// This is our root application directory.
	appDir: "../",
	
	// This is our base URL for JavaScript modules. This is relative
	// to the appDir value.
	baseUrl: "js/",
	
	// These are the paths used for named modules. These are 
	// duplicated from within our main.js file.
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
	
})
