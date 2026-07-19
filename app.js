document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Initialize Lucide Icons
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 1. Notion Light / Dark Mode Toggle (Option 3)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('notion-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const updateThemeIcon = (isDark) => {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Set initial theme
    const isInitialDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    if (isInitialDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    updateThemeIcon(isInitialDark);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('notion-theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    // ==========================================
    // 2. Skill progress bars animation
    // ==========================================
    const skillSection = document.querySelector('.skills-container');
    const progressFills = document.querySelectorAll('.progress-fill');
    const skillPercents = document.querySelectorAll('.skill-percent');

    const animateSkills = () => {
        progressFills.forEach((fill, index) => {
            const percentSpan = skillPercents[index];
            const targetPercentStr = percentSpan.textContent;
            const targetVal = parseInt(targetPercentStr, 10);
            
            // Set progress bar width
            fill.style.width = targetPercentStr;

            // Simple text counter count-up
            let currentVal = 0;
            const duration = 1200; // ms
            const interval = 20; // ms
            const step = (targetVal / (duration / interval));
            
            const timer = setInterval(() => {
                currentVal += step;
                if (currentVal >= targetVal) {
                    percentSpan.textContent = targetVal + '%';
                    clearInterval(timer);
                } else {
                    percentSpan.textContent = Math.floor(currentVal) + '%';
                }
            }, interval);
        });
    };

    // ==========================================
    // 3. Stats count-up animation
    // ==========================================
    const statsSection = document.querySelector('.stats-notion-list');
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounters = () => {
        statNumbers.forEach(numEl => {
            if (numEl.classList.contains('counted')) return;
            numEl.classList.add('counted');

            const targetVal = parseInt(numEl.getAttribute('data-count'), 10);
            let currentVal = 0;
            const duration = 1500; // ms
            const interval = 25; // ms
            const step = Math.ceil(targetVal / (duration / interval));

            const timer = setInterval(() => {
                currentVal += step;
                if (currentVal >= targetVal) {
                    numEl.textContent = targetVal + '+';
                    clearInterval(timer);
                } else {
                    numEl.textContent = currentVal;
                }
            }, interval);
        });
    };

    // Intersection Observer to trigger when visible
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skills-container')) {
                    animateSkills();
                } else if (entry.target.classList.contains('stats-notion-list')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (skillSection) sectionObserver.observe(skillSection);
    if (statsSection) sectionObserver.observe(statsSection);

    // ==========================================
    // 4. Navigation link highlight on scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.notion-nav .nav-link');

    window.addEventListener('scroll', () => {
        let currentId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if href matches
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 5. Interactive Background Robot Eyes
    // ==========================================
    const leftPupil = document.querySelector('#eye-left .robot-pupil');
    const rightPupil = document.querySelector('#eye-right .robot-pupil');
    const leftEye = document.getElementById('eye-left');
    const rightEye = document.getElementById('eye-right');

    const moveEyes = (e) => {
        if (!leftEye || !rightEye || !leftPupil || !rightPupil) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Animate left eye pupil
        const leftRect = leftEye.getBoundingClientRect();
        const leftCenterX = leftRect.left + leftRect.width / 2;
        const leftCenterY = leftRect.top + leftRect.height / 2;
        const leftAngle = Math.atan2(mouseY - leftCenterY, mouseX - leftCenterX);
        const leftDist = Math.min(3, Math.hypot(mouseX - leftCenterX, mouseY - leftCenterY) / 100);
        leftPupil.style.transform = `translate(${Math.cos(leftAngle) * leftDist}px, ${Math.sin(leftAngle) * leftDist}px)`;

        // Animate right eye pupil
        const rightRect = rightEye.getBoundingClientRect();
        const rightCenterX = rightRect.left + rightRect.width / 2;
        const rightCenterY = rightRect.top + rightRect.height / 2;
        const rightAngle = Math.atan2(mouseY - rightCenterY, mouseX - rightCenterX);
        const rightDist = Math.min(3, Math.hypot(mouseX - rightCenterX, mouseY - rightCenterY) / 100);
        rightPupil.style.transform = `translate(${Math.cos(rightAngle) * rightDist}px, ${Math.sin(rightAngle) * rightDist}px)`;
    };

    window.addEventListener('mousemove', moveEyes);

    // ==========================================
    // 6. Speech Bubble Loop & Click Interaction
    // ==========================================
    const messages = [
        "สวัสดีครับผู้กอง! 👮‍♂️",
        "มีคดีอะไรให้ผมช่วยสืบไหมครับ?",
        "ระบบวิเคราะห์ OSINT พร้อมครับ! 🔍",
        "วันนี้รับกาแฟไหมครับ? ☕",
        "Pixel Art นี่มันเท่จริงๆ! 👾"
    ];
    let currentMsgIndex = 0;
    const bubble = document.getElementById('robot-bubble');
    const robotBody = document.getElementById('robot-interactive-body');
    const robotHead = document.getElementById('robot-head-element');
    const bgRobot = document.getElementById('bg-robot');

    let isShy = false;
    let messageCycleInterval;

    const cycleMessages = () => {
        if (!bubble || isShy) return;
        bubble.style.opacity = 0;
        setTimeout(() => {
            if (isShy) return; // double check click didn't override
            currentMsgIndex = (currentMsgIndex + 1) % messages.length;
            bubble.textContent = messages[currentMsgIndex];
            bubble.style.opacity = 1;
        }, 300);
    };

    // Start cycling every 8 seconds
    messageCycleInterval = setInterval(cycleMessages, 8000);

    // Click reaction (Blush & Random Message)
    if (bgRobot && robotBody && robotHead && bubble) {
        bgRobot.addEventListener('click', () => {
            if (isShy) return; // Prevent double click spamming
            isShy = true;

            // Trigger blush and wiggle classes
            robotHead.classList.add('blushing');
            robotBody.classList.add('clicked-shy');
            
            // Random message on click
            bubble.style.opacity = 0;
            setTimeout(() => {
                const clickMessages = [
                    "โอ๊ะ! จิ้มเค้าทำไม 😳",
                    "ระบบพร้อมลุยครับ! 🚀",
                    "มีอะไรให้รับใช้ครับผู้กอง?",
                    "ตึ๊ดๆๆ... กำลังประมวลผล 🤖",
                    "ชอบ Pixel Art เหมือนกันเลย!"
                ];
                bubble.textContent = clickMessages[Math.floor(Math.random() * clickMessages.length)];
                bubble.style.opacity = 1;
            }, 200);

            // Revert after 2.5 seconds
            setTimeout(() => {
                robotHead.classList.remove('blushing');
                robotBody.classList.remove('clicked-shy');
                
                bubble.style.opacity = 0;
                setTimeout(() => {
                    bubble.textContent = messages[currentMsgIndex];
                    bubble.style.opacity = 1;
                    isShy = false;
                }, 200);
            }, 2500);
        });
    }
});
