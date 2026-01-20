// ============================================
// НОВЫЕ ФУНКЦИИ ДЛЯ NANO BANANA
// ============================================

// Инициализация новой структуры (добавить в init)
async init() {
    // ... существующий код ...
    
    // 10. Инициализируем новую навигацию
    this.initNavigation();
    
    // 11. Инициализируем мини-баланс
    this.initMiniBalance();
    
    // ... остальной код ...
},

// Инициализация навигации
initNavigation() {
    // Табы
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            this.switchTab(tabName);
        });
    });
    
    // Быстрый доступ к разделам
    document.getElementById('photo-section').addEventListener('click', () => {
        this.showPhotoCategories();
    });
    
    document.getElementById('photosession-section').addEventListener('click', () => {
        this.showNotification('Фотосессия - в разработке!');
    });
    
    document.getElementById('video-section').addEventListener('click', () => {
        this.showNotification('Видео - в разработке!');
    });
    
    // Категории фото
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.id !== 'create-style') {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.selectPhotoCategory(category);
            });
        }
    });
    
    // Создать свой стиль
    document.getElementById('create-style').addEventListener('click', () => {
        this.showCreateStyleScreen();
    });
    
    // Кнопки назад
    document.getElementById('back-to-main-from-history').addEventListener('click', () => {
        this.switchTab('main');
    });
    
    document.getElementById('back-to-main-from-profile').addEventListener('click', () => {
        this.switchTab('main');
    });
},

// Инициализация мини-баланса
initMiniBalance() {
    const miniBalance = document.getElementById('mini-balance');
    if (miniBalance) {
        miniBalance.addEventListener('click', () => {
            this.showPaymentModal();
        });
    }
    
    // Обновляем отображение баланса
    this.updateAllBalances();
},

// Обновление всех балансов
updateAllBalances() {
    const balance = localStorage.getItem('ai_photo_balance') || '85';
    
    // Мини-баланс
    const miniBalanceCount = document.querySelector('.mini-balance-count');
    if (miniBalanceCount) {
        miniBalanceCount.textContent = balance;
    }
    
    // Баланс в профиле
    const profileBalance = document.getElementById('profile-balance');
    if (profileBalance) {
        profileBalance.textContent = balance;
    }
    
    // Обновляем счетчик в updateBalance
    document.querySelectorAll('.credits-count, .stars-count').forEach(el => {
        el.textContent = balance;
    });
},

// Переключение табов
switchTab(tabName) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Убираем активный класс со всех табов
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем выбранный экран
    let targetScreen;
    switch(tabName) {
        case 'main':
            targetScreen = document.getElementById('screen-main');
            document.querySelector('.tab-item[data-tab="main"]').classList.add('active');
            break;
        case 'history':
            targetScreen = document.getElementById('screen-history');
            document.querySelector('.tab-item[data-tab="history"]').classList.add('active');
            this.loadHistoryTab();
            break;
        case 'profile':
            targetScreen = document.getElementById('screen-profile');
            document.querySelector('.tab-item[data-tab="profile"]').classList.add('active');
            this.updateProfileTab();
            break;
    }
    
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.style.opacity = '0';
        setTimeout(() => {
            targetScreen.style.opacity = '1';
        }, 50);
    }
},

// Показ категорий фото
showPhotoCategories() {
    const quickAccess = document.querySelector('.quick-access');
    const categories = document.getElementById('photo-categories');
    
    if (quickAccess && categories) {
        // Анимация скрытия быстрого доступа
        quickAccess.style.opacity = '0';
        quickAccess.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            quickAccess.classList.add('hidden');
            categories.classList.remove('hidden');
            
            setTimeout(() => {
                categories.style.opacity = '0';
                categories.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    categories.style.opacity = '1';
                    categories.style.transform = 'translateY(0)';
                }, 50);
            }, 50);
        }, 300);
    }
},

// Выбор категории фото
selectPhotoCategory(category) {
    const categoryNames = {
        winter: 'Зима',
        birthday: 'День рождения',
        trends: 'Тренды',
        couples: 'Парные',
        girls: 'Для девушек',
        guys: 'Для мужчин',
        pets: 'Питомцы',
        professions: 'Профессии',
        luxury: 'Luxury'
    };
    
    const categoryName = categoryNames[category] || category;
    this.showNotification(`Выбрана категория: ${categoryName}`);
    
    // Здесь будет переход к выбору примера фото
    // Показываем уведомление о разработке
    setTimeout(() => {
        this.showNotification('Выбор примеров - в разработке!');
    }, 1000);
},

