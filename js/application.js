
// Define our application.
define(
	[
		"jquery",
		"controller/dragdrop"
	],
	function( $, DragDrop ){
	
	
		// I am the application constructor.
		function Application(){

			// Create a new controller for our drag-drop interface.
			var dragDrop = new DragDrop(
				$( document ),
				$( "div.dragdrop" )
			);

		}
		
		
		// Define the class methods.
		Application.prototype = {};
		
	
		// -------------------------------------------------- //
		// -------------------------------------------------- //
		
		
		// Return the application constructor.
		return( Application );
		
		
	}
);