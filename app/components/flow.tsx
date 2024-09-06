"use client";
import React, { useState, useEffect, useCallback } from "react";

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  ConnectionLineType,
  OnSelectionChangeFunc,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { fusionSkillTree } from "./skilltree";

const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

const parseXML = (xmlString: string): Document => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};

const extractSkillTree = (
  xmlDoc: Document,
): { nodes: Node[]; edges: Edge[] } => {
  const skillTree = xmlDoc.getElementsByTagName("skillTree")[0];
  const skills = skillTree.getElementsByTagName("skill");
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  Array.from(skills).forEach((skill) => {
    const skillName = skill.getAttribute("name") || "";
    const displayName = skill.getAttribute("displayName") || skillName;
    nodes.push({
      id: skillName,
      data: { label: displayName },
      position: { x: 0, y: 0 },
    });

    const requires = skill.getElementsByTagName("requires");
    Array.from(requires).forEach((req) => {
      const source = req.getAttribute("skill") || "";
      edges.push({
        id: `${source}-${skillName}`,
        source,
        target: skillName,
        // type: "straight",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });
  });

  return { nodes, edges };
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = false;
  dagreGraph.setGraph({ rankdir: isHorizontal ? "LR" : "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };
    node.style = {
      ...(node.style ?? {}),
      background: "#339933",
    };
  });

  return { nodes, edges };
};

export const SkillTreeFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // In a real application, you would fetch this XML from a file or API
    const xmlString = fusionSkillTree;

    const xmlDoc = parseXML(xmlString);
    const { nodes: initialNodes, edges: initialEdges } =
      extractSkillTree(xmlDoc);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onSelectionChange: OnSelectionChangeFunc = useCallback((nodes) => {
    console.log(nodes.nodes[0]?.data.label);
  }, []);

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        nodesFocusable={true}
        onSelectionChange={onSelectionChange}
      ></ReactFlow>
    </div>
  );
};
