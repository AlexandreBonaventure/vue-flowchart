<script>

  import _ from 'lodash'

  import nodeView from './NodeViewWidget.vue'
  import svgWidget from './SVGWidget.vue'

  export default {
    name: "CanvasWidget",
    components: {
      nodeView,
      svgWidget,
    },
    props: {
			engine: {
        required: true,
      }
		},
    data() {
      return {
        selectedPointID: null,
        selectedLink: null,
        selectedModel: null,
        initialX: null,
        initialY: null,
        initialObjectX: null,
        initialObjectY: null,
        listenerID: null,

        newPoint(link, pointID) { //
          return this.$set({
						selectedPointID: pointID,
						selectedLink: link
					})
        },
      }
    },
    mounted() {
      this.engine.state.canvas = this.$refs.canvas
      // var listenerID = this.engine.registerListener(event => {
      //   if(event.type === 'repaint'){
      //     this.forceUpdate()
      //   }
      // })
      // this.listenerID = listenerID

      setTimeout(() => {
        //check for any links that dont have points
        _.forEach(this.engine.state.links, (link) => {
          if(link.points.length === 0){
            link.points.push(this.engine.getPortCenter(this.engine.getNode(link.source),link.sourcePort));
            link.points.push(this.engine.getPortCenter(this.engine.getNode(link.target),link.targetPort));
            // this.forceUpdate();
          }
        })
      },10)


      //add a keybaord listener
      // this.setState({
      //   windowListener: window.addEventListener('keydown', (event) => {
      //     if(event.keyCode === 46){
      //       if(this.props.engine.state.selectedLink){
      //         this.props.engine.removeLink(this.props.engine.state.selectedLink);
      //       }else if(this.props.engine.state.selectedNode){
      //         this.props.engine.removeNode(this.props.engine.state.selectedNode);
      //       }
      //     }
      //   })
      // })
      window.focus()
    },
    methods: {
      onWheel(event) {
        this.engine.setZoom(this.engine.state.zoom+(event.deltaY/60))
        this.engine.repaintNodes([])
      },
      onMouseMove(event) {

        // //move the node
        // if(this.state.selectedModel){
        //   this.state.selectedModel.x = this.state.initialObjectX+((event.pageX-this.state.initialX)/(this.props.engine.state.zoom/100));
        //   this.state.selectedModel.y = this.state.initialObjectY+((event.pageY-this.state.initialY)/(this.props.engine.state.zoom/100));
        //   this.props.engine.repaintNodes([this.state.selectedModel]);
        // }
        //
        // //move the point
        // else if(this.state.selectedPointID){
        //   var point = _.find(this.state.selectedLink.points,{id:this.state.selectedPointID});
        //   var rel = this.props.engine.getRelativeMousePoint(event);
        //   point.x = rel.x;
        //   point.y = rel.y;
        //   this.props.engine.repaintLinks([this.state.selectedLink]);
        // }
        //
        // //move the canvas
        // else if(this.state.initialObjectX !== null){
        //   this.props.engine.setOffset(
        //     this.state.initialObjectX+((event.pageX-this.state.initialX)/(this.props.engine.state.zoom/100)),
        //     this.state.initialObjectY+((event.pageY-this.state.initialY)/(this.props.engine.state.zoom/100))
        //   );
        //   this.props.engine.repaintNodes([]);
        // }

      },
      onMouseDown(event) {

        // this.props.engine.setSelectedNode(null);
        //
        // //look for a port
        // var element = event.target.closest('.port[data-name]');
        // if(element){
        //   var nodeElement = event.target.closest('.node[data-nodeid]');
        //   var rel = this.props.engine.getRelativeMousePoint(event);
        //   var id = this.props.engine.UID();
        //   var FinalLink = this.props.engine.addLink({
        //     source: nodeElement.dataset.nodeid,
        //     sourcePort: element.dataset.name,
        //     points:[{x:0,y:0},{x:rel.x,y:rel.y,id: id}]
        //   });
        //   this.setState({
        //     selectedPointID: id,
        //     selectedLink: FinalLink
        //   });
        //   return;
        // }
        //
        // //look for a point
        // element = event.target.closest('.point[data-id]');
        // if(element){
        //
        //   //chrome fix o_O
        //   if(element.dataset === undefined){
        //     element.dataset = {
        //       id:element.getAttribute('data-id'),
        //       linkid: element.getAttribute('data-linkid')
        //     };
        //   }
        //
        //   this.setState({
        //     selectedPointID: element.dataset.id,
        //     selectedLink: this.props.engine.getLink(element.dataset.linkid)
        //   });
        //   return;
        // }
        //
        // //look for an element
        // element = event.target.closest('.node[data-nodeid]');
        // if(element){
        //   var model = this.props.engine.getNode(element.dataset['nodeid']);
        //   this.props.engine.setSelectedNode(model);
        //   this.setState({
        //     selectedModel: model,
        //     initialX: event.pageX,
        //     initialY: event.pageY,
        //     initialObjectX: model.x,
        //     initialObjectY: model.y
        //   });
        //   return;
        // }
        //
        // //probably just the canvas
        // this.setState({
        //   initialX: event.pageX,
        //   initialY: event.pageY,
        //   initialObjectX: this.props.engine.state.offsetX,
        //   initialObjectY: this.props.engine.state.offsetY
        // });
      },
      onMouseUp(event){
        // if(this.state.selectedPointID){
        //   var element = event.target.closest('.port[data-name]');
        //   if(element){
        //     var nodeElement = event.target.closest('.node[data-nodeid]');
        //
        //     //cant add link to self
        //     if(this.state.selectedLink.source === nodeElement.dataset.nodeid){
        //       this.props.engine.removeLink(this.state.selectedLink);
        //     }
        //
        //     //do the merge
        //     else{
        //
        //       var nodeObject = this.props.engine.getNode(nodeElement.dataset.nodeid);
        //       var NodeFactory = this.props.engine.getNodeFactory(nodeObject.type);
        //
        //       //check if the port is allowed by using the factory
        //       if(NodeFactory.isPortAllowed(
        //         this.props.engine.getNode(this.state.selectedLink.source),
        //         this.state.selectedLink.sourcePort,
        //         nodeObject,element.dataset.name)){
        //
        //         this.state.selectedLink.target = nodeElement.dataset.nodeid;
        //         this.state.selectedLink.targetPort = element.dataset.name;
        //         this.props.engine.repaintNodes([nodeObject]);
        //       }
        //     }
        //   }
        // }
        //
        // this.setState({
        //   selectedLink: null,
        //   selectedPort: null,
        //   selectedPointID: null,
        //   selectedModel: null,
        //   initialX: null,
        //   initialY: null,
        //   initialObjectX: null,
        //   initialObjectY: null
        // });
      },
    },
  }

