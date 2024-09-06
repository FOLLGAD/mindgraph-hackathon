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

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: string,
) => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const edgesMap = new Map(edges.map((edge) => [edge.id, edge]));

  const layoutedNodes = nodes.map((node, i) => {
    const layoutedNode = {
      ...node,
      position: { x: 100, y: i * 10 },
    };
    return layoutedNode;
  });

  const layoutedEdges = edges.map((edge) => {
    const layoutedEdge = {
      ...edge,
      source: edge.source,
      target: edge.target,
    };
    return layoutedEdge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const parseXML = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};
const extractSkillTree = (xmlDoc: XMLDocument) => {
  const skillTree = xmlDoc.getElementsByTagName("skillTree")[0];
  const skills = skillTree.getElementsByTagName("skill");
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const skillLevels: { [key: string]: number } = {};

  // First pass: determine the level of each skill
  const determineLevel = (
    skillName: string,
    visited: Set<string> = new Set(),
  ): number => {
    if (visited.has(skillName)) return 0; // Prevent circular dependencies
    visited.add(skillName);

    const skill = Array.from(skills).find(
      (s) => s.getAttribute("name") === skillName,
    );
    if (!skill) return 0;

    const requires = skill.getElementsByTagName("requires");
    if (requires.length === 0) return 0;

    let maxLevel = 0;
    Array.from(requires).forEach((req) => {
      const sourceSkill = req.getAttribute("skill")!;
      maxLevel = Math.max(
        maxLevel,
        determineLevel(sourceSkill, new Set(visited)) + 1,
      );
    });

    return maxLevel;
  };

  Array.from(skills).forEach((skill) => {
    const skillName = skill.getAttribute("name")!;
    skillLevels[skillName] = determineLevel(skillName);
  });

  const levelsCounter: { [key: number]: number } = {};

  // Second pass: create nodes and edges
  Array.from(skills).forEach((skill, index) => {
    const skillName = skill.getAttribute("name")!;
    const level = skillLevels[skillName];

    levelsCounter[level] ??= 0;
    nodes.push({
      id: skillName,
      data: { label: skillName },
      position: { x: levelsCounter[level] * 200, y: level * 100 },
    });
    levelsCounter[level] += 1;

    const requires = skill.getElementsByTagName("requires");
    Array.from(requires).forEach((req) => {
      const source = req.getAttribute("skill")!;
      edges.push({
        id: `${source}-${skillName}`,
        source,
        target: skillName,
        type: "straight",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });
  });

  return { nodes, edges };
};

export const SkillTreeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // In a real application, you would fetch this XML from a file or API
    const xmlString = `
      <skillTree name="NuclearFusion">
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
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, direction);
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges],
  );

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};
