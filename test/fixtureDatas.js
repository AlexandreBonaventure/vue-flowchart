import EngineCore from '../lib/src/Engine.js'

const Engine = EngineCore()

export default function factory() {
  const model = {links:[],nodes: []};

  generateSet(model,0,0);
  // generateSet(model,800,0);
  // generateSet(model,1600,0);
  // generateSet(model,2400,0);
  //
  // generateSet(model,0,300);
  // generateSet(model,800,300);
  // generateSet(model,1600,300);
  // generateSet(model,2400,300);
  //
  // generateSet(model,0,600);
  // generateSet(model,800,600);
  // generateSet(model,1600,600);
  // generateSet(model,2400,600);
  //
  // generateSet(model,0,900);
  // generateSet(model,800,900);
  // generateSet(model,1600,900);
  // generateSet(model,2400,900);

  return model


  function generateSet(model,offsetX,offsetY) {
    var node1 = Engine.UID();
    var node2 = Engine.UID();
    var node3 = Engine.UID();
    var node4 = Engine.UID();
    var node5 = Engine.UID();


    model.links = model.links.concat([
      {
        id: Engine.UID(),
        source: node1,
        sourcePort: 'inout',
        target: node2,
        targetPort: 'in',
      },
      {
        id: Engine.UID(),
        source: node1,
        sourcePort: 'inout',
        target: node3,
        targetPort: 'in'
      },
      {
        id: Engine.UID(),
        source: node2,
        sourcePort: 'out',
        target: node4,
        targetPort: 'in'
      },
      {
        id: Engine.UID(),
        source: node4,
        sourcePort: 'out',
        target: node5,
        targetPort: 'default'
      },
      {
        id: Engine.UID(),
        source: node2,
        sourcePort: 'out',
        target: node5,
        targetPort: 'default'
      }
    ]);

    model.nodes = model.nodes.concat([
    {
        id:node1,
        type: 'custom',
        data: {
          name: "I'm custom",
          inOutVariables: ['inout']
        },
        x: Math.random(50) * 10 + offsetX,
        y: Math.random(50) * 10 + offsetY
      },
      {
        id:node2,
        type: 'default',
        data: {
          name: "Add Card to User",
          inPorts: ['in','in 2'],
          outPorts: ['out']
        },
        x:250 +offsetX,
        y:50 + offsetY
      },
      {
        id:node3,
        type: 'default',
        data: {
          color: 'rgb(0,192,255)',
          name: "Remove User",
          inPorts: ['in']
        },
        x:250 + offsetX,
        y:150 + offsetY
      },
      {
        id:node4,
        type: 'default',
        data: {
          color: 'rgb(0,192,255)',
          name: "Remove User",
          inPorts: ['in'],
          outPorts: ['out']
        },
        x:500 + offsetX,
        y:150 + offsetY
      },
      {
        id:node5,
        type: 'default',
        data: {
          color: 'rgb(192,255,0)',
          name: "Complex Action 2",
          // port: ['in','in2','in3']
        },
        x:800 + offsetX,
        y:100 + offsetY
      },
    ]);
  }

}
