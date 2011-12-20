
// Define the signal module.
define(
	[
		"jquery"
	],
	function( $ ){
	
	
		// I provide binding and triggering capabilities for a 
		// single event type in a given context.
		function Signal( context, eventType ){

			// Store the context.
			this.context = context;
			
			// Store the event type.
			this.eventType = eventType;

			// Define the subscribers that are bound to this event.
			this.callbacks = [];

			// Return this object reference.
			return( this );
			
		}
		
		
		// I am a contect-sensitive factory for signals. I return
		// a new constructor that uses the same context for every
		// instantiation.
		Signal.forContext = function( context ){
		
			// Create a factory bound to the given context.
			var factory = function( eventType ){
				
				// Return context-bound Signal.
				return( 
					new Signal( context, eventType ) 
				);
				
			};
			
			// Return the bound factory.
			return( factory );
			
		};
		
		
		// Define the class methods.
		Signal.prototype = {

			// I bind a subscriber for this event.
			bind: function( callback ){

				// Add this callback to the subscribers.
				this.callbacks.push( callback );
				
				// Return this object reference for method chaining.
				return( this );
			
			},
			
			
			// I trigger the event with the given meta-data.
			trigger: function(){
				
				// Get the trigger arguments so we can pass them onto 
				// the subscrigers.
				var eventArguments = Array.prototype.slice.call( arguments );
				
				// Create the triggered event object.
				var event = {
					type: this.eventType,
					context: this.context,
					date: new Date()
				};
				
				// Prepend the event to the arguments.
				eventArguments.unshift( event );

				// Publish the event to all of the subscribers.
				for (var i = 0 ; i < this.callbacks.length ; i++){
 					
					// Publish event.
					this.callbacks[ i ].apply( this.context, eventArguments );
					
 				}
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I remove the given subscriber from this event.
			unbind: function( callback ){
				
				// Remove all instances of this callback from the 
				// collection of subscribers.
				this.callbacks = $.map(
					this.callbacks,
					function( thisCallback ){

						// Check to see if this callback is one of
						// the ones we need to unbind. We are including
						// a check for GUID value in case this function
						// was proxies in jQuery.
						if (
								(thisCallback === callback) 
							||
								(
									thisCallback.hasOwnProperty( "guid" ) &&
									callback.hasOwnProperty( "guid" ) &&
									(thisCallback.guid === callback.guid) 
								) 
							){
						
							// Return null to unsubscriber.
							return( null );
						
						} else {

							// We are keeping this subscriber.
							return( thisCallback );

						}

					}
				);
			
			}
			
		};
		
		
		// -------------------------------------------------- //
		// -------------------------------------------------- //

		
		// Return the constructor.
		return( Signal );
		

	}
);

