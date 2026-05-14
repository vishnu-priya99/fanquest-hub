/**
 * FanQuest: Elite Engagement Engine
 * Final Production Version
 */

document.addEventListener('DOMContentLoaded', () => {
    const ui = {
        xpBar: document.querySelector('.xp-bar-fill'),
        xpText: document.querySelector('.xp-info').children[1],
        coachText: document.getElementById('coach-text'),
        radarPolygon: document.querySelector('.radar-polygon'),
        countdown: document.getElementById('countdown'),
        modal: document.getElementById("intel-modal")
    };

    const state = { xp: 2450, nextLevelXp: 3000, metrics: { loyalty: 85, risk: 40, consistency: 90, engagement: 75 } };

    // --- Elite Confetti Engine ---
    window.launchConfetti = () => {
        const colors = ['#00f2ff', '#8a2be2', '#ffcc00', '#39ff14', '#ff0055'];
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            c.style.cssText = `position:fixed; left:50vw; top:50vh; width:12px; height:12px; background:${color}; box-shadow:0 0 15px ${color}; border-radius:50%; z-index:999999; pointer-events:none;`;
            document.body.appendChild(c);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 12 + Math.random() * 18;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let px = 0, py = 0, op = 1;

            const step = () => {
                px += vx; py += vy; vy += 0.7; vx *= 0.96; op -= 0.015;
                c.style.transform = `translate(${px}px, ${py}px) scale(${op})`;
                c.style.opacity = op;
                if (op > 0) requestAnimationFrame(step); else c.remove();
            };
            requestAnimationFrame(step);
        }
    };

    // Timer Logic
    const updateCountdown = () => {
        const now = new Date().getTime();
        const eventTime = now + (2 * 24 * 60 * 60 * 1000);
        const diff = eventTime - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        ui.countdown.innerText = `${d}D : ${h}H : ${m}M : ${s}S`;
    };
    setInterval(updateCountdown, 1000);

    const updateRadar = () => {
        const center = 100;
        const vals = [state.metrics.loyalty, state.metrics.risk, state.metrics.consistency, state.metrics.engagement];
        const points = vals.map((val, i) => {
            const angle = (i / vals.length) * 2 * Math.PI - Math.PI / 2;
            const r = (val / 100) * 80;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        ui.radarPolygon.setAttribute('points', points);
    };

    window.acceptChallenge = () => {
        window.launchConfetti();
        state.xp += 200;
        updateRadar();
        const perc = Math.min(100, (state.xp / state.nextLevelXp) * 100);
        ui.xpBar.style.width = `${perc}%`;
        ui.xpText.innerText = `${state.xp.toLocaleString()} / ${state.nextLevelXp.toLocaleString()} XP`;
        ui.coachText.innerHTML = '<span style="color:var(--accent-neon)">[ANALYZING...]</span> "Tactical risk accepted. Multiplier active."';
    };

    window.vote = (choice) => {
        window.launchConfetti();
        state.metrics.engagement = Math.min(100, state.metrics.engagement + 2);
        updateRadar();
    };

    // Modal
    document.getElementById("intel-toggle").onclick = () => ui.modal.classList.add('active');
    document.querySelector(".close-modal").onclick = () => ui.modal.classList.remove('active');

    updateCountdown();
    updateRadar();
});
