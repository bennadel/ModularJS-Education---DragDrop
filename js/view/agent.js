
// Define the Agent view controller.
define(
	[
		"jquery",
		"signal",
		"text!templates/agent.htm"
	],
	function( $, Signal, agentHtml ){


		// I return an intialized module.
		function Agent( stage, label ){

			// Keep track of relevant DOM elements that will be used
			// throughout the lifecycle of this view.			
			this.dom = {};
			
			// Create a detached DOM node for this view.
			this.dom.target = $( agentHtml ).filter( "div.agent" );
			
			// Get a reference to the label holder.
			this.dom.label = this.dom.target.find( "div.label > span.value" );
			
			// Get a handle to the stage on which this agent is being
			// displayed. This will be needed for binding global mouse
			// movements event handlers.
			this.dom.stage = stage;
			
			// I am the current container. This will be null unless the
			// target is attached to a specific container.
			this.dom.container = null;
			
			// Store the label value.
			this.label = label;
			
			// Render the label.
			this.dom.label.text( this.label );
			
			// Create a singal factory for this context.
			var signalFactory = Signal.forContext( this );
			
			// Create an event surface.
			this.events = {};
			this.events.dragStarted = signalFactory( "dragStarted" );
			this.events.dragStopped = signalFactory( "dragStopped" );
			this.events.moved = signalFactory( "moved" );
			
			// I am the offset of the mouse within the agent for the
			// duration of a dragging session. This will contain a
			// structure with left/top values. 
			this.mouseOffsetDuringDrag = null;
			
			// I am the dimensions of the target. I will be calculated
			// when the target is attached to a container (since this
			// is the only time that it truly has dimensions).
			this.dimensions = {
				width: 0,
				height: 0
			};
			
			// Bind to the mouse click events to start and stop drag
			// of the target.
			this.dom.target
				.mousedown(
					$.proxy( this.handleMouseDown, this )
				)
				.mouseup(
					$.proxy( this.handleMouseUp, this )
				)
			;
			
			// Return this object reference.
			return( this );
			
		}
		
		
		// Define the class instance methods.
		Agent.prototype = {
			
			
			// I attach the target to the given container.
			attachContainer: function( container ){
			
				// Detached the target from its current contianer.
				this.detachContainer();
				
				// Store the container reference.
				this.dom.container = container;

				// Add the target to the new container.
				this.dom.container.append( this.dom.target );
				
				// Calculate the dimensions of the rendered target.
				this.updateDimensions();
				
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
				
				// Reset the dimensions since this item is not being
				// rendered in a physical space.
				this.updateDimensions();
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I return the dimensions and location of the target.
			getOffset: function(){
			
				// Get the current position of the target within the 
				// greater document.
				//
				// NOTE: For now, we're not going to worry about how
				// this relates to actual containers - we'll just use
				// the page coordinates. 
				var position = this.dom.target.offset();
			
				// Return the dimensions / position of the target on 
				// the stage.
				return({
					left: position.left,
					top: position.top,
					width: this.dimensions.width,
					height: this.dimensions.height
				});
			
			},
			
			
			// I listen for mouse down events to start the dragging.
			handleMouseDown: function( event ){

				// Get the position of the click on the document.
				var pageX = event.pageX;
				var pageY = event.pageY;
				
				// Get the current position of the agent that is 
				// being clicked. 
				//
				// NOTE: Since the event returns the pageX and pageY
				// in terms of the entire document, we'll also get 
				// the target position in terms of the document.
				var position = this.dom.target.offset();
				
				// Start the dragging, adjusting for the local offset
				// of the mouse within the agent.
				this.startDrag({
					left: (pageX - position.left),
					top: (pageY - position.top)
				});
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I listen for mouse movements on the stage to update 
			// the position of the agent during dragging.
			handleMouseMove: function( event ){

				// Get the position of the argent on the stage, taking
				// into account the original offset of the mouse on
				// the first click.
				var left = (event.pageX - this.mouseOffsetDuringDrag.left);
				var top = (event.pageY - this.mouseOffsetDuringDrag.top);
				
				// Move the agent to the mouse position.
				this.move({
					top: top,
					left: left
				});
				
				// Return this object reference for method chaining.
				return( this );

			},
			
			
			// I listen for the mouse up event to stop dragging.
			handleMouseUp: function( event ){
				
				// Stop dragging the agent.
				this.stopDrag();
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I move the target to the given position.
			move: function( position ){
				
				// Update the position of the agent on the stage.
				this.dom.target.css({
					left: (position.left + "px"),
					top: (position.top + "px")
				});
				
				// Publish the event. Include both the updated 
				// location as well as the dimensions of the target. 
				this.events.moved.trigger(
					position,
					this.dimensions
				);
				
				// Return this object reference for method chaining.
				return( this );
			
			},
			
			
			// I start the draggability of the agent. This is done 
			// through mouse-move bindings to the stage.
			startDrag: function( mouseOffsetDuringDrag ){
			
				// Store the mouse offset as we will need this to 
				// position the agent as the mouse moves.
				this.mouseOffsetDuringDrag = mouseOffsetDuringDrag;
				
				// Listen to the mouse movement on the stage. We're 
				// binding to the stage, rather than target since the
				// mouse is likely to move faster than the target 
				// (but never faster than the stage ;)). 
				this.dom.stage.mousemove(
					$.proxy( this.handleMouseMove, this )
				);
				
				// Listen to the mouse-up on the stage (this will be 
				// used to end the drag). Just as with the move, we 
				// need to track this on the stage, rather than the 
				// target since the target might not be in place by
				// the time the mouse is released.
				this.dom.stage.mouseup(
					$.proxy( this.handleMouseUp, this )
				);
				

				// ------------------------------------------ //
				// ------------------------------------------ //
				// NOTE: This is a hack to help the shift in 
				// context bewteen the absolutely positioned 
				// container and the staticly positioned 
				// container. I am not sure how to get around 
				// this in a more elegant way.
				this.move( this.dom.target.offset() );
				// ------------------------------------------ //
				// ------------------------------------------ //
				
				
				// Publish the event.
				this.events.dragStarted.trigger();
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I stop the draggability of the agent. This is done
			// through mouse-up on the stage.
			stopDrag: function(){
			
				// Clear the mouse position as this is no longer 
				// needed until drag is once again enabled.
				this.mouseOffsetDuringDrag = null;
				
				// Stop listening to the mouse movement on the stage;
				// we are no longer dragging the agent.
				this.dom.stage.unbind( "mousemove", this.handleMouseMove );
				
				// Stop listening for the mouse up on the stage; we 
				// are no longer dragging the agent.
				this.dom.stage.unbind( "mouseup", this.handleMouseUp );
				
				// Publish the event.
				this.events.dragStopped.trigger();
				
				// Return this object reference for method chaining.
				return( this );
				
			},
			
			
			// I update the dimensions of the target. Since we are 
			// not sure what kind of container the target is being
			// attached to, it's possible that it is being attached
			// to a hidden / detached container which, itself, will
			// not have any dimensions.
			updateDimensions: function(){
			
				// Calculate the dimensions of the [MAYBE] rendered 
				// target element.
				this.dimensions.width = this.dom.target.outerWidth();
				this.dimensions.height = this.dom.target.outerHeight();
				
				// Return this object reference for method chaining.
				return( this );
				
			}
			
		
		}; 
		

		// -------------------------------------------------- //
		// -------------------------------------------------- //
		
		
		// Return the constructor for this view.
		return( Agent );


	}
);