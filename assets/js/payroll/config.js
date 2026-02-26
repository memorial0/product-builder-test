/**
 * @typedef {Object} PayrollConfig
 * @property {number} pensionRate - 국민연금 근로자 부담률 (0.045 = 4.5%)
 * @property {number} pensionMax - 국민연금 월 최대 보험료 (본인부담금 기준)
 * @property {number} pensionMin - 국민연금 월 최소 보험료 (본인부담금 기준)
 * @property {number} healthRate - 건강보험 근로자 부담률 (0.03545 = 3.545%)
 * @property {number} healthMax - 건강보험 월 최대 보험료 (본인부담금 기준)
 * @property {number} healthMin - 건강보험 월 최소 보험료 (본인부담금 기준)
 * @property {number} longTermCareRate - 장기요양보험료율 (건강보험료의 %)
 * @property {number} employmentRate - 고용보험 근로자 부담률 (0.009 = 0.9%)
 * @property {number} localIncomeTaxRate - 지방소득세율 (소득세의 10%)
 */

/** @type {Object.<string, PayrollConfig>} */
export const PAYROLL_RATES = {
    '2024': {
        pensionRate: 0.045,
        pensionMax: 277650, // 2024.07 ~ 2025.06 기준 (월 소득 상한액 6,170,000원 * 4.5%)
        pensionMin: 16650,  // 월 소득 하한액 370,000원 * 4.5%
        healthRate: 0.03545,
        healthMax: 4240710, // 상한액은 매우 높음 (월 보수 1.1억 이상)
        healthMin: 19780,
        longTermCareRate: 0.1295, // 12.95%
        employmentRate: 0.009,
        localIncomeTaxRate: 0.1,
    }
};

export const DEFAULT_YEAR = '2024';

export const ROUNDING_RULES = {
    pension: (val) => Math.floor(val / 10) * 10,     // 10원 단위 절사
    health: (val) => Math.floor(val / 10) * 10,      // 10원 단위 절사
    longTermCare: (val) => Math.floor(val / 10) * 10,
    employment: (val) => Math.floor(val / 10) * 10,
    incomeTax: (val) => Math.floor(val / 10) * 10,
    localIncomeTax: (val) => Math.floor(val / 10) * 10,
};
