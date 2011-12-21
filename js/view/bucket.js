
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
			// the testing of items over the dropzone. The dimensions
			// of the dropzone will be calculated when the dropzone
			// is attached to a container (which is the only time it 
			// has a phsyical dimension).
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
			this.events.dropped = signalFactory( "dropped" );
			this.events.popped = signalFactory( "popped" );
			
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
				
				// Calculate the dimensions and location of the 
				// rendered dropzone region.
				this.updateDropzoneRegion(); 
				
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
				// dropzone is no longer being rendered physically.
				this.updateDropzoneRegion(); 
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I handle the drag-started event for an item that is
			// contained within the local view collection.
			handleItemDragStarted: function( event ){
				
				// Get the item that is being dragged.
				var item = event.context;
				
				// Pop the item out of the local collection.
				this.popItem( item );
				
				// Return this object reference for method chaining.
				return( this );
			
			},
			
			
			// I handle the drag-stopped event for an item being 
			// tracked. If an item is stopped over the dropzone, we 
			// will announce a dropped event.
			handleItemDragStopped: function( event ){
			
				// Get the item that has stopped moving.
				var item = event.context;
				
				// Get the offset of the item (this includes the 
				// item's dimensions and location).
				var offset = item.getOffset();
				
				// Check to see if the item has been dragged over the
				// dropzone and is droppable.
				if (this.isDroppable( offset )){

					// Announce the dropped event.
					this.events.dropped.trigger( item );
					
				}
				
				// Return this object reference for method chaining.
				return( this );
			
			},
			
			
			// I handle the move event for an item being tracked.
			handleItemMoved: function( event, position, dimensions ){

				// Put together the offset of the moved item.
				var offset = {
					left: position.left,
					top: position.top,
					width: dimensions.width,
					height: dimensions.height
				};
			
				// Check to see if the item is droppable.
				if (this.isDroppable( offset )){

					// Activate the dropzone.
					this.dom.dropzone.addClass( "activated" );

				} else {
				
					// Make sure the dropzone is [no longer] activated.
					this.dom.dropzone.removeClass( "activated" );
				
				}
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I check to see if the given item is over the drop zone.
			isDroppable: function( offset ){
			
				// Check to see if the width of the given offset is 
				// fully contained within the dropzone.
				var isWidthContained = (
					(offset.left >= this.dropzoneRegion.left) &&
					((offset.left + offset.width) <= (this.dropzoneRegion.left + this.dropzoneRegion.width))
				);
				
				// Check to see if the height of the given offset is
				// fully contained within the dropzone.
				var isHeightContained = (
					(offset.top >= this.dropzoneRegion.top) &&
					((offset.top + offset.height) <= (this.dropzoneRegion.top + this.dropzoneRegion.height))
				);
				
				// Return true if both the Width and the Height of 
				// the given offset is fully contained within the 
				// rendered dropzone region.
				return( isWidthContained && isHeightContained );
				
			},
			
			
			// I pop the item out of the local collection and return 
			// it. This removes it from the local view container.
			popItem: function( item ){
			
				// Detach the item from the local container.
				item.detachContainer();
				
				// Stop tracking the drag start on the item.
				item.events.dragStarted.unbind( this.handleItemDragStarted );
			
				// Get the local container that houses the given item.
				var itemContainer = this.dom.dropzone.children()
					.filter(
						function( index ){
							
							// Return true if the controller associated
							// with the local container is the item. 
							return( $( this ).data( "controller" ) === item );
							
						}
					)
				;
				
				// Remove the local item container from the dropzone.
				itemContainer.remove();
				
				// Update the count.
				this.dom.count.text( --this.itemCount );
				
				// Announce the popped event.
				this.events.popped.trigger( item );
				
				// Return the popped item.
				return( item );
				
			},
			
			
			// I push an item onto the collection of stored items, 
			// adding it to the local view container.
			pushItem: function( item ){
				
				// Create a new item container.
				var itemContainer = $( "<li>" );
				
				// Store the related item reference in the data so 
				// that we can use it later.
				itemContainer.data( "controller", item );
			
				// Add it to the list of dropped items.
				this.dom.dropzone.append( itemContainer );
				
				// Attach the item to the new container.
				item.attachContainer( itemContainer );
				
				// Update the count.
				this.dom.count.text( ++this.itemCount );
				
				// Bind to the item's drag start. If the item begins 
				// to be dragged again, we want to remove it from the
				// local container.
				item.events.dragStarted.bind( this.handleItemDragStarted, this );
				
				// Return this object reference for method chaining.
				return( this );
			
			},
			
			
			// I start tracking the given item.
			startTracking: function( item ){

				// Bind to the movements of the item so that we can
				// track its movement over the dropzone.
				item.events.moved.bind( this.handleItemMoved, this );
				
				// Bind to the end of the drag so that we can tell if
				// the given item was dropped above our dropzone.
				item.events.dragStopped.bind( this.handleItemDragStopped, this );
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I stop tracking the given item.
			stopTracking: function( item ){

				// Stop tracking the movement of the item.
				item.events.moved.unbind( this.handleItemMoved );
				
				// Stop tracking the drag of the item.
				item.events.dragStopped.unbind( this.handleItemDragStopped );
				
				// Make sure the dropzone is deactivated (it may have 
				// been activated by a drag-over of the item).
				this.dom.dropzone.removeClass( "activated" );
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I update the dimensions and location of the dropzone
			// region. Since the dropzone only has a region when it
			// is attached to a visible container, we may change 
			// throughout the bucket lifecycle.
			updateDropzoneRegion: function(){
			
				// Get the position of the dropzone in the document.
				// 
				// NOTE: For now, we're not going to worry about 
				// containers; to keep it simple, we'll only use 
				// the document for coordinates.
				var position = this.dom.dropzone.offset();
				
				// Set the dimensions of the region.
				this.dropzoneRegion.left = position.left;
				this.dropzoneRegion.top = position.top;
				this.dropzoneRegion.width = this.dom.dropzone.outerWidth();
				this.dropzoneRegion.height = this.dom.dropzone.outerHeight();
				
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