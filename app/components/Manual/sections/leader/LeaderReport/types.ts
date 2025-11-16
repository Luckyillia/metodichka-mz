export interface InterviewItem {
    link: string;
  }
  
  export interface NamedLinkItem {
    name: string;
    link: string;
  }
  
  export interface WarningItem {
    nickname: string;
    reason: string;
  }
  
  export interface StaffEvaluation {
    nickname: string;
    rating: string;
    comment: string;
  }
  
  export interface ReportData {
    faction: string;
    nickname: string;
    dateFrom: string;
    dateTo: string;
    interviews: InterviewItem[];
    firedPSJ: string;
    firedOCS: string;
    totalFired: string;
    totalHired: string;
    firstRanks: string;
    middleStaff: string;
    seniorStaff: string;
    managementStaff: string;
    totalStaff: string;
    callsPerWeek: string;
    callsAccepted: string;
    staffChanges: string;
    warnings: WarningItem[];
    fundReceived: string;
    fundPaid: string;
    fundBalance: string;
    lectures: NamedLinkItem[];
    trainings: NamedLinkItem[];
    events: NamedLinkItem[];
    branchEvents: NamedLinkItem[];
    interfactionEvents: NamedLinkItem[];
    staffEvaluations: StaffEvaluation[];
    formations: InterviewItem[];
  }