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
      getPoint(index){
    		if(index === 0){
    			return this.link.points[index];
    		}
    		if(this.link.target !== null && index === this.link.points.length-1){
    			return this.link.points[index];
    		}
    		return {
    			x: this.link.points[index].x,
    			y: this.link.points[index].y
    		};
    	},

    	setSelected(selected){
    		this.selected = selected
    		if(selected){
    			this.engine.setSelectedLink(selected ? this.link : null);
    		}
    	},

    	generatePoint: function(h, pointIndex){
    		return h(
          'g',
          {
            key: `point-${ this.link.points[pointIndex].id }`
          },
    			h(
            'circle',
            {
      				className:'point pointui',
      				cx:this.getPoint(pointIndex).x,
      				cy:this.getPoint(pointIndex).y,
      				r:5,
      			}
          ),
    			(
            'circle',
            {
      				className:'point',
      				'data-linkid':this.props.link.id,
      				'data-id':this.props.link.points[pointIndex].id,
      				cx:this.getPoint(pointIndex).x,
      				cy:this.getPoint(pointIndex).y,
      				r:15,
      				opacity: 0,
      				onMouseLeave: () => {
      					this.setSelected(false)
      				},
      				onMouseEnter: () => {
      					this.setSelected(true)
      				},
    			})
    		);
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
    render(h) {
      var points = this.link.points
  		points.forEach((point) => {
  			if(point.id === undefined) {
  				point.id = this.engine.UID()
  			}
  		})
  		var paths = []
  		if(points.length === 2) {
  			var margin = 50
  			if (Math.abs(this.getPoint(0).x-this.getPoint(1).x) < 50){
  				margin = 5
  			}

  			paths.push(this.generateLink({
  				id: '0',
  				onMouseDown: function(event){
  					var point = this.props.engine.getRelativeMousePoint(event);
  					point.id = this.props.engine.UID();
  					this.props.link.points.splice(1,0,point);
  					this.forceUpdate();
  					this.props.newPoint(point.id);
  				}.bind(this),
  				d:
  					 " M"+this.getPoint(0).x+" "+this.getPoint(0).y
  					+" C"+(this.getPoint(0).x+margin)+" "+this.getPoint(0).y
  					+" " +(this.getPoint(1).x-margin)+" "+this.getPoint(1).y
  					+" " +this.getPoint(1).x+" "+this.getPoint(1).y
  			}));
  			if(this.props.link.target === null){
  				paths.push(this.generatePoint(1));
  			}
  		}else{
  			var ds = [];
  			if(this.props.smooth){
  				ds.push(" M"+this.getPoint(0).x+" "+this.getPoint(0).y+" C "+(this.getPoint(0).x+50)+" "+this.getPoint(0).y+" "+this.getPoint(1).x+" "+this.getPoint(1).y+" "+this.getPoint(1).x+" "+this.getPoint(1).y);
  				for(var i = 1;i < points.length-2;i++){
  					ds.push(" M "+this.getPoint(i).x+" "+this.getPoint(i).y+" L "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
  				}
  				ds.push(" M"+this.getPoint(i).x+" "+this.getPoint(i).y+" C "+this.getPoint(i).x+" "+this.getPoint(i).y+" "+(this.getPoint(i+1).x-50)+" "+this.getPoint(i+1).y+" "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
  			}else{
  				var ds = [];
  				for(var i = 0;i < points.length-1;i++){
  					ds.push(" M "+this.getPoint(i).x+" "+this.getPoint(i).y+" L "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
  				}
  			}

  			paths = ds.map(function(data,index){
  				return this.generateLink({
  					id:index,
  					'data-link':this.props.link.id,
  					'data-point':index,
  					onMouseDown: function(event){
  						var point = this.props.engine.getRelativeMousePoint(event);
  						point.id = this.props.engine.UID();
  						this.props.link.points.splice(index+1,0,point);
  						this.forceUpdate();
  						this.props.newPoint(point.id);
  					}.bind(this),
  					d:data
  				});
  			}.bind(this));


  			//render the circles
  			for(var i = 1;i < points.length-1;i++){
  				paths.push(this.generatePoint(i));
  			}

  			if(this.props.link.target === null){
  				paths.push(this.generatePoint(points.length-1));
  			}
  		}


  		return (
  			React.DOM.g(null,	paths)
  		)
    }
  }

</script>

<template lang="jade">
  g


</template>

<style lang="css">

</style>
