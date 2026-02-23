class LottoTicket extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.numbers = this.generateLottoNumbers();
        this.render();
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .ticket {
                    background-color: var(--white, #fff);
                    padding: 20px;
                    border-radius: var(--border-radius, 10px);
                    box-shadow: var(--box-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    width: 300px;
                    border-top: 5px solid var(--primary-color, #4a90e2);
                }
                .number {
                    background-color: #f0f2f5;
                    border: 1px solid #ddd;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2em;
                    font-weight: bold;
                    color: var(--text-color, #333);
                }
            </style>
            <div class="ticket">
                ${this.numbers.map(num => `<div class="number">${num}</div>`).join('')}
            </div>
        `;
    }

    regenerate() {
        this.numbers = this.generateLottoNumbers();
        this.render();
    }
}

customElements.define('lotto-ticket', LottoTicket);

document.getElementById('generate-button').addEventListener('click', () => {
    document.querySelector('lotto-ticket').regenerate();
});
