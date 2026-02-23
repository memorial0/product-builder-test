document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.createElement('button');
    themeBtn.innerHTML = '🌓';
    themeBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:1.2rem;';
    document.querySelector('.navbar .container').appendChild(themeBtn);

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // Active Link
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href').includes('index.html'))) {
            link.classList.add('active');
        }
    });
});
