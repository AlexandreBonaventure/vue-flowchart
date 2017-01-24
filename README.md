# vue-flowchart
This lib is under heavy development. It is not production-ready and API could change dramatically. Feel free to use it anyway.
# Usage
Soon

### Graph Data
```
{
  links:[
    {
      id :String,
      source :String, // a node ID
      sourcePort :String,
      target: node3,
      targetPort: 'in'
    },
    ...
  ],
  nodes: [
    {
      id :String,
      type: :String, // default: 'default'
      data: {
        name: "Caption",
        outVariables: ['out']
      },
      x :Number, // in px
      y :Number, // in px
    },
  ],
}
```

# Example


# TO-DO


# Contributions
are welcome :)
