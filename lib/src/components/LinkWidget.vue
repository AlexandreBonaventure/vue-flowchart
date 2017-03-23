<script>

  import { merge } from 'lodash-es'

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
            key: `point-${ this.link.points[pointIndex].id }`,
          },
          [
            h(
              'circle',
              {
        				class: 'point pointui',
                attrs: {
                  cx: this.getPoint(pointIndex).x,
                  cy: this.getPoint(pointIndex).y,
                  r: 5,
                },
        			}
            ),
      			h(
              'circle',
              {
        				class: 'point',
                attrs: {
                  'data-linkid': this.link.id,
                  'data-id': this.link.points[pointIndex].id,
                  cx: this.getPoint(pointIndex).x,
                  cy: this.getPoint(pointIndex).y,
                  r: 15,
                  opacity: 0,
                },
                on: {
                  mouseleave: () => {
                    this.setSelected(false)
                  },
                  mouseenter: () => {
                    this.setSelected(true)
                  },
                },
        			}
            )
          ]
    		)
    	},

    	generateLink: function(h, extraProps){
    		var Bottom = h('path', merge({
    			class: this.selected ? 'selected' : '',
          attrs: {
            'stroke-width': this.width,
            stroke: 'black',
          },
    		},extraProps))

    		var Top = h('path', merge({
          on: {
            mouseleave: () => {
              this.setSelected(false);
            },
            mouseenter: () => {
              this.setSelected(true);
            },
            contextmenu: (event) => {
      				event.preventDefault();
      				this.engine.removeLink(this.link)
      			},
          },
          attrs: {
            'stroke-opacity':0,
            'stroke-width': 20,
          },
    		},extraProps))

    		return h(
          'g',
          { key: `link-${extraProps.id}` },
          [
            Bottom,
            Top
          ]
    		)
    	},
    },
    render(h) {
      var points = this.link.points
  		var paths = []
  		if(points.length === 2) {
  			var margin = 50
  			if (Math.abs(this.getPoint(0).x-this.getPoint(1).x) < 50){
  				margin = 5
  			}

  			paths.push(this.generateLink(h, {
          attrs: {
            id: '0',
            d: ` M${this.getPoint(0).x} ${this.getPoint(0).y} C${this.getPoint(0).x + margin} ${this.getPoint(0).y} ${this.getPoint(1).x-margin} ${this.getPoint(1).y} ${this.getPoint(1).x} ${this.getPoint(1).y}`,
          },
          on: {
            mousedown: (event) => {
    					var point = this.engine.getRelativeMousePoint(event);
    					point.id = this.engine.UID();
    					this.link.points.splice(1,0,point);
    					// this.forceUpdate();
    					this.newPoint(point.id);
    				},
          },
  			}))
  			if (this.link.target === null) {
  				paths.push(this.generatePoint(h, 1))
  			}
  		}else{
  			var ds = [];
  			if(this.smooth){
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

  			paths = ds.map((data,index) => {
  				return this.generateLink(h, {
            attrs: {
              id:index,
    					'data-link': this.link.id,
    					'data-point': index,
              d: data,
            },
  					on: {
              mousedown: (event) => {
                var point = this.engine.getRelativeMousePoint(event)
                point.id = this.engine.UID()
                this.link.points.splice(index+1,0,point)
                this.newPoint(point.id)
              },
            },
  				})
  			})


  			//render the circles
  			for(var i = 1;i < points.length-1;i++){
  				paths.push(this.generatePoint(h, i))
  			}

  			if (this.link.target === null) {
  				paths.push(this.generatePoint(h, points.length-1))
  			}
  		}


  		return (
  			h('g', null,	paths)
  		)
    }
  }

</script>

<!--template lang="jade">
  g


</template-->

<style lang="scss">

</style>
