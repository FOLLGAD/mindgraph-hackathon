"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  OnSelectionChangeFunc,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { SkillTree } from "./SkillTree";

const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

const getNodesAndEdges = (
  skillTree: SkillTree,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = skillTree.skills.map((skill) => ({
    id: skill.name,
    data: { label: skill.displayName },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = skillTree.skills.flatMap((skill) =>
    skill.requires.map((source) => ({
      id: `${source}-${skill.name}`,
      source,
      target: skill.name,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    })),
  );

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

export const SkillTreeFlow: React.FC<{
  onSkillSelected: (skill: string) => void;
  skillTree: SkillTree;
}> = ({ onSkillSelected, skillTree }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } =
      getNodesAndEdges(skillTree);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onSelectionChange: OnSelectionChangeFunc = useCallback((nodes) => {
    onSkillSelected((nodes.nodes[0]?.data.label as string) || "");
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
