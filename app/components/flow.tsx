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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

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
    nodes.push({
      id: skillName,
      data: { label: skillName },
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
  });

  return { nodes, edges };
};

export const SkillTreeFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // In a real application, you would fetch this XML from a file or API
    const xmlString = `<skillTree name="NuclearFusion">
      <skill name="AtomicStructure"></skill>
      <skill name="NuclearPhysicsBasics"></skill>
      <skill name="PlasmaFundamentals"></skill>

      <skill name="FusionReactions">
        <requires skill="AtomicStructure"/>
        <requires skill="NuclearPhysicsBasics"/>
      </skill>

      <skill name="IsotopesAndFuels">
        <requires skill="AtomicStructure"/>
      </skill>

      <skill name="PlasmaConfinement">
        <requires skill="PlasmaFundamentals"/>
      </skill>

      <skill name="MagneticConfinement">
        <requires skill="PlasmaConfinement"/>
      </skill>

      <skill name="InertialConfinement">
        <requires skill="PlasmaConfinement"/>
      </skill>

      <skill name="TokamakDesign">
        <requires skill="MagneticConfinement"/>
      </skill>

      <skill name="StellaratorDesign">
        <requires skill="MagneticConfinement"/>
      </skill>

      <skill name="LaserFusion">
        <requires skill="InertialConfinement"/>
      </skill>

      <skill name="FusionDiagnostics">
        <requires skill="FusionReactions"/>
        <requires skill="PlasmaConfinement"/>
      </skill>

      <skill name="TritiumBreeding">
        <requires skill="IsotopesAndFuels"/>
        <requires skill="FusionReactions"/>
      </skill>

      <skill name="Neutronics">
        <requires skill="FusionReactions"/>
      </skill>

      <skill name="FusionMaterials">
        <requires skill="Neutronics"/>
      </skill>

      <skill name="FusionEnergyConversion">
        <requires skill="FusionReactions"/>
        <requires skill="NuclearPhysicsBasics"/>
      </skill>

      <skill name="FusionSafety">
        <requires skill="TritiumBreeding"/>
        <requires skill="Neutronics"/>
      </skill>

      <skill name="AdvancedFuelCycles">
        <requires skill="IsotopesAndFuels"/>
        <requires skill="FusionReactions"/>
        <requires skill="TritiumBreeding"/>
      </skill>

      <skill name="FusionEconomics">
        <requires skill="FusionEnergyConversion"/>
        <requires skill="FusionMaterials"/>
      </skill>

      <skill name="FutureFusionConcepts">
        <requires skill="TokamakDesign"/>
        <requires skill="StelleratorDesign"/>
        <requires skill="LaserFusion"/>
        <requires skill="AdvancedFuelCycles"/>
      </skill>
    </skillTree>
    `;

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

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      ></ReactFlow>
    </div>
  );
};
