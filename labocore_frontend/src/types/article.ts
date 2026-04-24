export type ArticleDetails = {
  codeArticle: string;
  designationFr: string;
  designationEn: string;
  dureUtilisation: string;
  uniteDure: string;
  uom: string;
  yieldValue: string;
  unite: string;
  precisionValue: string;
  type: string;
  modeGestion: string;
  alerteAvant: string;
  ficheSecuriteIds: number[];
  mentionRisqueIds: number[];
  prudenceIds: number[];
  examens: string[];
  automates: string[];
};

export interface Article {
  id: string;
  code: string;
  designationFr: string;
  designationEn: string;
  details?: ArticleDetails;
}