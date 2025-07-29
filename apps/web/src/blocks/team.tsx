import {
  // Split Team Examples
  SplitTeamLeadershipExample,
  SplitTeamShowcaseExample,
  SplitTeamHiringExample,
  SplitTeamCultureExample,
  SplitTeamDepartmentsExample,
  
  // Grid Team Examples
  GridTeamGridExample,
  GridTeamCardsExample,
  GridTeamMinimalExample,
  GridTeamShowcaseExample,
  GridTeamDirectoryExample
} from "@ui8kit/blocks/team";

export default function TeamBlocks() {
  return (
    <>
      {/* Split Team Examples (5 variants) */}
      <SplitTeamLeadershipExample />
      <SplitTeamShowcaseExample />
      <SplitTeamHiringExample />
      <SplitTeamCultureExample />
      <SplitTeamDepartmentsExample />
      
      {/* Grid Team Examples (5 variants) */}
      <GridTeamGridExample />
      <GridTeamCardsExample />
      <GridTeamMinimalExample />
      <GridTeamShowcaseExample />
      <GridTeamDirectoryExample />
    </>
  );
}