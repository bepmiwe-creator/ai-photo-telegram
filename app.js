document.addEventListener('DOMContentLoaded', function () {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.setHeaderColor('#1a1a1a'); 

    const pages = document.querySelectorAll('.page');
    let history = ['home'];

    function showPage(pageId, addToHistory = true) {
        pages.forEach(page => {
            page.style.display = 'none';
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.style.display = 'block';
            if (addToHistory && history[history.length - 1] !== pageId) {
                history.push(pageId);
            }
        }
        updateBackButton();
        updateActiveNavLink(pageId);
    }

    function updateBackButton() {
        if (history.length > 1) {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    }
    
    function updateActiveNavLink(currentPageId) {
        document.querySelectorAll('.bottom-nav-item').forEach(link => {
            if (link.getAttribute('data-page') === currentPageId) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    }

    tg.BackButton.onClick(() => {
        if (history.length > 1) {
            history.pop();
            const previousPageId = history[history.length - 1];
            showPage(previousPageId, false);
        }
    });
    
    // Навигация по ссылкам с классом nav-link (кнопки на главной)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            history = ['home', pageId];
            showPage(pageId, false);
        });
    });

    // Обработчики для кнопок "Генерация по описанию" и "Создать свой" на странице "Фото"
    document.getElementById('generate-description-btn').addEventListener('click', function() {
        showPage('generate-description');
    });

    document.getElementById('create-own-btn').addEventListener('click', function() {
        showPage('create-own');
    });

    // Обработчики для каталогов стилей на странице "Фото"
    document.querySelectorAll('.style-catalog-preview').forEach(item => {
        item.addEventListener('click', function() {
            showPage('style-details'); 
        });
    });

    // Обработчик для кнопки "Создать свою фотосессию"
    document.getElementById('create-photosession-btn').addEventListener('click', function() {
        showPage('own-photosession');
    });
    
    // Обработчики для каталогов фотосессий
    document.querySelectorAll('.photosession-catalog-item').forEach(item => {
        item.addEventListener('click', function() {
            const catalogName = this.querySelector('h3').textContent;
            openPhotosessionModal(catalogName);
        });
    });

    function openPhotosessionModal(catalogName) {
        const modal = document.getElementById('photosession-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalGrid = document.getElementById('modal-styles-grid');
        
        modalTitle.textContent = catalogName;
        modalGrid.innerHTML = '';
        
        const exampleStyles = [
            { img: 'img/photosession-winter/1.png', views: 1200, rating: 4.8 },
            { img: 'img/photosession-winter/2.png', views: 890, rating: 4.9 },
            { img: 'img/photosession-winter/3.png', views: 2500, rating: 4.7 },
            { img: 'img/photosession-winter/4.png', views: 990, rating: 4.6 },
            { img: 'img/photosession-winter/5.png', views: 3100, rating: 5.0 },
            { img: 'img/photosession-winter/6.png', views: 750, rating: 4.5 }
        ];
        
        exampleStyles.forEach(style => {
            const styleItem = document.createElement('div');
            styleItem.className = 'modal-style-item';
            
            const viewsText = style.views >= 1000 ? `${(style.views / 1000).toFixed(1)}k` : style.views;

            styleItem.innerHTML = `
                <div class="modal-style-image-container">
                    <img src="${style.img}" alt="Style Preview">
                </div>
                <div class="modal-style-info">
                    <span class="info-item"><i class="fas fa-eye"></i> ${viewsText}</span>
                    <span class="info-item"><i class="fas fa-star"></i> ${style.rating.toFixed(1)}</span>
                </div>
            `;
            modalGrid.appendChild(styleItem);
        });
        
        modal.style.display = 'flex';
        tg.BackButton.hide();
    }

    document.querySelector('.close-modal-btn').addEventListener('click', function() {
        document.getElementById('photosession-modal').style.display = 'none';
        updateBackButton();
    });
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('photosession-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
            updateBackButton();
        }
    });

    const generatedPhotosContainer = document.getElementById('generated-photos-container');
    if (generatedPhotosContainer) {
        for (let i = 0; i < 4; i++) {
            const photoCard = document.createElement('div');
            photoCard.className = 'generated-photo-card';
            photoCard.innerHTML = `
                <div class="generated-photo-image-container">
                    <img src="img/generated/gen${i + 1}.png" alt="Сгенерированное фото ${i + 1}">
                </div>
                <button class="photosession-button">Фотосессия</button>`;
            generatedPhotosContainer.appendChild(photoCard);
        }
    }

    const userProfile = {
        name: 'Имя Пользователя',
        balance: 150.00,
        photosGenerated: 28,
        photosessionsCreated: 3,
        stylesUsed: 12
    };

    function loadProfileData() {
        document.getElementById('user-name').textContent = userProfile.name;
        document.getElementById('balance-amount').textContent = `${userProfile.balance.toFixed(2)} ₽`;
        document.getElementById('photos-generated-stat').textContent = userProfile.photosGenerated;
        document.getElementById('photosessions-created-stat').textContent = userProfile.photosessionsCreated;
        document.getElementById('styles-used-stat').textContent = userProfile.stylesUsed;
    }

    document.getElementById('top-up-btn').addEventListener('click', function() {
        alert('Переход к пополнению баланса (логика ЮKassa будет здесь)');
    });

    // ОБРАБОТЧИКИ ДЛЯ НИЖНЕЙ НАВИГАЦИИ (ИСПРАВЛЕНИЕ)
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');

            if (pageId === 'home') {
                history = ['home'];
            } else {
                history = ['home', pageId];
            }
            
            if (pageId === 'profile') {
                loadProfileData();
            }

            showPage(pageId, false);
        });
    });

    // Инициализация
    showPage('home', false);
    loadProfileData();
});
