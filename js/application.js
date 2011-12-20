
// Define our application.
define(
	[
		"jquery",
		"view/agent",
		"view/bucket"
	],
	function( $, Agent, Bucket ){
	
	
		function Application(){

			this.stage = $( document );
			
			this.container = $( "div.dragdrop" );
			
			
			var a = new Agent( this.stage, 1 );
			a.attachContainer( this.container );
			
			var b = new Bucket();
			b.attachContainer( this.container );
			
			
			a.events.dragStarted.bind(
				function(){

					b.startTracking( a );
				
				}
			);
			
			a.events.dragStopped.bind(
				function(){
					
					b.stopTracking( a );
					
				}
			);

		}
		
		
		Application.prototype = {
			
		};
		
	
		// -------------------------------------------------- //
		// -------------------------------------------------- //
		
		
		// Return the application constructor.
		return( Application );
		
		
	}
);