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
                    background-color: var(--container-bg);
                    padding: 2rem;
                    border-radius: 20px;
                    box-shadow: var(--shadow);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    width: 100%;
                    border: 1px solid var(--border-color);
                    transition: all var(--transition-speed);
                }
                .number {
                    background-color: var(--ball-bg);
                    color: var(--ball-text);
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.1rem;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .number:hover {
                    transform: scale(1.1) translateY(-5px);
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

// Generate Button Logic
const generateBtn = document.getElementById('generate-button');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const ticket = document.querySelector('lotto-ticket');
        if (ticket) {
            ticket.regenerate();
        }
    });
}
