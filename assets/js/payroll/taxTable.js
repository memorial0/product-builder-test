/**
 * 근로소득 간이세액표 룩업 및 세액 계산 로직
 */

/**
 * @typedef {Object} TaxTableEntry
 * @property {number} min - 월 급여(비과세 제외) 하한액
 * @property {number} max - 월 급여(비과세 제외) 상한액
 * @property {Object.<string, number>} taxByDependents - 공제대상가족수별 세액
 */

/** @type {TaxTableEntry[]} */
const taxTable = [
    // placeholder: 간이세액표 데이터를 여기에 채워넣음.
    // 실제 운영 시에는 대용량이므로 외부 JSON에서 로드하는 방식을 권장.
];

/**
 * 간이세액표 기반 소득세 산출
 */
export function getMonthlyIncomeTax({ taxableMonthly, dependents, childrenUnder20 }) {
    // 1) 룩업 테이블에서 매칭되는 구간 확인
    const entry = taxTable.find(e => taxableMonthly >= e.min && (e.max ? taxableMonthly < e.max : true));
    
    if (entry) {
        // 간이세액표 데이터가 있을 때 룩업 (간이세액표는 공제대상가족수 기준)
        // 20세 이하 자녀수는 보통 공제대상가족수에 포함되거나 별도 가산됨 (연도별 정책 확인 필요)
        // 여기서는 단순화하여 dependents 키로 룩업
        return entry.taxByDependents[dependents.toString()] || 0;
    }

    // 2) Fallback: 연간 추정 세액 기반 계산 (데이터가 없을 때)
    // 2024년 근로소득세율 (누진세)
    // 1400 이하: 6%, 5000 이하: 15%, 8800 이하: 24%, 1.5억 이하: 35%...
    const annualTaxable = taxableMonthly * 12;
    
    // 단순화된 누진세 계산 (추정용)
    let annualTax = 0;
    if (annualTaxable <= 14000000) {
        annualTax = annualTaxable * 0.06;
    } else if (annualTaxable <= 50000000) {
        annualTax = (annualTaxable - 14000000) * 0.15 + 840000;
    } else if (annualTaxable <= 88000000) {
        annualTax = (annualTaxable - 50000000) * 0.24 + 6240000;
    } else {
        annualTax = (annualTaxable - 88000000) * 0.35 + 15360000;
    }

    // 부양가족 공제 등 (대략적 추정치 반영)
    // 본인 150만, 부양가족당 150만 등... (이건 매우 복잡함으로 최소한만 반영)
    const deductionEstimate = (dependents * 1500000) * 0.15; // 세율 15% 구간 가정 시
    const estimatedMonthly = Math.max(0, (annualTax - deductionEstimate) / 12);

    return estimatedMonthly;
}
