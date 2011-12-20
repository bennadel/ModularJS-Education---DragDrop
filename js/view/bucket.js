
// Define the Bucket view controller.
define(
	[
		"jquery",
		"signal",
		"text!templates/bucket.htm"
	],
	function( $, Signal, bucketHtml ){


		// I return an intialized module.
		function Bucket(){
			
			// Keep track of relevant DOM elements that will be used
			// throughout the lifecycle of this view.			
			this.dom = {};
			
			// Create a detached DOM node for this view.
			this.dom.target = $( bucketHtml ).filter( "div.bucket" );
			
			// Get a refrence to the drop zone on which items will
			// be dropped.
			this.dom.dropzone = this.dom.target.find( "ul.dropzone" );
			
			// Get a reference to the counter.
			this.dom.count = this.dom.target.find( "div.count > span.value" );
			
			// I am the current container. This will be null unless the
			// target is attached to a specific container.
			this.dom.container = null;
			
			// Set the initial number of items.
			this.itemCount = 0;
			
			// Render the count.
			this.dom.count.text( this.itemCount );
			
			// Set the dropzone region. This will be used to expedite
			// the testing of items over the dropzone.
			this.dropzoneRegion = {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			};
			
			// Create a singal factory for this context.
			var signalFactory = Signal.forContext( this );
			
			// Create an event surface.
			this.events = {};
			this.events.dropzoneEntered = signalFactory( "dropzoneEntered" );
			this.events.dropzoneLeft = signalFactory( "dropzoneLeft" );
			
			// Return this object reference.
			return( this );
			
		}
		
		
		// Define the class instance methods.
		Bucket.prototype = {
			
			
			// I attach the target to the given container.
			attachContainer: function( container ){
			
				// Detached the target from its current contianer.
				this.detachContainer();
				
				// Store the container reference.
				this.dom.container = container;

				// Add the target to the new container.
				this.dom.container.append( this.dom.target );
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I calculate the region of the dropzone within the 
			// current container.
			calculateDropzoneRegion: function(){
			
				// Get the position of the dropzone in the document.
				var position = this.dom.dropzone.offset();
				
				// Set the dimensions of the region.
				this.dropzoneRegion.left = position.left;
				this.dropzoneRegion.top = position.top;
				this.dropzoneRegion.width = (this.dom.dropzone.width() || 0);
				this.dropzoneRegion.height = (this.dom.dropzone.height() || 0);
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I detach the target from its current container.
			detachContainer: function(){

				// Clear the container reference; this target no 
				// longer has a home.
				this.dom.container = null;
				
				// Remove the container from the current element. Use
				// detach (rather than remove()) so that we leave all
				// relevant event bindings in place.
				this.dom.target.detach();
				
				// Reset the dropzone region dimentions since the 
				// dropzone is no longer rendered.
				this.dropzoneRegion.width = 0;
				this.dropzoneRegion.height = 0;
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I handle the move event for an item.
			handleItemMoved: function( event, left, top ){
			
				var item = event.context;
				
				console.log( this.isDroppable( item ) );
				
			},
			
			
			// I check to see if the given item is over the drop zone.
			isDroppable: function( item ){
			
				var itemDimensions = item.getDimensions();
				
				var dropzoneDimensions = this.calculateDropzoneRegion()
					.dropzoneRegion
				;
				
				return(
					(itemDimensions.left > dropzoneDimensions.left) &&
					(itemDimensions.top > dropzoneDimensions.top) &&
					(itemDimensions.left + itemDimensions.width) < (dropzoneDimensions.left + dropzoneDimensions.width) &&
					(itemDimensions.top + itemDimensions.height) < (dropzoneDimensions.top + dropzoneDimensions.height)					
				);
				
			},
			
			
			// I start tracking the given item.
			startTracking: function( item ){
			
				// Bind to the movements of the item so that we can
				// track its movement over the dropzone.
				item.events.moved.bind( this.handleItemMoved, this );
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I stop tracking the given item.
			stopTracking: function( item ){

				// Stop tracking the movement of the item.
				item.events.moved.unbind( this.handleItemMoved );
				
				// Return this object reference for method chaining.
				return( this );
				
			}
			
		
		}; 
		

		// -------------------------------------------------- //
		// -------------------------------------------------- //
		
		
		// Return the constructor for this view.
		return( Bucket );


	}
);