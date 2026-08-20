// 空中交通无线电通话用语学习平台 - JavaScript

/**
 * 使用Web Speech API进行英语发音
 * @param {string} text - 要朗读的文本
 * @param {string} lang - 语言代码，默认为 'en-US'
 */
function speak(text, lang = 'en-US') {
    // 检查浏览器是否支持语音合成
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音功能，请使用现代浏览器（如Chrome、Edge、Firefox等）访问。');
        return;
    }

    // 取消当前正在播放的语音
    window.speechSynthesis.cancel();

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语言
    utterance.lang = lang;
    
    // 设置语速（稍慢以便学习）
    utterance.rate = 0.85;
    
    // 设置音调
    utterance.pitch = 1.0;
    
    // 设置音量
    utterance.volume = 1.0;

    // 尝试获取英语语音
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
    );
    
    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    // 播放语音
    window.speechSynthesis.speak(utterance);

    // 添加视觉反馈
    addVisualFeedback(event.target);
}

/**
 * 添加视觉反馈效果
 * @param {HTMLElement} element - 触发元素
 */
function addVisualFeedback(element) {
    if (!element) return;
    
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

/**
 * 导航菜单切换（移动端）
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // 点击菜单项后关闭菜单
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

/**
 * 平滑滚动导航
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.top-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 更新活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

/**
 * 滚动时更新导航活动状态
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const navHeight = document.querySelector('.top-nav').offsetHeight;

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 加载语音引擎
 */
function loadVoices() {
    // 某些浏览器需要异步加载语音列表
    if ('speechSynthesis' in window) {
        // 预加载语音
        window.speechSynthesis.getVoices();
        
        // Chrome需要等待voiceschanged事件
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

/**
 * 为所有可点击的元素添加键盘支持
 */
function initKeyboardSupport() {
    // 为发音卡片添加键盘支持
    document.querySelectorAll('.pronunciation-card, .letter-card, .vocab-item').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // 为表格行添加键盘支持
    document.querySelectorAll('.phrase-table tbody tr').forEach(row => {
        row.setAttribute('tabindex', '0');
        row.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                row.click();
            }
        });
    });
}

/**
 * 添加点击统计（可选功能）
 */
function trackClick(category, action, label) {
    // 这里可以添加Google Analytics或其他统计代码
    console.log(`学习统计: ${category} - ${action} - ${label}`);
}

/**
 * 初始化所有功能
 */
function init() {
    // 加载语音引擎
    loadVoices();
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化滚动监听
    initScrollSpy();
    
    // 初始化键盘支持
    initKeyboardSupport();

    // 添加点击事件跟踪
    document.querySelectorAll('.play-btn, .play-btn-small, .table-play-btn, .dialogue-play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackClick('pronunciation', 'play', this.closest('.card, tr')?.querySelector('.english-text, .english')?.textContent || 'unknown');
        });
    });

    console.log('✈️ 空中交通无线电通话用语学习平台已加载完成！');
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 暴露全局函数供HTML调用
window.speak = speak;