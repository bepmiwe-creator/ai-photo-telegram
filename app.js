document.addEventListener('DOMContentLoaded', function () {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Устанавливаем цвет шапки один раз при инициализации
    tg.setHeaderColor('#1a1a1a'); 

    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    let history = ['home']; // Начинаем с домашней страницы

    function showPage(pageId, addToHistory = true) {
        pages.forEach(page => {
            page.style.display = 'none';
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.style.display = 'block';
            if (addToHistory) {
                // Добавляем в историю, только если это новая страница
                if (history[history.length - 1] !== pageId) {
                    history.push(pageId);
                }
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
        navLinks.forEach(link => {
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
    
    // Навигация по нижнему меню и другим ссылкам с классом nav-link
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Если клик по иконке в нижнем меню, сбрасываем историю
            if (this.closest('.bottom-nav')) {
                 if (pageId === 'home') {
                    history = ['home'];
                } else {
                    history = ['home', pageId];
                }
            }
            
            showPage(pageId, pageId !== 'home');
        });
    });

    // Обработчики для кнопок "Генерация по описанию" и "Создать свой" на странице "Фото"
    document.getElementById('generate-description-btn').addEventListener('click', function() {
        showPage('generate-description');
    });

    document.getElementById('create-own-btn').addEventListener('click', function() {
        showPage('create-own');
    });

    // Обработчики для каталогов стилей на странице "Фото" (заглушка для перехода)
    document.querySelectorAll('.style-catalog-preview').forEach(item => {
        item.addEventListener('click', function() {
            const style = this.getAttribute('data-style');
            // Здесь должна быть логика для показа страницы конкретного стиля
            // Покажем заглушку или спец. страницу для примера
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

    // Функция для открытия модального окна фотосессии
    function openPhotosessionModal(catalogName) {
        const modal = document.getElementById('photosession-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalGrid = document.getElementById('modal-styles-grid');
        
        modalTitle.textContent = catalogName;
        
        // Очищаем предыдущие стили
        modalGrid.innerHTML = '';
        
        // Моковые данные для стилей. В реальном приложении они будут приходить с сервера
        // или храниться в более сложной структуре.
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

            // HTML структура в соответствии с ТЗ: иконки и текст под фото
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
        tg.BackButton.hide(); // Прячем кнопку назад, пока открыто модальное окно
    }
    // Закрытие модального окна
    document.querySelector('.close-modal-btn').addEventListener('click', function() {
        document.getElementById('photosession-modal').style.display = 'none';
        updateBackButton(); // Возвращаем кнопку "назад"
    });
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('photosession-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
            updateBackButton(); // Возвращаем кнопку "назад"
        }
    });


    // Генерация изображений на странице "Своя фотосессия"
    const generatedPhotosContainer = document.getElementById('generated-photos-container');
    if (generatedPhotosContainer) {
        // Пример генерации 4 фотографий
        for (let i = 0; i < 4; i++) {
            const photoCard = document.createElement('div');
            photoCard.className = 'generated-photo-card';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'generated-photo-image-container';
            
            const img = document.createElement('img');
            img.src = `img/generated/gen${i + 1}.png`; // Убедитесь, что пути к изображениям верны
            img.alt = `Сгенерированное фото ${i + 1}`;
            
            imageContainer.appendChild(img);
            
            const button = document.createElement('button');
            button.className = 'photosession-button';
            button.textContent = 'Фотосессия';
            
            photoCard.appendChild(imageContainer);
            photoCard.appendChild(button);
            
            generatedPhotosContainer.appendChild(photoCard);
        }
    }


    // Имитация данных профиля
    const userProfile = {
        name: 'Имя Пользователя',
        balance: 150.00,
        photosGenerated: 28,
        photosessionsCreated: 3,
        stylesUsed: 12
    };

    function loadProfileData() {
        const userNameEl = document.getElementById('user-name');
        const balanceEl = document.getElementById('balance-amount');
        const photosGenEl = document.getElementById('photos-generated-stat');
        const photosessCrEl = document.getElementById('photosessions-created-stat');
        const stylesUsedEl = document.getElementById('styles-used-stat');

        if (userNameEl) userNameEl.textContent = userProfile.name;
        if (balanceEl) balanceEl.textContent = `${userProfile.balance.toFixed(2)} ₽`;
        if (photosGenEl) photosGenEl.textContent = userProfile.photosGenerated;
        if (photosessCrEl) photosessCrEl.textContent = userProfile.photosessionsCreated;
        if (stylesUsedEl) stylesUsedEl.textContent = userProfile.stylesUsed;
    }

    // Показываем главную страницу при загрузке и загружаем данные профиля
    showPage('home', false); // Начинаем с home, не добавляя в историю
    loadProfileData();

    // Специальная навигация для страницы "Профиль", чтобы всегда обновлять данные
    document.querySelector('.nav-link[data-page="profile"]').addEventListener('click', function (e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        // При переходе на профиль из меню, сбрасываем историю
        history = ['home', pageId]; 
        loadProfileData(); // Перезагружаем данные при каждом открытии профиля
        showPage(pageId, false); 
    });

    // Обработчик для кнопки "Пополнить"
    const topUpBtn = document.getElementById('top-up-btn');
    if (topUpBtn) {
        topUpBtn.addEventListener('click', function() {
            // Здесь будет логика для пополнения баланса через ЮKassa
            // tg.openInvoice(invoiceLink);
            alert('Переход к пополнению баланса (логика ЮKassa будет здесь)');
        });
    }

});
// Конец файла app.js
