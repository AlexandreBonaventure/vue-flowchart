<script>

  // import { map } from 'lodash'

  export default {
    name: "LinkWidget",
    props: {
      width: { default: 3 },
			link: {},
			engine: {
        required: true,
      },
			smooth: { default: false },
			newPoint: { default: (id) => {} }
		},
    data() {
      return {
        selected: false,
      }
    },
    methods: {
      getPoint: function(index){
    		// if(index === 0){
    		// 	return this.props.link.points[index];
    		// }
    		// if(this.props.link.target !== null && index === this.props.link.points.length-1){
    		// 	return this.props.link.points[index];
    		// }
    		// return {
    		// 	x: this.props.link.points[index].x,
    		// 	y: this.props.link.points[index].y
    		// };
    	},

    	setSelected: function(selected){
    		// this.setState({selected: selected});
    		// if(selected){
    		// 	this.props.engine.setSelectedLink(selected?this.props.link:null);
    		// }
    	},

    	generatePoint: function(pointIndex){
    		// return React.DOM.g({key:'point-'+this.props.link.points[pointIndex].id},
    		// 	React.DOM.circle({
    		// 		className:'point pointui',
    		// 		cx:this.getPoint(pointIndex).x,
    		// 		cy:this.getPoint(pointIndex).y,
    		// 		r:5,
    		// 	}),
    		// 	React.DOM.circle({
    		// 		className:'point',
    		// 		'data-linkid':this.props.link.id,
    		// 		'data-id':this.props.link.points[pointIndex].id,
    		// 		cx:this.getPoint(pointIndex).x,
    		// 		cy:this.getPoint(pointIndex).y,
    		// 		r:15,
    		// 		opacity: 0,
    		// 		onMouseLeave: function(){
    		// 			this.setSelected(false);
    		// 		}.bind(this),
    		// 		onMouseEnter: function(){
    		// 			this.setSelected(true);
    		// 		}.bind(this)
    		// 	})
    		// );
    	},

    	generateLink: function(extraProps){
    		// var Bottom = React.DOM.path(_.merge({
    		// 	className:this.state.selected?'selected':'',
    		// 	strokeWidth:this.props.width,
    		// 	stroke:'black'
    		// },extraProps));
    		//
    		// var Top = React.DOM.path(_.merge({
    		// 	onMouseLeave: function(){
    		// 		this.setSelected(false);
    		// 	}.bind(this),
    		// 	onMouseEnter: function(){
    		// 		this.setSelected(true);
    		// 	}.bind(this),
    		// 	strokeOpacity:0,
    		// 	strokeWidth: 20,
    		// 	onContextMenu: function(event){
    		// 		event.preventDefault();
    		// 		this.props.engine.removeLink(this.props.link);
    		// 	}.bind(this),
    		// },extraProps));
    		//
    		// return React.DOM.g({key:'link-'+extraProps.id},
    		// 	Bottom,
    		// 	Top
    		// );
    	},
    },
    computed: {
      
    },
  }

</script>

<template lang="jade">
  g


</template>

<style lang="css">

</style>
