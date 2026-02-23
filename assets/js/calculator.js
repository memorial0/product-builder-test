document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('salary-form');
    if (!form) return;

    const salaryInput = document.getElementById('salary');
    const dependentsInput = document.getElementById('dependents');
    const childrenInput = document.getElementById('children');
    const nonTaxableInput = document.getElementById('non-taxable');
    const increaseRateInput = document.getElementById('increase-rate');

    const resultNet = document.getElementById('result-monthly-net');
    const resultRaw = document.getElementById('result-monthly-raw');
    const resultDeduction = document.getElementById('result-deduction-total');
    const simNewSalary = document.getElementById('sim-new-salary');
    const simNewNet = document.getElementById('sim-new-net');

    const params = new URLSearchParams(window.location.search);
    if (params.has('salary')) {
        salaryInput.value = params.get('salary');
        calculate();
    }

    form.addEventListener('input', calculate);

    function calculate() {
        const salary = parseFloat(salaryInput.value) || 0;
        const dependents = parseInt(dependentsInput.value) || 1;
        const children = parseInt(childrenInput.value) || 0;
        const nonTaxable = parseFloat(nonTaxableInput.value) || 200000;
        const increaseRate = parseFloat(increaseRateInput.value) || 0;

        const curr = calcTax(salary, dependents, children, nonTaxable);
        const nextSalary = salary * (1 + increaseRate / 100);
        const next = calcTax(nextSalary, dependents, children, nonTaxable);

        updateUI(curr, next, nextSalary);
    }

    function calcTax(annual, dep, child, nonTax) {
        const monthly = annual / 12;
        const taxable = monthly - nonTax;
        if (taxable <= 0) return { monthly, net: monthly, totalDeduction: 0 };

        const pension = Math.min(taxable * 0.045, 265500);
        const health = taxable * 0.03545;
        const care = health * 0.1295;
        const emp = taxable * 0.009;
        
        // Simple progressive tax approx
        let incomeTax = 0;
        const base = taxable - (pension + health + care + emp);
        if (base > 1000000) {
            if (base <= 4000000) incomeTax = base * 0.15 - 100000;
            else incomeTax = base * 0.24 - 500000;
        }
        incomeTax = Math.max(0, incomeTax - (dep + child) * 15000);
        const localTax = incomeTax * 0.1;

        const totalDeduction = pension + health + care + emp + incomeTax + localTax;
        return { monthly, net: monthly - totalDeduction, totalDeduction };
    }

    function updateUI(curr, next, nextSal) {
        const f = (n) => new Intl.NumberFormat('ko-KR').format(Math.round(n));
        resultNet.textContent = f(curr.net) + '원';
        resultRaw.textContent = f(curr.monthly) + '원';
        resultDeduction.textContent = f(curr.totalDeduction) + '원';
        simNewSalary.textContent = f(nextSal) + '원';
        simNewNet.textContent = f(next.net) + '원';
    }
});
