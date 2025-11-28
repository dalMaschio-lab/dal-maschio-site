document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.querySelector('.tabs');
    const programSection = document.querySelector('#program');

    fetch('program.csv')
        .then(r => r.text())
        .then(text => {
            const rows = text.trim().split('\n')
                .map(line => line.split('\t'));

            const header = rows.shift(); // remove header
            const days = [...new Set(rows.map(r => r[0]))].sort();

            // Clear existing tabs and content
            tabsContainer.innerHTML = '';
            document.querySelectorAll('.tab-content').forEach(el => el.remove());

            days.forEach((dayId, index) => {
                // Create tab button
                const date = new Date('2026-01-30');
                date.setDate(30 + index);
                const label = date.toLocaleDateString('en', { weekday: 'long', day: 'numeric' });

                const btn = document.createElement('button');
                btn.className = 'tab';
                btn.textContent = label;
                btn.dataset.day = dayId;
                if (index === 0) btn.classList.add('active');
                tabsContainer.appendChild(btn);

                // Create content div
                const content = document.createElement('div');
                content.className = 'tab-content';
                content.id = dayId;
                if (index === 0) content.classList.add('active');
                programSection.appendChild(content);

                // Fill events for this day
                rows.forEach(row => {
                    if (row[0] === dayId) {
                        const [_, time, event] = row;
                        const item = document.createElement('div');
                        item.className = 'schedule-item';
                        item.innerHTML = `
                            <div class="time">${time}</div>
                            <div class="event-details">${event}</div>
                        `;
                        content.appendChild(item);
                    }
                });
            });

            // Re-attach tab switching
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(tab.dataset.day).classList.add('active');
                });
            });
        });

    // Speakers loading
        const speakersContainer = document.querySelector('.speakers');

        fetch('speakers.csv')
            .then(r => r.text())
            .then(text => {
                const rows = text.trim().split('\n')
                    .map(line => line.split('\t').map(c => c.trim().replace(/^"|"$/g, '')));

                const header = rows.shift(); // remove header: name,title,association,image

                rows.forEach(row => {
                    const [name, image, ...associations] = row;
                    const imgSrc = image ? image : 'default.svg';
                    const paragraphs = associations.join(' • ');
                    const card = document.createElement('div');
                    card.className = 'speaker-card';
                    card.innerHTML = `
                        <img src="${imgSrc}" alt="${name}">
                        <div class="speaker-info">
                            <h3>${name}</h3>
                            <p>${paragraphs}</p>
                        </div>
                    `;
                    speakersContainer.appendChild(card);
                });
            });
});
