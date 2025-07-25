import { TeamGridSection, teamGridSectionTemplate } from "@ui8kit/blocks/team/TeamGridSection";
import { TeamHiringSection, teamHiringSectionTemplate } from "@ui8kit/blocks/team/TeamHiringSection";

export const Team = () => {
  return (
    <>
      <TeamGridSection content={teamGridSectionTemplate.defaultContent} />
      <TeamHiringSection content={teamHiringSectionTemplate.defaultContent} />
    </>
  );
};