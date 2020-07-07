# Data Structure

## names
- **trail** : the whole trail
- **station** : a page accessible via a QR-code, corresponding to its physical location
- **hint** : any elementary indication given in a station

____

## trail

```
{
  nodes: Object,
  endNodes: Array,
  name: String,
  editor: String
}
```

> The trail will be displayed as a graph.
> Stations lead to hints which can be combined and lead to stations.

### nodes

```
nodes: {
  <nodeId>: {
    dependancies: [
      <nodeId>,
      <nodeId>,
      <...>
    ],
    type: <nodeType>,
    name: <nodeName>
  }
}
```

- `dependancies` is the list of all the nodes leading to the current node
- `type` is the type of the node. It can be:
  - `'station'`: is a station
  - `'hint'`: is a hint given in one or more stations
  - `'and'`: is a node combining dependancies where all are required
  - `'or'`: is a node combining dependancies where at least one is required

> If a station needs to depend from several nodes, it must depend from a `'and'` or `'or'` node.

> If a node is a station, its id must match the station id

### endNodes

List of all ending stations. As the graph is build on dependencies, this list is used as starting points to generate the graph.

```
endnodes = [
  <nodeId>,
  <nodeId>,
  <...>
]
```

____

## station

```
{
  name: String,
  isTrailEntry: Boolean,
  rows: Array
}
```

### row

```
{
  type: String,
  rowId: String
  <type dependant properties>
}
```

> `rowId` is used as key for list rendering

_______

## user

```
{
  openTrails: [
    <trailId>,
    <trailId>,
    <...>
  ],
  accessibleStations: {
    <trailId> : {
      <stationId>: {
        name: <stationName>
      },
      
      ...

      data: {
        name: <trailName>
      }
    }
  },
  lastTrail: '',
  lastStation: ''
}
```