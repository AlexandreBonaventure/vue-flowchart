/* eslint-disable */

var React = require("react");
var SVGWidget = require("./SVGWidget");
var NodeView = require("./NodeViewWidget");
var _ = require("lodash");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "CanvasWidget",
	getInitialState: function () {
		return {
			selectedPointID: null,
			selectedLink: null,
			selectedModel: null,
			initialX: null,
			initialY: null,
			initialObjectX: null,
			initialObjectY: null,
			listenerID: null
		};
	},

	getDefaultProps: function () {
		return {
			engine: null
		};
	},

	componentWillUnmount: function(){
		this.props.engine.removeListener(this.state.listenerID);
		window.removeEventListener('keydown',this.state.windowListener);
	},

	componentDidMount: function(){
		this.props.engine.state.canvas = this.refs.canvas;
		var listenerID = this.props.engine.registerListener(function(event){
			if(event.type === 'repaint'){
				this.forceUpdate();
			}
		}.bind(this));
		this.setState({listenerID: listenerID});

		setTimeout(function(){
			//check for any links that dont have points
			_.forEach(this.props.engine.state.links,function(link){
				if(link.points.length === 0){
					link.points.push(this.props.engine.getPortCenter(this.props.engine.getNode(link.source),link.sourcePort));
					link.points.push(this.props.engine.getPortCenter(this.props.engine.getNode(link.target),link.targetPort));
					this.forceUpdate();
				}
			}.bind(this));
		}.bind(this),10);


		//add a keybaord listener
		this.setState({
			windowListener: window.addEventListener('keydown',function(event){
				if(event.keyCode === 46){

					if(this.props.engine.state.selectedLink){
						this.props.engine.removeLink(this.props.engine.state.selectedLink);
					}else if(this.props.engine.state.selectedNode){
						this.props.engine.removeNode(this.props.engine.state.selectedNode);
					}
				}
			}.bind(this))
		});
		window.focus();
	},
	render: function () {
		return (
			React.DOM.div({
					ref:'canvas',
					className:'storm-flow-canvas',
					onWheel: function(event){
						this.props.engine.setZoom(this.props.engine.state.zoom+(event.deltaY/60));
						this.props.engine.repaintNodes([]);
					}.bind(this),
					onMouseMove: function(event){

						//move the node
						if(this.state.selectedModel){
							this.state.selectedModel.x = this.state.initialObjectX+((event.pageX-this.state.initialX)/(this.props.engine.state.zoom/100));
							this.state.selectedModel.y = this.state.initialObjectY+((event.pageY-this.state.initialY)/(this.props.engine.state.zoom/100));
							this.props.engine.repaintNodes([this.state.selectedModel]);
						}

						//move the point
						else if(this.state.selectedPointID){
							var point = _.find(this.state.selectedLink.points,{id:this.state.selectedPointID});
							var rel = this.props.engine.getRelativeMousePoint(event);
							point.x = rel.x;
							point.y = rel.y;
							this.props.engine.repaintLinks([this.state.selectedLink]);
						}

						//move the canvas
						else if(this.state.initialObjectX !== null){
							this.props.engine.setOffset(
								this.state.initialObjectX+((event.pageX-this.state.initialX)/(this.props.engine.state.zoom/100)),
								this.state.initialObjectY+((event.pageY-this.state.initialY)/(this.props.engine.state.zoom/100))
							);
							this.props.engine.repaintNodes([]);
						}

					}.bind(this),
					onMouseDown: function(event){

						this.props.engine.setSelectedNode(null);

						//look for a port
						var element = event.target.closest('.port[data-name]');
						if(element){
							var nodeElement = event.target.closest('.node[data-nodeid]');
							var rel = this.props.engine.getRelativeMousePoint(event);
							var id = this.props.engine.UID();
							var FinalLink = this.props.engine.addLink({
								source: nodeElement.dataset.nodeid,
								sourcePort: element.dataset.name,
								points:[{x:0,y:0},{x:rel.x,y:rel.y,id: id}]
							});
							this.setState({
								selectedPointID: id,
								selectedLink: FinalLink
							});
							return;
						}

						//look for a point
						element = event.target.closest('.point[data-id]');
						if(element){

							//chrome fix o_O
							if(element.dataset === undefined){
								element.dataset = {
									id:element.getAttribute('data-id'),
									linkid: element.getAttribute('data-linkid')
								};
							}

							this.setState({
								selectedPointID: element.dataset.id,
								selectedLink: this.props.engine.getLink(element.dataset.linkid)
							});
							return;
						}

						//look for an element
						element = event.target.closest('.node[data-nodeid]');
						if(element){
							var model = this.props.engine.getNode(element.dataset['nodeid']);
							this.props.engine.setSelectedNode(model);
							this.setState({
								selectedModel: model,
								initialX: event.pageX,
								initialY: event.pageY,
								initialObjectX: model.x,
								initialObjectY: model.y
							});
							return;
						}

						//probably just the canvas
						this.setState({
							initialX: event.pageX,
							initialY: event.pageY,
							initialObjectX: this.props.engine.state.offsetX,
							initialObjectY: this.props.engine.state.offsetY
						});
					}.bind(this),
					onMouseUp: function(event){
						if(this.state.selectedPointID){
							var element = event.target.closest('.port[data-name]');
							if(element){
								var nodeElement = event.target.closest('.node[data-nodeid]');

								//cant add link to self
								if(this.state.selectedLink.source === nodeElement.dataset.nodeid){
									this.props.engine.removeLink(this.state.selectedLink);
								}

								//do the merge
								else{

									var nodeObject = this.props.engine.getNode(nodeElement.dataset.nodeid);
									var NodeFactory = this.props.engine.getNodeFactory(nodeObject.type);

									//check if the port is allowed by using the factory
									if(NodeFactory.isPortAllowed(
										this.props.engine.getNode(this.state.selectedLink.source),
										this.state.selectedLink.sourcePort,
										nodeObject,element.dataset.name)){

										this.state.selectedLink.target = nodeElement.dataset.nodeid;
										this.state.selectedLink.targetPort = element.dataset.name;
										this.props.engine.repaintNodes([nodeObject]);
									}
								}
							}
						}

						this.setState({
							selectedLink: null,
							selectedPort: null,
							selectedPointID: null,
							selectedModel: null,
							initialX: null,
							initialY: null,
							initialObjectX: null,
							initialObjectY: null
						});
					}.bind(this),
				},
				React.createElement(SVGWidget,{newPoint: function(link,pointID){
					this.setState({
						selectedPointID: pointID,
						selectedLink: link
					});;
				}.bind(this),engine: this.props.engine}),
				React.createElement(NodeView,{engine: this.props.engine})
			)
		);
	}
});
