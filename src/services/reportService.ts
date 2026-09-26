import { FeasibilityReport } from '../types/business';
import { storageService } from './storageService';

export const reportService = {
  getReports(userId: string): FeasibilityReport[] {
    return storageService.getItem<FeasibilityReport[]>(userId, 'feasibility_reports', []);
  },

  saveReport(userId: string, report: FeasibilityReport): void {
    const reports = this.getReports(userId);
    const existingIdx = reports.findIndex(r => r.id === report.id);
    if (existingIdx !== -1) {
      reports[existingIdx] = report;
      storageService.setItem(userId, 'feasibility_reports', reports);
    } else {
      storageService.setItem(userId, 'feasibility_reports', [report, ...reports]);
    }
  },

  deleteReport(userId: string, reportId: string): void {
    const reports = this.getReports(userId);
    const filtered = reports.filter(r => r.id !== reportId);
    storageService.setItem(userId, 'feasibility_reports', filtered);
  }
};