</script>

<template lang="jade">
  div.storm-flow-canvas(
    ref="canvas",
    @wheel="onWheel",
    @mousemove="onMouseMove",
    @mousedown="onMouseDown",
    @mouseup="onMouseUp"
    )
    svg-widget(:engine="engine", :new-point="newPoint")
    node-view(:engine="engine")


</template>

<style lang="scss">
.storm-flow-canvas{
position: relative;
flex-grow: 1;
width: 100%;
height: 100%;
display: flex;
cursor: move;
overflow: hidden;

svg{
  position: absolute;
  height: 100%;
  width: 100%;
  transform-origin: 0 0;
  overflow: visible;
}

.node-view{
  top:0;
  left:0;
  right:0;
  bottom:0;
  position: absolute;
  pointer-events: none;
  transform-origin: 0 0;
}

.node{
  position: absolute;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Chrome/Safari/Opera */
  user-select: none;
  cursor: move;
  pointer-events: all;

  &.selected{
    >* {
      border-color:rgb(0,192,255);
      box-shadow: 0 0 10px rgba(0,192,255,0.5);
    }
  }
}

@keyframes dash {
  from {
    stroke-dashoffset: 24;
  }
  to {
    stroke-dashoffset: 0;
  }
  }

path{
  fill:none;
  stroke:black;
  pointer-events:all;

  &.selected{
    stroke: rgb(0,192,255) !important;
    stroke-dasharray: 10,2;
    animation: dash 1s linear infinite;
  }
}

.port{
  width: 15px;
  height: 15px;
  background: rgba(white,0.1);
  &:hover,&.selected{
    background: rgb(192,255,0);
  }
}

.basic-node{
  background-color: rgb(30,30,30);
  border-radius: 5px;
  font-family:Arial;
  color: white;
  border: solid 2px black;
  overflow: hidden;
  font-size: 11px;
  box-shadow: 0 0 10px rgba(black,0.5);

  .title{
/*			background-image: linear-gradient(rgba(black,0.1),rgba(black,0.2));*/
    background: rgba(black,0.3);
    display: flex;
    white-space: nowrap;
    >*{
      align-self: center;
    }
    .fa{
      padding: 5px;
      opacity: 0.2;
      cursor: pointer;

      &:hover{
        opacity: 1.0;
      }
    }
    .name{
      flex-grow: 1;
      padding: 5px 5px;
    }
  }

  .ports{
    display: flex;
    background-image: linear-gradient(rgba(black,0.1),rgba(black,0.2));
    .in, .out{
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .in-port,.out-port{
      display: flex;
      margin-top: 1px;
      >*{
        align-self: center;
      }
      .name{
        padding: 0 5px;
      }
    }
    .out-port{
      justify-content: flex-end;
      .name{
        justify-content: flex-end;
        text-align: right;
      }
    }
  }
}
}
</style>
