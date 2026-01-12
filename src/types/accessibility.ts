import { Member } from "./member";

export interface AccessibilityPageData {
  id: number;
  title: string;
  publicationDate: string;
  introText: string;
  complianceStatus: string;
  preparationDate: string;
  feedbackProcedureText: string;
  enforcementProcedureText: string;
  feedbackPersonContact: Member;
  appealContactPerson: Member;
}
