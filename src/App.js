import React from "react";
import { Canvas, Node, Edge } from "reaflow";
import { nodes as defaultNodes, edges as defaultEdges } from "./data";
export const App = () => {
  const [nodes, setNodes] = React.useState(defaultNodes);
  const [edges, setEdges] = React.useState(defaultEdges);
  const getAllChildren = (source) => {};
  const nodeParent = React.useCallback(
    edges.reduce(function (r, a) {
      r[a.from] = r[a.from] || [];
      r[a.from].push(a.to);
      return r;
    }, Object.create({})),
    [edges]
  );

  console.log(nodeParent);
  const handleOnClickNode = (node) => {
    const nodeId = node.id;
    console.log({ node });
    if (node.properties.collapse) {
      console.log("collapse");
      //get all edges from old edges
      let fromEdges = defaultEdges.filter((elem) => elem.from === nodeId);
      console.log("collapse fromEdges", fromEdges);
      const tempEdges = [...edges];
      for (const iterator of fromEdges) {
        tempEdges.push(iterator);
      }
      setEdges(tempEdges);
      fromEdges = defaultEdges
        .map((elem) => {
          if (elem.from === nodeId) {
            return elem.to;
          }
        })
        .filter(Boolean);
      console.log("collapse fromEdges to", fromEdges);

      ///get all nodes fromEdges to
      const retrivedNode = defaultNodes.filter((elem) => {
        if (fromEdges.includes(elem.id)) return true;
      });
      console.log("collapse retrivedNode", retrivedNode);
      const tempNodes = [...nodes];
      for (const iterator of retrivedNode) {
        tempNodes.push(iterator);
      }
      const index = tempNodes.findIndex((elem) => {
        console.log({ elem });
        console.log({ nodeId });
        return elem.id === nodeId;
      });
      console.log({ index });
      tempNodes[index] = {
        ...tempNodes[index],
        collapse: false,
      };
      setNodes(tempNodes);
    } else {
      let finalEdges = edges,
        finalNode = nodes;
      const fromEdges = edges
        .map((elem) => {
          if (elem.from === nodeId) {
            return elem.to;
          }
        })
        .filter(Boolean);
      console.log({ fromEdges });
      for (const edge of fromEdges) {
        //CheckIfParent
        if (nodeParent[edge]) {
          console.log("nodeParent" + edge, nodeParent[edge]);
          //CheckIfParent
          if (nodeParent[nodeParent[edge]]) {
            const parent = nodeParent[nodeParent[edge]];
            console.log("nodeParent 2", parent);
            finalEdges = finalEdges.filter((elem) => {
              if (!parent.includes(elem.to)) return true;
            });
            finalNode = finalNode.filter((elem) => {
              if (!parent.includes(elem.id)) return true;
            });
            console.log({finalEdges})
            console.log({finalNode})
          }
          console.log("nodeParent" + edge, nodeParent[edge]);
          finalEdges = finalEdges.filter((elem) => {
            if (!nodeParent[edge].includes(elem.to)) return true;
          });
          console.log({ finalEdges });
          finalNode = finalNode.filter((elem) => {
            if (!nodeParent[edge].includes(elem.id)) return true;
          });
        }
      }

      finalNode = finalNode.filter((elem) => {
        if (!fromEdges.includes(elem.id)) return true;
      });
      console.log({ nodes });
      console.log({ finalNode });
      console.log({ nodeId });
      const index = finalNode.findIndex((elem) => {
        console.log({ elem });
        console.log({ nodeId });
        return elem.id === nodeId;
      });
      console.log({ index });
      finalNode[index] = {
        ...finalNode[index],
        collapse: true,
      };
      setNodes(finalNode);
      finalEdges = finalEdges.filter((elem) => {
        if (!fromEdges.includes(elem.to)) return true;
      });
      console.log({ finalEdges });
      setEdges(finalEdges);
    }

    // nodes([])
  };
  const isSourceExit = (source) => {
    const index = nodes.findIndex((elem) => elem.id == source);

    return index >= 0 ? true : false;
  };
  return (
    <Canvas
      nodes={nodes}
      edges={edges}
      maxWidth={800}
      maxHeight={800}
      node={(nodeProps) => {
        return (
          <Node
            nodeProps={nodeProps}
            onClick={(e) => {
              console.log("click", e.detail);
              if (e.detail === 2) {
                console.log("Double click");
                console.log(nodeProps);
                handleOnClickNode(nodeProps);
              }
            }}
            linkable={false}
          />
        );
      }}
      // edge={(edgeProps) => {
      //   const edge = JSON.stringify(edgeProps);
      //   const source = JSON.parse(edge).source;
      //   if (isSourceExit(source)) {
      //     return <Edge {...edgeProps} />;
      //   } else {
      //     return <></>;
      //   }
      // }}
      onLayoutChange={(layout) => console.log("Layout", layout)}
    />
  );
};
