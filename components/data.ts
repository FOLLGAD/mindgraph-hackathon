export const fusionSkillTree = `
  <skillTree name="NuclearFusion">
    <skill name="atomicStructure" displayName="Atomic Structure"></skill>
    <skill name="nuclearForces" displayName="Nuclear Forces"></skill>
    <skill name="plasmaPhysics" displayName="Plasma Physics"></skill>

    <skill name="fusionBasics" displayName="Fusion Basics">
      <requires skill="atomicStructure"/>
      <requires skill="nuclearForces"/>
    </skill>

    <skill name="fusionReactions" displayName="Fusion Reactions">
      <requires skill="fusionBasics"/>
    </skill>

    <skill name="plasmaConfinement" displayName="Plasma Confinement">
      <requires skill="plasmaPhysics"/>
      <requires skill="fusionBasics"/>
    </skill>

    <skill name="magneticConfinement" displayName="Magnetic Confinement">
      <requires skill="plasmaConfinement"/>
    </skill>

    <skill name="inertialConfinement" displayName="Inertial Confinement">
      <requires skill="plasmaConfinement"/>
    </skill>

    <skill name="tokamakDesign" displayName="Tokamak Design">
      <requires skill="magneticConfinement"/>
    </skill>

    <skill name="stellaratorDesign" displayName="Stellarator Design">
      <requires skill="magneticConfinement"/>
    </skill>

    <skill name="laserFusion" displayName="Laser Fusion">
      <requires skill="inertialConfinement"/>
    </skill>

    <skill name="fuelCycles" displayName="Fusion Fuel Cycles">
      <requires skill="fusionReactions"/>
    </skill>

    <skill name="tritiumBreeding" displayName="Tritium Breeding">
      <requires skill="fuelCycles"/>
    </skill>

    <skill name="fusionDiagnostics" displayName="Fusion Diagnostics">
      <requires skill="tokamakDesign"/>
      <requires skill="stellaratorDesign"/>
      <requires skill="laserFusion"/>
    </skill>

    <skill name="fusionMaterials" displayName="Fusion Materials">
      <requires skill="fusionDiagnostics"/>
    </skill>

    <skill name="fusionEconomics" displayName="Fusion Economics">
      <requires skill="fusionDiagnostics"/>
      <requires skill="tritiumBreeding"/>
    </skill>

    <skill name="advancedConcepts" displayName="Advanced Fusion Concepts">
      <requires skill="fusionMaterials"/>
      <requires skill="fusionEconomics"/>
    </skill>
  </skillTree>
`;
