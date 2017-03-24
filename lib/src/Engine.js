import { defaults, filter, values, forEach, flatMap, find, mapValues } from 'lodash-es'
import Vue from 'vue'
/**
 * @author Dylan Vorster
 */

const validatorNoop = (node) => { return Promise.resolve(true) }

export default function() {
	return {
		state:{
			links:{},
			nodes:{},
			factories: {},
			canvas: null,
			offsetX:0,
			offsetY:0,
			zoom: 100,
			listeners:{},
			selectedLink: null,
			selectedNode: null,

			updatingNodes: null,
			updatingLinks: null,
      validators: {
        onNodeRemove: validatorNoop,
        onEdgeRemove: validatorNoop,
        onEdgeUpdate: validatorNoop,
      },
		},

		repaintLinks: function(links){
      Vue.set(this.state, 'updatingNodes', {});
      Vue.set(this.state, 'updatingLinks', {});
			links.forEach((link) => {
				Vue.set(this.state.updatingLinks, link.id, link);
			})
			this.update()
		},

		repaintNodes: function(nodes){
			// this.state.updatingNodes = {};
			// this.state.updatingLinks = {};
      Vue.set(this.state, 'updatingNodes', {});
      Vue.set(this.state, 'updatingLinks', {});

			//store the updating node is's
			nodes.forEach((node) => {
				Vue.set(this.state.updatingNodes, node.id, node);
				this.getNodeLinks(node).forEach((link) => {
          Vue.set(this.state.updatingLinks, link.id, link)
          if(link.points.length < 2) {
						return;
					}else{
						if(link.source !== null) {
							Vue.set(link.points, 0, this.getPortCenter(this.getNode(link.source),link.sourcePort))
						}
						if(link.target !== null) {
							Vue.set(link.points, link.points.length-1, this.getPortCenter(this.getNode(link.target),link.targetPort))
						}
					}
				})
			})

			this.update();
		},

		update: function(){
			this.fireEvent({type:'repaint'});
		},

		getNodeDimensions(){
			const nodes = this.state.nodes
			const dimensions = mapValues(nodes, (node, id) => {
				const el = this.getNodeElement(id)
				const { width, height } = el.getBoundingClientRect()
				return { width, height }
			})
			return dimensions
		},

		getRelativeMousePoint: function(event){
			var point = this.getRelativePoint(event.pageX,event.pageY);
			return {
				x:(point.x/(this.state.zoom/100.0))-this.state.offsetX,
				y:(point.y/(this.state.zoom/100.0))-this.state.offsetY
			};
		},

		getRelativePoint: function(x,y){
			var canvasRect = this.state.canvas.getBoundingClientRect();
			return {x: x-canvasRect.left,y:y-canvasRect.top};
		},

		fireEvent: function(event){
			forEach(this.state.listeners,function(listener){
				listener(event);
			});
		},

		removeListener: function(id){
			Vue.delete(this.state.listeners, id)
		},

		removeAllListeners: function(id){
			this.state.listeners = {}
		},

		registerListener: function(cb){
			var id = this.UID();
			this.state.listeners[id] = cb;
			return id;
		},

		setZoom: function(zoom){
			this.state.zoom = zoom;
			this.update();
		},

		setOffset: function(x,y){
			this.state.offsetX = x;
			this.state.offsetY = y;
			this.update();
		},

		loadModel: function(model){
			this.state.links = {};
			this.state.nodes = {};

			model.nodes.forEach(function(node){
				this.addNode(node);
			}.bind(this));

			model.links.forEach(function(link){
				this.addLink(link);
			}.bind(this));
		},

		generateLinkPoints(){
      forEach(this.state.links, (link) => {
        if(link.points.length === 0){
          link.points.push({
						...this.getPortCenter(this.getNode(link.source),link.sourcePort),
						id: this.UID()
					});
          link.points.push({
						...this.getPortCenter(this.getNode(link.target),link.targetPort),
						id: this.UID()
					});
        }
      })
		},



		updateNode: function(node){

			//find the links and move those as well
			this.getNodeLinks(node);
			this.fireEvent({type:'repaint'});
		},

		UID: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},

		getNodeElement: function(id){
			return this.state.canvas.querySelector(`.node[data-nodeid="${id}"]`);
		},
		getNodePortElement: function(node,port){
			return this.state.canvas.querySelector('.port[data-name="'+port+'"][data-nodeid="'+node.id+'"]');
		},

		getNodePortLinks: function(node,port){
			var nodeID = this.getNodeID(node);
			var links = this.getNodeLinks(nodeID);
			return links.filter(function(link){
				if(link.target === nodeID && link.targetPort === port){
					return true;
				}
				else if(link.source === nodeID && link.sourcePort === port){
					return true;
				}
				return false;
			});
		},

		getNodeID: function(node){
			if(typeof node === 'object'){
				node = node.id;
			}
			return node;
		},

		getNodeLinks: function(node){
			var nodeID = this.getNodeID(node);
			return values(filter(this.state.links,function(link,index){
				return link.source == nodeID || link.target == nodeID;
			}));
		},

		removeLink(link, bypassValidation = false) {
      if (typeof link !== 'object') link = this.getLink(link)
      const validator$ = bypassValidation ? validatorNoop() : this.state.validators.onEdgeRemove(link)
      validator$.then(valid => {
        if (valid) {
          Vue.delete(this.state.links, link.id)
          this.update();
          this.fireEvent({
            type:'link:remove',
            data: link
          })
        }
      })

		},

		removeNode(node, bypassValidation = false){
      if (typeof node !== 'object') node = this.getNode(node)
      const validator$ = bypassValidation ? validatorNoop() : this.state.validators.onNodeRemove(node)
      validator$.then(valid => {
        if (valid) {
          //remove the links
    			var links = this.getNodeLinks(node)
    			links.forEach((link) => {
    				this.removeLink(link, true)
    			})

    			//remove the node
          Vue.delete(this.state.nodes, node.id)
    			// this.update()
    			this.fireEvent({
    				type:'node:remove',
    				data: node
    			})
        }
      })
		},

		getPortCenter: function(node,port){
			var sourceElement = this.getNodePortElement(node,port);
			var sourceRect = sourceElement.getBoundingClientRect();

			var rel = this.getRelativePoint(sourceRect.left,sourceRect.top);

			return {
				x: ((sourceElement.offsetWidth/2)+rel.x/(this.state.zoom/100.0)) -(this.state.offsetX),
				y: ((sourceElement.offsetHeight/2)+rel.y/(this.state.zoom/100.0)) -(this.state.offsetY)
			};
		},

		setSelectedNode: function(node){
			// this.state.selectedLink = null;
			this.state.selectedNode = node;
			if (node) {
				this.fireEvent({
	        type:'node:select',
	        data: node
	      })
			}

			// this.state.updatingNodes =  null;
			// this.state.updatingLinks = null;
			this.update();
		},

		setSelectedLink: function(link){
			// this.state.selectedNode = null;
			this.state.selectedLink = link;
      this.fireEvent({
				type:'link:select',
				data: link
			})
			// this.state.updatingNodes = null;
			// this.state.updatingLinks = null;
			this.update();
		},

		addLink: function(link){
			var FinalLink = link = {
				id: this.UID(),
				source: null,
				sourcePort: null,
				target: null,
				targetPort: null,
				points: [],
        ...link,
			}

			Vue.set(this.state.links, FinalLink.id, FinalLink)
			this.fireEvent({
				type:'link:add',
				data: FinalLink
			})
			return FinalLink;
		},

		addNode: function(node,event){
			var point = {x:0,y:0};
			if(event !== undefined){
				point = this.getRelativeMousePoint(event);
			}

			var FinalNode = defaults(node,{
				id: this.UID(),
				type: 'default',
				data:{},
				x: point.x,
				y: point.y
			});
			Vue.set(this.state.nodes, FinalNode.id, FinalNode)
			this.fireEvent({
				type:'node:add',
				data: FinalNode,
			})

		},

		getLink: function(id){
			return this.state.links[id];
		},

		getPoint: function(id){
      const allPoints = flatMap(this.state.links, ({ points }) => points)
			const point = find(allPoints, { id });
      console.log(point);
      return point
		},

		getNode: function(id){
			return this.state.nodes[id];
		},

		getNodeFactory: function(type){
			if(this.state.factories[type] === undefined){
				throw "Cannot find node factory for: "+type;
			}
			return this.state.factories[type];
		},

		registerNodeFactory: function(factory){
			var FinalModel = defaults(factory,{
				type: "factory",
				isPortAllowed: function(sourceNode,sourceport,targetNode,targetPort){
					return true;
				},
				generateModel: function(model,engine){
					return null;
				}
			});
			this.state.factories[FinalModel.type] = FinalModel;
		},

		registerValidators: function(validators){
			this.state.validators = defaults(
        validators,
        this.state.validators
      )
		}
	};
};
