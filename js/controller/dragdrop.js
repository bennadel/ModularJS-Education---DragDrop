
// Define the DragDrop controller.
define(
	[
		"jquery",
		"view/agent",
		"view/bucket"
	],
	function( $, Agent, Bucket ){

		
		// I am the DragDrop constructor.
		function DragDrop( stage, container ){
			
			// Store the stage and the container properties.
			this.dom = {
				stage: stage,
				container: container
			};
			
			// Store the number of agents that have been created.
			this.agentCount = 0;
			
			// Create a collection of buckets.
			this.buckets = [];
			
			// Create a collection of agents. The primary key will 
			// be used to manage the internal count of agents for
			// labelling purposes.
			this.agents = [];
			this.agents.primaryKey = 0;
			
			// Add an agent and a bucket.
			this.addAgent();
			this.addBucket();
			
			// Return this object reference.
			return( this );
		
		}
		
		
		// Define the class methods.
		DragDrop.prototype = {

			// I add a new agent to the container.
			addAgent: function(){
			
				// Create a new agent.
				var agent = new Agent(
					this.dom.stage,
					++this.agents.primaryKey
				);
				
				// Add the new agent to the collection.
				this.agents.push( agent );
				
				// Listen for drag events on the agent.
				agent.events.dragStarted.bind( this.handleAgentDragStarted, this );
				agent.events.dragStopped.bind( this.handleAgentDragStopped, this );
			
				// Attach the agent to the container.
				agent.attachContainer( this.dom.container );
			
				// Return the new agent.
				return( agent );
				
			},
			
			
			// I add a new bucket to the container.
			addBucket: function(){
				
				// Create a new bucket.
				var bucket = new Bucket();
				
				// Add the new bucket to the collection.
				this.buckets.push( bucket );
				
				// Listen for dropped and popped events on the bucket.
				bucket.events.dropped.bind( this.handleBucketDropped, this );
				bucket.events.popped.bind( this.handleBucketPopped, this );
				
				// Attach the bucket to the primary container.
				bucket.attachContainer( this.dom.container );

			},
			
			
			// I handle drag-start events on a given agent.
			handleAgentDragStarted: function( event ){
				
				// Get the agent that triggered the event.
				var agent = event.context;
				
				// Tell all buckets to start watching this agent.
				for (var i = 0 ; i < this.buckets.length ; i++){

					// Start tracking agent.
					this.buckets[ i ].startTracking( agent );
				
				}

			},
			
			
			// I handle drag-stop events on a given agent.
			handleAgentDragStopped: function( event ){
				
				// Get the agent that triggered the event.
				var agent = event.context;
				
				// Tell all buckets to stop watching this agent.
				for (var i = 0 ; i < this.buckets.length ; i++){

					// Stop tracking agent.
					this.buckets[ i ].stopTracking( agent );
				
				}
				
			},
			
			
			// I handle dropped events on a given bucket.
			handleBucketDropped: function( event, agent ){
				
				// Get the bucket that triggered the event.
				var bucket = event.context;
				
				// Detach the agent from the primary container.
				agent.detachContainer();
				
				// Add the item to the given bucket.
				bucket.pushItem( agent );
				
				// Add a new agent ... for funzies.
				if (this.agents.primaryKey < 6){
				
					this.addAgent();
					
				}
					
			},
			
			
			// I handle popped events on a given bucket.
			handleBucketPopped: function( event, agent ){
				
				// Re-attach this agent to the primary container.
				agent.attachContainer( this.dom.container );

			}
			
		};
		
	
		// -------------------------------------------------- //
		// -------------------------------------------------- //
		
		
		// Return the dragdrop constructor.
		return( DragDrop );
		

	}
);