// Показ экрана создания своего стиля
showCreateStyleScreen() {
    this.showNotification('Создание своего стиля - в разработке!');
},

// Загрузка истории в табе
loadHistoryTab() {
    const historyContainer = document.getElementById('history-container');
    if (!historyContainer) return;
    
    let history = JSON.parse(localStorage.getItem('ai_generation_history')) || [];
    
    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-images"></i>
                <p>У вас еще нет созданных фото</p>
                <button class="btn-create-first" onclick="App.switchTab('main')">
                    Создать первое фото
                </button>
            </div>
        `;
        return;
    }
    
    // Фильтруем историю за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentHistory = history.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo;
    });
    
    if (recentHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-calendar"></i>
                <p>Нет созданий за последние 7 дней</p>
            </div>
        `;
        return;
    }
    
    // Группируем по дням
    const groupedByDay = {};
    recentHistory.forEach(item => {
        const date = new Date(item.date);
        const dayKey = date.toLocaleDateString('ru-RU');
        
        if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = [];
        }
        groupedByDay[dayKey].push(item);
    });
    
    // Отображаем историю
    historyContainer.innerHTML = '';
    
    Object.entries(groupedByDay).forEach(([date, items]) => {
        const daySection = document.createElement('div');
        daySection.className = 'history-day';
        
        let itemsHTML = '';
        items.forEach((item, index) => {
            const time = new Date(item.date).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            itemsHTML += `
                <div class="history-item">
                    <div class="history-item-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="history-item-details">
                        <span class="history-item-title">${item.style}</span>
                        <span class="history-item-time">${time}</span>
                    </div>
                    <div class="history-item-stats">
                        <span class="history-item-photos">${item.photos} фото</span>
                        <span class="history-item-credits">${item.credits} звёзд</span>
                    </div>
                </div>
            `;
        });
        
        daySection.innerHTML = `
            <div class="history-date">${date}</div>
            ${itemsHTML}
        `;
        
        historyContainer.appendChild(daySection);
    });
},

// Обновление профиля в табе
updateProfileTab() {
    const user = window.userData || { first_name: 'Пользователь', id: '---' };
    
    // Имя
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = user.first_name || 'Пользователь';
    }
    
    // ID
    const profileId = document.getElementById('profile-id');
    if (profileId) {
        profileId.textContent = user.id || '---';
    }
    
    // Стаж (симулируем)
    const memberSince = localStorage.getItem('member_since');
    if (!memberSince) {
        localStorage.setItem('member_since', new Date().toISOString());
    }
    
    const joinDate = new Date(memberSince || new Date().toISOString());
    const today = new Date();
    const daysSinceJoin = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
    
    const memberDays = document.getElementById('member-days');
    if (memberDays) {
        memberDays.textContent = Math.max(1, daysSinceJoin);
    }
    
    // Баланс
    const balance = localStorage.getItem('ai_photo_balance') || '85';
    const profileBalance = document.getElementById('profile-balance');
    if (profileBalance) {
        profileBalance.textContent = balance;
    }
    
    // Статистика
    const generated = localStorage.getItem('ai_photos_generated') || '12';
    const videos = localStorage.getItem('ai_videos_generated') || '3';
    const totalSpent = localStorage.getItem('ai_total_spent') || '457';
    
    document.getElementById('stat-photos').textContent = generated;
    document.getElementById('stat-videos').textContent = videos;
    document.getElementById('stat-spent').textContent = totalSpent;
},

// Обновляем функцию updateBalance для новой структуры
updateBalance(change) {
    const changeNum = parseInt(change) || 0;
    let balance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
    
    balance += changeNum;
    if (balance < 0) balance = 0;
    
    localStorage.setItem('ai_photo_balance', balance.toString());
    
    // Обновляем ВСЕ места с балансом
    this.updateAllBalances();
    
    console.log(`Баланс изменен на: ${changeNum} звёзд. Новый баланс: ${balance}`);
    
    return balance;
},
