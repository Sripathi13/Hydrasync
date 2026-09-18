import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { GeneratedReport } from '../types/hydrasync.ts';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Printer,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Building2,
  Sliders,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { generateReport, sections, financials, user } = useHydrasync();

  const [reportType, setReportType] = useState<string>('executive');
  const [dateRange, setDateRange] = useState<string>('last_7_days');
  const [facility, setFacility] = useState<string>(user?.facility || 'Apex Plant 04');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const rep = await generateReport({
      type: reportType,
      dateRange,
      facility,
      format,
    });
    setCurrentReport(rep);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydrasync-report-${currentReport.id}.json`;
    a.click();
  };

  return (
    <div id="reports-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                SCADA Compliance & Operational Reporting Engine
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Automated Audit Logs, Hydraulic Performance Dossiers & Sustainability Certifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <span>Report Configuration Parameters</span>
        </h2>

        <form onSubmit={handleGenerate} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Report Template
            </label>
            <select
              id="report-type-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
            >
              <option value="executive">Executive Summary Dossier</option>
              <option value="daily_operations">Daily SCADA Operations Log</option>
              <option value="incident_investigation">Incident & Leak Forensic Report</option>
              <option value="financial_loss">Financial Loss & Non-Revenue Audit</option>
              <option value="sustainability">ISO 14046 Water Footprint Audit</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Time Window
            </label>
            <select
              id="report-date-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
            >
              <option value="today">Current 24-Hour Cycle</option>
              <option value="last_7_days">Last 7 Operating Days</option>
              <option value="month_to_date">Month to Date (MTD)</option>
              <option value="annual_ytd">Year to Date (YTD 2026)</option>
            </select>
          </div>

          {/* Target Facility */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Facility Node
            </label>
            <input
              id="report-facility-input"
              type="text"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
            />
          </div>

          {/* Export Format & Trigger */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Output Format
              </label>
              <select
                id="report-format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
              >
                <option value="pdf">Printable PDF Dossier</option>
                <option value="csv">Raw CSV Tabular Data</option>
                <option value="json">Machine JSON Telemetry</option>
              </select>
            </div>

            <button
              id="generate-report-submit-btn"
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5 h-[38px] active:scale-98"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>Generate</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Report View / Preview */}
      {currentReport ? (
        <div
          id="generated-report-container"
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6 animate-in fade-in"
        >
          {/* Document Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                  {currentReport.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Generated: {currentReport.generatedAt}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {currentReport.title}
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Facility: {currentReport.facility} • Author: {currentReport.author}
              </div>
            </div>

            {/* Print & Download Actions */}
            <div className="flex items-center gap-2 no-print">
              <button
                id="print-report-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                id="download-json-report-btn"
                onClick={handleDownloadJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report ({currentReport.format.toUpperCase()})</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="text-xs font-mono uppercase font-bold text-slate-500 mb-2">
              Executive Narrative & Diagnosis
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">{currentReport.summary}</p>
          </div>

          {/* Key Audit KPI Metrics */}
          <div>
            <h3 className="text-xs font-mono uppercase font-bold text-slate-500 mb-3">
              Certified Audit Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-400 uppercase block">Total Delivery</span>
                <span className="text-xl font-bold text-slate-900">
                  {currentReport.metrics.totalWaterDelivered.toLocaleString()} m³
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-400 uppercase block">Total Lost</span>
                <span className="text-xl font-bold text-rose-600">
                  {currentReport.metrics.totalWaterLost.toLocaleString()} m³
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-400 uppercase block">Financial Loss</span>
                <span className="text-xl font-bold text-rose-600">
                  ${currentReport.metrics.financialLossTotal.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-400 uppercase block">Efficiency Index</span>
                <span className="text-xl font-bold text-emerald-700">
                  {currentReport.metrics.efficiencyIndex}%
                </span>
              </div>
            </div>
          </div>

          {/* Sectional Performance Breakdown Table */}
          <div>
            <h3 className="text-xs font-mono uppercase font-bold text-slate-500 mb-3">
              Distribution Section Auditing Table
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Section Code</th>
                    <th className="py-2.5 px-3">Section Name</th>
                    <th className="py-2.5 px-3">Avg Pressure</th>
                    <th className="py-2.5 px-3">Discharge Loss</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.sections.map((sec: any) => (
                    <tr key={sec.id}>
                      <td className="py-2.5 px-3 font-bold">Section {sec.code}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{sec.name}</td>
                      <td className="py-2.5 px-3">{sec.pressure.toFixed(2)} bar</td>
                      <td className="py-2.5 px-3">{sec.leakRate} m³/h</td>
                      <td className="py-2.5 px-3 uppercase font-semibold text-[11px]">
                        {sec.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Engineering Recommendations */}
          <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-200">
            <h3 className="text-xs font-mono uppercase font-bold text-sky-900 mb-3">
              SCADA & Engineering Action Items
            </h3>
            <ul className="space-y-2 text-xs text-slate-800">
              {currentReport.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Empty / Prompt State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Report Generated in Current View</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Choose your reporting template, facility scope, and time window above, then click{' '}
            <strong>Generate</strong> to compile the audit dossier.
          </p>
        </div>
      )}
    </div>
  );
};
