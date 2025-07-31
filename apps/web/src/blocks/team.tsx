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
import { Divider } from "./ui/divider";

export default function TeamBlocks() {
  return (
    <>
      {/* Split Team Examples (5 variants) */}
      <Divider text="1. SplitTeamLeadershipExample" />
      <SplitTeamLeadershipExample />
      <Divider text="2. SplitTeamShowcaseExample" />
      <SplitTeamShowcaseExample />
      <Divider text="3. SplitTeamHiringExample" />
      <SplitTeamHiringExample />
      <Divider text="4. SplitTeamCultureExample" />
      <SplitTeamCultureExample />
      <Divider text="5. SplitTeamDepartmentsExample" />
      <SplitTeamDepartmentsExample />
      
      {/* Grid Team Examples (5 variants) */}
      <Divider text="6. GridTeamGridExample" />
      <GridTeamGridExample />
      <Divider text="7. GridTeamCardsExample" />
      <GridTeamCardsExample />
      <Divider text="8. GridTeamMinimalExample" />
      <GridTeamMinimalExample />
      <Divider text="9. GridTeamShowcaseExample" />
      <GridTeamShowcaseExample />
      <Divider text="10. GridTeamDirectoryExample" />
      <GridTeamDirectoryExample />
    </>
  );
}