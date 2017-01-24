<script>

  import { forEach, find } from 'lodash-es'

  import nodeView from './NodeViewWidget.vue'
  import svgWidget from './SVGWidget.vue'

  import setState from '../../mixins/setState.js'

  export default {
    name: "CanvasWidget",
    mixins: [setState],
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
        selectedPort: null,
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


      //check for any links that dont have points
      // forEach(this.engine.state.links, (link) => {
      //   if(link.points.length === 0){
      //     link.points.push(this.engine.getPortCenter(this.engine.getNode(link.source),link.sourcePort));
      //     link.points.push(this.engine.getPortCenter(this.engine.getNode(link.target),link.targetPort));
      //     // this.forceUpdate();
      //   }
      // })


      //add a keybaord listener
      this.windowListener = window.addEventListener('keydown', (event) => {
        if(event.keyCode === 46){
          if(this.engine.state.selectedLink){
            this.engine.removeLink(this.engine.state.selectedLink)
          } else if(this.engine.state.selectedNode) {
            this.engine.removeNode(this.engine.state.selectedNode)
          }
        }
      })
      window.focus()
    },
    methods: {
      resetState() {
        this.setState({
          selectedLink: null,
          selectedPort: null,
          selectedPointID: null,
          selectedModel: null,
          initialX: null,
          initialY: null,
          initialObjectX: null,
          initialObjectY: null
        })
      },
      onWheel(event) {
        this.engine.setZoom(this.engine.state.zoom+(event.deltaY/60))
        this.engine.repaintNodes([])
      },
      onMouseMove(event) {

        //move the node
        if(this.selectedModel){
          this.selectedModel.x = this.initialObjectX+((event.pageX-this.initialX)/(this.engine.state.zoom/100));
          this.selectedModel.y = this.initialObjectY+((event.pageY-this.initialY)/(this.engine.state.zoom/100));
          this.engine.repaintNodes([this.selectedModel]);
        }

        //move the point
        else if(this.selectedPointID){
          var point = find(this.selectedLink.points,{id:this.selectedPointID});
          var rel = this.engine.getRelativeMousePoint(event);
          point.x = rel.x;
          point.y = rel.y;
          this.engine.repaintLinks([this.selectedLink]);
        }

        //move the canvas
        else if(this.initialObjectX !== null){
          this.engine.setOffset(
            this.initialObjectX+((event.pageX-this.initialX)/(this.engine.state.zoom/100)),
            this.initialObjectY+((event.pageY-this.initialY)/(this.engine.state.zoom/100))
          );
          this.engine.repaintNodes([]);
        }

      },
      onMouseDown(event) {

        this.engine.setSelectedNode(null);

        //look for a port
        var element = event.target.closest('.port[data-name]');
        if(element){
          var nodeElement = event.target.closest('.node[data-nodeid]');
          var node = this.engine.getNode(nodeElement.getAttribute('data-nodeid'))
          var port = element.getAttribute('data-name')
          var rel = this.engine.getRelativeMousePoint(event);
          var id = this.engine.UID();

          const x = this.engine.getPortCenter(node, port).x
          const y = this.engine.getPortCenter(node, port).y
          var FinalLink = this.engine.addLink({
            source: nodeElement.dataset.nodeid,
            sourcePort: element.dataset.name,
            points:[{ x, y },{ x:rel.x, y:rel.y, id }]
          });
          this.selectedPointID = id
          this.selectedLink = FinalLink
          return;
        }

        //look for a point
        element = event.target.closest('.point[data-id]');
        if(element){
          const id = element.getAttribute('data-id')
          //chrome fix o_O
          if(element.dataset === undefined){
            element.dataset = {
              id,
              linkid: element.getAttribute('data-linkid')
            };
          }
          const point = this.engine.getPoint(id)
          this.setState({
            initialX: event.pageX,
            initialY: event.pageY,
            initialObjectX: point.x,
            initialObjectY: point.y,
          })
          this.selectedPointID = element.dataset.id
          this.selectedLink = this.engine.getLink(element.dataset.linkid)
          return
        }

        //look for an element
        element = event.target.closest('.node[data-nodeid]');
        if(element){
          var model = this.engine.getNode(element.dataset['nodeid']);
          this.engine.setSelectedNode(model);
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
          initialObjectX: this.engine.state.offsetX,
          initialObjectY: this.engine.state.offsetY
        });
      },
      onMouseUp(event){
        if(!this.selectedPointID) this.resetState()
        if(this.selectedPointID){
          const point = this.engine.getPoint(this.selectedPointID)
          var element = event.target.closest('.port[data-name]');
          if(!element) this.resetState()
          if(element){
            var nodeElement = event.target.closest('.node[data-nodeid]');

            //cant add link to self
            if(this.selectedLink.source === nodeElement.dataset.nodeid){
              this.engine.removeLink(this.selectedLink);
            }

            //do the merge
            else{

              var nodeObject = this.engine.getNode(nodeElement.dataset.nodeid);
              var NodeFactory = this.engine.getNodeFactory(nodeObject.type);

              //check if the port is allowed by using the factory
              const isPortAllowed = NodeFactory.isPortAllowed(
                this.engine.getNode(this.selectedLink.source),
                this.selectedLink.sourcePort,
                nodeObject,element.dataset.name)

              if (!isPortAllowed) this.resetState()
              if (isPortAllowed) {

                this.engine.state.validators.onEdgeUpdate(this.selectedLink)
                  .then((valid) => {
                    if (valid) {
                      this.selectedLink.target = nodeElement.dataset.nodeid;
                      this.selectedLink.targetPort = element.dataset.name;
                      this.engine.repaintNodes([nodeObject]);

                      this.engine.fireEvent({
                        type:'link:update',
                        data: this.selectedLink,
                      })
                    } else {
                      //revert position
                      point.x = this.initialObjectX || point.x + 100
                      point.y = this.initialObjectY || point.y + 100
                      console.log(point);
                    }
                    this.resetState()
                  })
              }
            }
          }
        }
      },
    },
  }

</script>

<template>
  <div class="storm-flow-canvas" ref="canvas"
    @wheel="onWheel"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp">
    <svg-widget :engine="engine" :new-point="newPoint"></svg-widget>
    <node-view :engine="engine"></node-view>
  </div>



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
