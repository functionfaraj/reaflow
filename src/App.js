import React from "react";
import { Canvas, Node, Edge } from "reaflow";
import { nodes as defaultNodes, edges as defaultEdges } from "./data";
export const App = () => {
  const [nodes, setNodes] = React.useState(defaultNodes);
  const [edges, setEdges] = React.useState(defaultEdges);
  const nodeParent = React.useCallback(
    edges.reduce(function (r, a) {
      r[a.from] = r[a.from] || [];
      r[a.from].push(a.to);
      return r;
    }, Object.create({})),
    [edges]
  );
  const handleOnClickNode = (node) => {
    const nodeId = node.id;
    if (node.properties.collapse) {
      //get all edges from old edges
      let fromEdges = defaultEdges.filter((elem) => elem.from === nodeId);
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
      ///get all nodes fromEdges to
      const retrivedNode = defaultNodes.filter((elem) => {
        if (fromEdges.includes(elem.id)) return true;
      });
      const tempNodes = [...nodes];
      for (const iterator of retrivedNode) {
        tempNodes.push(iterator);
      }
      const index = tempNodes.findIndex((elem) => {
        return elem.id === nodeId;
      });
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
      for (const edge of fromEdges) {
        //CheckIfParent
        if (nodeParent[edge]) {
          //CheckIfParent
          if (nodeParent[nodeParent[edge]]) {
            const parent = nodeParent[nodeParent[edge]];
            finalEdges = finalEdges.filter((elem) => {
              if (!parent.includes(elem.to)) return true;
            });
            finalNode = finalNode.filter((elem) => {
              if (!parent.includes(elem.id)) return true;
            });
          }
          finalEdges = finalEdges.filter((elem) => {
            if (!nodeParent[edge].includes(elem.to)) return true;
          });
          finalNode = finalNode.filter((elem) => {
            if (!nodeParent[edge].includes(elem.id)) return true;
          });
        }
      }

      finalNode = finalNode.filter((elem) => {
        if (!fromEdges.includes(elem.id)) return true;
      });
      const index = finalNode.findIndex((elem) => {
        return elem.id === nodeId;
      });
      finalNode[index] = {
        ...finalNode[index],
        collapse: true,
      };
      setNodes(finalNode);
      finalEdges = finalEdges.filter((elem) => {
        if (!fromEdges.includes(elem.to)) return true;
      });
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
              if (e.detail === 2) {
                handleOnClickNode(nodeProps);
              }
            }}
            linkable={false}
          />
        );
      }}
    />
  );
};
