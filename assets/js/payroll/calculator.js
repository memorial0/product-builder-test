import { PAYROLL_RATES, ROUNDING_RULES, DEFAULT_YEAR } from './config.js';
import { getMonthlyIncomeTax } from './taxTable.js';

/**
 * @typedef {Object} PayrollInput
 * @property {'annual' | 'monthly'} type - 급여 기준 (연봉/월급)
 * @property {number} salary - 금액 (원)
 * @property {boolean} includeSeverance - 퇴직금 포함 여부 (연봉일 때만 유효)
 * @property {number} dependents - 부양가족 수 (본인 포함)
 * @property {number} childrenUnder20 - 20세 이하 자녀 수
 * @property {number} nonTaxableMonthly - 월 비과세액 (기본 200,000)
 */

/**
 * 급여 계산 메인 함수
 * @param {PayrollInput} input 
 */
export function calculatePayroll(input) {
    const {
        type,
        salary,
        includeSeverance,
        dependents,
        childrenUnder20,
        nonTaxableMonthly
    } = input;

    const rates = PAYROLL_RATES[DEFAULT_YEAR];

    // 1) Input Normalization
    // 현금성 월급여 (cashMonthly) 산출
    let cashMonthly = 0;
    if (type === 'annual') {
        // 연봉 기준: 퇴직금 포함이면 /13, 미포함이면 /12
        cashMonthly = includeSeverance ? (salary / 13) : (salary / 12);
    } else {
        // 월급 기준: 입력값을 그대로 현금성 월급여로 봄
        cashMonthly = salary;
    }

    // 과세대상 월급여 (taxableMonthly)
    const taxableMonthly = Math.max(0, cashMonthly - nonTaxableMonthly);

    // 2) Insurance Calculations
    // 국민연금 (Pension)
    let pension = Math.min(Math.max(taxableMonthly * rates.pensionRate, rates.pensionMin), rates.pensionMax);
    pension = ROUNDING_RULES.pension(pension);

    // 건강보험 (Health)
    let health = Math.min(Math.max(taxableMonthly * rates.healthRate, rates.healthMin), rates.healthMax);
    health = ROUNDING_RULES.health(health);

    // 장기요양 (Long Term Care)
    let longTermCare = health * rates.longTermCareRate;
    longTermCare = ROUNDING_RULES.longTermCare(longTermCare);

    // 고용보험 (Employment)
    let employment = taxableMonthly * rates.employmentRate;
    employment = ROUNDING_RULES.employment(employment);

    // 3) Tax Calculations
    let incomeTax = getMonthlyIncomeTax({ taxableMonthly, dependents, childrenUnder20 });
    incomeTax = ROUNDING_RULES.incomeTax(incomeTax);

    let localIncomeTax = incomeTax * rates.localIncomeTaxRate;
    localIncomeTax = ROUNDING_RULES.localIncomeTax(localIncomeTax);

    // 4) Totals
    const totalDeduction = pension + health + longTermCare + employment + incomeTax + localIncomeTax;
    const netMonthly = cashMonthly - totalDeduction;

    // Breakdown for Debug and Detailed UI
    return {
        cashMonthly,
        taxableMonthly,
        deductions: {
            pension,
            health,
            longTermCare,
            employment,
            incomeTax,
            localIncomeTax
        },
        totalDeduction,
        netMonthly,
        meta: {
            year: DEFAULT_YEAR,
            appliedCaps: {
                pension: pension === rates.pensionMax,
                health: health === rates.healthMax
            },
            taxMethod: "lookup_or_fallback"
        }
    };
}
