const API_URL = "http://localhost:8080/api";

let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');

window.onscroll = () => {
    if (searchBtn) searchBtn.classList.remove('fa-times');
    if (searchBar) searchBar.classList.remove('active');
    if (menu) menu.classList.remove('fa-times');
    if (navbar) navbar.classList.remove('active');
    if (loginForm) loginForm.classList.remove('active');

    // Scroll spy active navbar link
    let sections = document.querySelectorAll('section[id]');
    let headerHeight = document.querySelector('header')?.offsetHeight || 80;
    let scrollPosition = window.scrollY + headerHeight + 50;

    sections.forEach(section => {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.offsetHeight;
        let sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// Toggle mobile menu
if (menu) {
    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
        if (searchBtn) searchBtn.classList.remove('fa-times');
        if (searchBar) searchBar.classList.remove('active');
    });
}

// Smooth scroll to target section when clicking any menu or anchor link
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        let targetId = link.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        let targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();

            if (menu) menu.classList.remove('fa-times');
            if (navbar) navbar.classList.remove('active');
            if (searchBtn) searchBtn.classList.remove('fa-times');
            if (searchBar) searchBar.classList.remove('active');

            let headerHeight = document.querySelector('header')?.offsetHeight || 80;
            let targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Push to browser history so mobile & browser Back button works!
            try {
                history.pushState({ section: targetId }, '', targetId);
            } catch (err) {}

            document.querySelectorAll('.navbar a').forEach(navLink => navLink.classList.remove('active'));
            let currentNavLink = document.querySelector(`.navbar a[href="${targetId}"]`);
            if (currentNavLink) {
                currentNavLink.classList.add('active');
            }
        }
    });
});

// Browser back button support (popstate)
window.addEventListener('popstate', () => {
    let hash = window.location.hash || '#home';
    let targetSection = document.querySelector(hash);
    if (targetSection) {
        let headerHeight = document.querySelector('header')?.offsetHeight || 80;
        let pos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Floating Back to Home button visibility on scroll
const floatingHomeBtn = document.querySelector('#floating-home-btn');
window.addEventListener('scroll', () => {
    if (floatingHomeBtn) {
        if (window.scrollY > 350) {
            floatingHomeBtn.classList.add('visible');
        } else {
            floatingHomeBtn.classList.remove('visible');
        }
    }
});

// Toggle search bar
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBtn.classList.toggle('fa-times');
        searchBar.classList.toggle('active');
        if (navbar) navbar.classList.remove('active');
        if (menu) menu.classList.remove('fa-times');
        if (searchBar && searchBar.classList.contains('active')) {
            const input = searchBar.querySelector('#search-bar');
            if (input) input.focus();
        }
    });
}

// Click outside header search bar to close
document.addEventListener('click', (e) => {
    if (searchBar && searchBar.classList.contains('active')) {
        if (!searchBar.contains(e.target) && e.target !== searchBtn && !searchBtn.contains(e.target)) {
            searchBar.classList.remove('active');
            if (searchBtn) searchBtn.classList.remove('fa-times');
        }
    }
});

// ESC key shortcut to close all active modals & menus
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const logoutModal = document.querySelector('#logout-confirm-modal');
        if (logoutModal) logoutModal.classList.remove('active');
        if (loginForm) loginForm.classList.remove('active');
        if (galleryModal) galleryModal.classList.remove('active');
        if (mapModal) mapModal.classList.remove('active');
        let activeSms = document.querySelector('#sms-modal');
        if (activeSms) activeSms.classList.remove('active');
        if (searchBar) searchBar.classList.remove('active');
        if (searchBtn) searchBtn.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('active');
        if (menu) menu.classList.remove('fa-times');
    }
});


/*-- User Registration & Login Authentication System --*/
const tabLoginBtn = document.querySelector('#tab-login-btn');
const tabRegisterBtn = document.querySelector('#tab-register-btn');
const loginFormEl = document.querySelector('#login-form');
const registerFormEl = document.querySelector('#register-form');
const authAlert = document.querySelector('#auth-alert');
const switchToRegister = document.querySelector('#switch-to-register');
const switchToLogin = document.querySelector('#switch-to-login');

const userLoggedInBox = document.querySelector('#user-logged-in-box');
const userNameText = document.querySelector('#user-name-text');
const logoutBtn = document.querySelector('#logout-btn');

// Navigate to standalone Register / Login Page
if (formBtn) {
    formBtn.addEventListener('click', (e) => {
        // Let the natural <a href="register.html"> link navigate
    });
}

// Helper: Alert Display
function showAuthAlert(msg, type) {
    if (authAlert) {
        authAlert.innerText = msg;
        authAlert.className = `auth-alert ${type}`;
        authAlert.style.display = 'block';
    }
}
function hideAuthAlert() {
    if (authAlert) {
        authAlert.style.display = 'none';
        authAlert.innerText = '';
    }
}

// Tab Switching (Login / Register)
function activateTab(tabName) {
    hideAuthAlert();
    if (tabName === 'login') {
        tabLoginBtn?.classList.add('active');
        tabRegisterBtn?.classList.remove('active');
        loginFormEl?.classList.add('active');
        registerFormEl?.classList.remove('active');
    } else {
        tabRegisterBtn?.classList.add('active');
        tabLoginBtn?.classList.remove('active');
        registerFormEl?.classList.add('active');
        loginFormEl?.classList.remove('active');
    }
}

tabLoginBtn?.addEventListener('click', () => activateTab('login'));
tabRegisterBtn?.addEventListener('click', () => activateTab('register'));
switchToRegister?.addEventListener('click', (e) => { e.preventDefault(); activateTab('register'); });
switchToLogin?.addEventListener('click', (e) => { e.preventDefault(); activateTab('login'); });

// LocalStorage User Database Helpers
function getUsers() {
    return JSON.parse(localStorage.getItem('trip_pilot_users') || '[]');
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('trip_pilot_users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('trip_pilot_current_user') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('trip_pilot_current_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('trip_pilot_current_user');
}

// Update Header User UI & Auto-fill Booking Phone Field
function updateAuthUI() {
    const user = getCurrentUser();
    const bookPhoneInput = document.querySelector('#book-phone');

    if (user && user.name) {
        if (formBtn) formBtn.style.display = 'none';
        if (userLoggedInBox) userLoggedInBox.style.display = 'flex';
        if (userNameText) userNameText.innerText = user.name.split(' ')[0];
        if (bookPhoneInput && user.phone) {
            bookPhoneInput.value = user.phone;
        }
    } else {
        if (formBtn) formBtn.style.display = 'inline-block';
        if (userLoggedInBox) userLoggedInBox.style.display = 'none';
    }
}

// Registration Form Submission
if (registerFormEl) {
    registerFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.querySelector('#reg-name').value.trim();
        const email = document.querySelector('#reg-email').value.trim().toLowerCase();
        const password = document.querySelector('#reg-password').value;
        const confirmPass = document.querySelector('#reg-confirm-password').value;

        if (!name || !email || !password || !confirmPass) {
            showAuthAlert('Please fill in all fields!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAuthAlert('Please enter a valid email address!', 'error');
            return;
        }

        if (password.length < 6) {
            showAuthAlert('Password must be at least 6 characters long!', 'error');
            return;
        }

        if (password !== confirmPass) {
            showAuthAlert('Passwords do not match!', 'error');
            return;
        }

        let backendSuccess = false;
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                backendSuccess = true;
            }
        } catch (err) {
            console.warn('Spring Boot Backend offline. Syncing locally.', err);
        }

        const users = getUsers();
        const existingUser = users.find(u => u.email === email);
        if (!backendSuccess && existingUser) {
            showAuthAlert('This email is already registered! Please login.', 'error');
            return;
        }

        const newUser = { name, email, password };
        if (!existingUser) saveUser(newUser);

        setCurrentUser(newUser);
        updateAuthUI();
        showAuthAlert(`🎉 Welcome, ${name}! Account created successfully!`, 'success');
        
        registerFormEl.reset();
        setTimeout(() => {
            if (loginForm) loginForm.classList.remove('active');
            hideAuthAlert();
        }, 1500);
    });
}

// Login Form Submission
if (loginFormEl) {
    loginFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.querySelector('#login-email').value.trim().toLowerCase();
        const password = document.querySelector('#login-password').value;

        if (!email || !password) {
            showAuthAlert('Please enter email and password!', 'error');
            return;
        }

        let loggedInUser = null;
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                loggedInUser = { name: data.name || email.split('@')[0], email: data.email || email };
            }
        } catch (err) {
            console.warn('Backend offline. LocalStorage check.', err);
        }

        if (!loggedInUser) {
            const users = getUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                showAuthAlert('Account not found! Please register first.', 'error');
                return;
            }

            if (user.password !== password) {
                showAuthAlert('Incorrect password!', 'error');
                return;
            }
            loggedInUser = user;
        }

        setCurrentUser(loggedInUser);
        showAuthAlert(`Welcome back, ${loggedInUser.name}! Login successful 🎉`, 'success');
        updateAuthUI();
        loginFormEl.reset();

        setTimeout(() => {
            if (loginForm) loginForm.classList.remove('active');
            hideAuthAlert();
        }, 1500);
    });
}

// Logout Action with Confirmation Modal
const logoutConfirmModal = document.querySelector('#logout-confirm-modal');
const logoutCancelBtn = document.querySelector('#logout-cancel-btn');
const logoutConfirmBtn = document.querySelector('#logout-confirm-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (logoutConfirmModal) {
            logoutConfirmModal.classList.add('active');
        } else {
            // Fallback confirmation
            if (confirm('Are you sure you want to log out?')) {
                clearCurrentUser();
                updateAuthUI();
            }
        }
    });
}

// Cancel / Back without logging out
if (logoutCancelBtn) {
    logoutCancelBtn.addEventListener('click', () => {
        if (logoutConfirmModal) logoutConfirmModal.classList.remove('active');
    });
}

// Confirm Logout
if (logoutConfirmBtn) {
    logoutConfirmBtn.addEventListener('click', () => {
        if (logoutConfirmModal) logoutConfirmModal.classList.remove('active');
        clearCurrentUser();
        updateAuthUI();
        alert('You have logged out successfully!');
    });
}

// Close logout modal when clicking outside
if (logoutConfirmModal) {
    logoutConfirmModal.addEventListener('click', (e) => {
        if (e.target === logoutConfirmModal) {
            logoutConfirmModal.classList.remove('active');
        }
    });
}

updateAuthUI();

/*-- Fast Video Slider Controls --*/
videoBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.controls .active')?.classList.remove('active');
        btn.classList.add('active');
        let src = btn.getAttribute('data-src');
        let videoEl = document.querySelector('#video-slider');
        if (videoEl && src) {
            videoEl.removeAttribute('poster');
            videoEl.src = src;
            videoEl.load();
            videoEl.play().catch(() => {});
        }
    });
});


/*-- Dynamic Trip Duration Calculator --*/
const arrivalInput = document.querySelector('#book-arrival');
const leavingInput = document.querySelector('#book-leaving');
const durationBadgeBox = document.querySelector('#duration-badge-box');
const durationTextSpan = document.querySelector('#duration-text-span');

function calculateDuration() {
    if (!arrivalInput || !leavingInput) return null;

    const arrivalDateVal = arrivalInput.value;
    const leavingDateVal = leavingInput.value;

    if (arrivalDateVal && leavingDateVal) {
        const arr = new Date(arrivalDateVal);
        const lea = new Date(leavingDateVal);

        const diffTime = lea.getTime() - arr.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const nights = Math.max(1, diffDays - 1);
            const durationStr = `${diffDays} Days / ${nights} ${nights === 1 ? 'Night' : 'Nights'}`;

            if (durationTextSpan) durationTextSpan.innerText = durationStr;
            if (durationBadgeBox) durationBadgeBox.style.display = 'block';

            return { days: diffDays, nights: nights, text: durationStr };
        } else {
            if (durationBadgeBox) durationBadgeBox.style.display = 'none';
        }
    }
    return null;
}

arrivalInput?.addEventListener('change', calculateDuration);
leavingInput?.addEventListener('change', calculateDuration);


/*-- Gallery Destination Details Data --*/
const galleryDetails = {
    'kashi-temple': {
        title: 'Kashi Vishwanath Temple & Sacred Ghats',
        tagline: '"Where spirituality meets the eternal river Ganges in Varanasi."',
        image: 'tripimage/kashi_temple.png',
        location: 'Varanasi (Benares), Uttar Pradesh, India',
        distances: [
            '✈️ Nearest Airport: Lal Bahadur Shastri International Airport, Babatpur (~26 km)',
            '🚂 Nearest Railway Station: Varanasi Junction (BSB) (~4.5 km) / Banaras Station (~3 km)',
            '🚤 Boat Ride: Ganga Ghats Sunrise & Evening Ganga Aarti Tour'
        ],
        attractions: [
            'Kashi Vishwanath Corridor & Golden Temple Shrine',
            'Dashashwamedh Ghat World Famous Evening Maha Aarti',
            'Manikarnika & Harishchandra Sacred Heritage Ghats',
            'Sarnath Buddha Deer Park & Stupa (10 km away)',
            'Assi Ghat Subah-e-Banaras Yoga & Cultural Program',
            'Banarasi Silk Saree Weaving Centers & Local Chaat Tour'
        ],
        bestTime: 'October to March (Pleasant winter climate for temple darshan & ghat walks)',
        placeName: 'Kashi Vishwanath Temple, Varanasi'
    },
    'gulmarg-ski': {
        title: 'Gulmarg Snow Ski Resort & Gondola',
        tagline: '"Asia\'s premier powder snow ski paradise & mountain cable car."',
        image: 'tripimage/gulmarg_ski.png',
        location: 'Baramulla District, Jammu & Kashmir, India',
        distances: [
            '✈️ Nearest Airport: Sheikh ul-Alam International Airport, Srinagar (SXR) (~56 km)',
            '🚠 Cable Car: Gulmarg Gondola (World\'s 2nd highest cable car - 3,979m altitude)',
            '🚗 Road Distance: ~1.5 hours scenic snow drive from Srinagar city'
        ],
        attractions: [
            'Gulmarg Gondola Phase 1 (Kongdoori) & Phase 2 (Apharwat Peak)',
            'Certified Ski & Snowboard Gear Rental & Alpine Instructors',
            'Apharwat Peak Powder Snow Ski Slopes & Heli-Skiing',
            'St. Mary\'s 100-year-old Wooden Church & Strawberry Valley',
            'Maharani Temple & Gulmarg Golf Course (Highest green course)',
            'Traditional Kashmiri Kahwa & Heated Wooden Lodge Stays'
        ],
        bestTime: 'December to March (Peak Powder Snow Season for Skiing)',
        placeName: 'Gulmarg Ski Resort, Kashmir'
    },
    'kedarnath': {
        title: 'Kedarnath Temple & Sacred Valley',
        tagline: '"Where the soul finds silence and Lord Shiva speaks."',
        image: 'tripimage/gallery1.jpg',
        location: 'Rudraprayag District, Garhwal Himalayas, Uttarakhand, India',
        distances: [
            '✈️ Nearest Airport: Jolly Grant Airport, Dehradun (~238 km)',
            '🚂 Nearest Railway Station: Rishikesh (~216 km) / Haridwar (~240 km)',
            '🥾 Trek Distance: 16 km trek from Gaurikund base camp to Kedarnath Temple'
        ],
        attractions: [
            'Kedarnath Temple (One of 12 sacred Jyotirlingas of Lord Shiva)',
            'Bhairavnath Temple (Guardian deity of the valley, 500m above Kedarnath)',
            'Vasuki Tal (High altitude glacial lake at 4,135 meters elevation)',
            'Chorabari Glacier & Gandhi Sarovar',
            'Triyuginarayan Temple (Shiva-Parvati wedding flame site)'
        ],
        bestTime: 'May to June & September to November',
        placeName: 'Kedarnath Dham, Uttarakhand'
    },
    'india-gate': {
        title: 'India Gate & Kartavya Path',
        tagline: '"Standing tall in the heart of India — a tribute to the brave soldiers."',
        image: 'tripimage/gallery8.jpg',
        location: 'Central New Delhi, Delhi, India',
        distances: [
            '✈️ Nearest Airport: Indira Gandhi International Airport (DEL) (~14 km)',
            '🚂 Nearest Railway Station: New Delhi Railway Station (NDLS) (~4.5 km)'
        ],
        attractions: [
            'National War Memorial & Amar Jawan Jyoti',
            'Rashtrapati Bhavan (Presidential Palace) & Amrit Udyan',
            'Red Fort (Lal Qila) & Historic Chandni Chowk (~6 km)',
            'Qutub Minar & Mehrauli Heritage Park (~14 km)'
        ],
        bestTime: 'October to March',
        placeName: 'India Gate, Delhi'
    },
    'taj-mahal': {
        title: 'Taj Mahal & Agra Fort',
        tagline: '"The eternal monument of white marble love on the Yamuna river."',
        image: 'tripimage/taj_mahal.png',
        location: 'Agra, Uttar Pradesh, India',
        distances: [
            '✈️ Nearest Airport: Kheria Airport Agra (~12 km) / Delhi Airport (~200 km via Yamuna Expressway)',
            '🚂 Nearest Railway Station: Agra Cantt (AGC) (~5 km)'
        ],
        attractions: [
            'Taj Mahal Sunrise & Sunset Reflecting Pool Views',
            'Agra Fort (UNESCO Royal Mughal Residence & Halls of Audience)',
            'Mehtab Bagh Sunset Viewpoint across Yamuna River',
            'Fatehpur Sikri & Buland Darwaza (~35 km)',
            'Petha Sweet Market & Local Zardozi Craft Workshops'
        ],
        bestTime: 'October to March',
        placeName: 'Taj Mahal, Agra'
    },
    'buddha-park': {
        title: 'Buddha Park (Tathagata Tsal)',
        tagline: '"Featuring the magnificent 130ft Golden Buddha Statue in Sikkim."',
        image: 'tripimage/gallery2.jpg',
        location: 'Ravangla, South Sikkim District, Sikkim, India',
        distances: [
            '✈️ Nearest Airport: Pakyong Airport (~72 km) / Bagdogra (~120 km)',
            '🚗 Distance from Gangtok: ~65 km (approx 2.5 hours mountain drive)'
        ],
        attractions: [
            '130-foot Golden Buddha Statue with Kanchenjunga snow peak backdrop',
            'Ralang Monastery (Famous Tibetan Nyingma monastery)',
            'Temi Tea Garden (Sikkim\'s only organic tea estate)'
        ],
        bestTime: 'March to May & September to November',
        placeName: 'Ravangla, Sikkim'
    },
    'kerala': {
        title: 'Kerala Backwaters & Hill Stations',
        tagline: '"Rooted in tradition, wrapped in grace — God\'s Own Country."',
        image: 'tripimage/gallery4.jpg',
        location: 'Alleppey, Munnar & Kochi, Kerala State, India',
        distances: [
            '✈️ Nearest Airport: Cochin International Airport (COK) (~55 km)',
            '🚢 Distance Kochi to Alleppey Backwaters: ~53 km'
        ],
        attractions: [
            'Alleppey Houseboat Cruises in Vembanad Lake',
            'Munnar Tea Plantations & Anamudi Peak',
            'Fort Kochi Chinese Fishing Nets & Mattancherry Palace'
        ],
        bestTime: 'September to March',
        placeName: 'Munnar & Alleppey, Kerala'
    },
    'nahargarh-fort': {
        title: 'Nahargarh Fort & Pink City',
        tagline: '"Perched high above Jaipur, Rajput valor and royal grandeur."',
        image: 'tripimage/gallery6.jpg',
        location: 'Aravalli Hills, Jaipur, Rajasthan, India',
        distances: [
            '✈️ Nearest Airport: Jaipur International Airport (JAI) (~22 km)',
            '🚂 Nearest Railway Station: Jaipur Junction (JP) (~17 km)'
        ],
        attractions: [
            'Nahargarh Fort Sunset Point & Stepwells',
            'Amber (Amer) Fort & Elephant Safari',
            'Hawa Mahal & City Palace Jaipur'
        ],
        bestTime: 'October to March',
        placeName: 'Jaipur, Rajasthan'
    },
    'natural-spring': {
        title: 'Vashisht Hot Springs & Manali Valleys',
        tagline: '"Where the earth whispers through clear healing waters."',
        image: 'tripimage/gallery7.jpg',
        location: 'Vashisht Village, Manali, Himachal Pradesh, India',
        distances: [
            '✈️ Nearest Airport: Kullu-Bhuntar Airport (KUU) (~52 km)',
            '🏔️ Distance to Solang Valley Ski Slopes: ~14 km'
        ],
        attractions: [
            'Vashisht Sulphur Hot Springs & Temple',
            'Solang Valley Skiing & Paragliding',
            'Atal Tunnel & Hadimba Devi Temple'
        ],
        bestTime: 'March to June & October to February',
        placeName: 'Manali, Himachal Pradesh'
    }
};

const galleryModal = document.querySelector('#gallery-modal');
const modalCloseBtn = document.querySelector('#modal-close');
const modalBookBtn = document.querySelector('#modal-book-btn');
let currentPlaceName = '';

// See More Button Click Handler
document.querySelectorAll('.see-more-btn').forEach(button => {
    button.addEventListener('click', () => {
        const placeKey = button.getAttribute('data-place');
        const data = galleryDetails[placeKey];

        if (data && galleryModal) {
            document.querySelector('#modal-img').src = data.image;
            document.querySelector('#modal-title').innerText = data.title;
            document.querySelector('#modal-tagline').innerText = data.tagline;
            document.querySelector('#modal-location').innerText = data.location;
            document.querySelector('#modal-best-time').innerText = data.bestTime;

            const distancesUl = document.querySelector('#modal-distances');
            if (distancesUl) {
                distancesUl.innerHTML = '';
                data.distances.forEach(item => {
                    const li = document.createElement('li');
                    li.innerText = item;
                    distancesUl.appendChild(li);
                });
            }

            const attractionsUl = document.querySelector('#modal-attractions');
            if (attractionsUl) {
                attractionsUl.innerHTML = '';
                data.attractions.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-star" style="color: var(--orange); margin-right: 0.5rem;"></i> ${item}`;
                    attractionsUl.appendChild(li);
                });
            }

            currentPlaceName = data.placeName;
            galleryModal.classList.add('active');
        }
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        if (galleryModal) galleryModal.classList.remove('active');
    });
}

if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.classList.remove('active');
        }
    });
}


/*-- Handle Package "Book Now" & "Book Ski Trip" Buttons --*/
document.querySelectorAll('.packages .box .btn, .book-package-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const placeAttr = btn.getAttribute('data-place');
        const box = btn.closest('.box');
        const placeTitle = placeAttr || box?.querySelector('h3')?.innerText.trim() || '';

        const placeInput = document.querySelector('#book-place');
        const emailInput = document.querySelector('#book-email');
        const user = getCurrentUser();

        if (placeInput && placeTitle) {
            placeInput.value = placeTitle;
        }

        if (emailInput && user && user.email) {
            emailInput.value = user.email;
        }

        const bookSection = document.querySelector('#book');
        if (bookSection) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = bookSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (placeInput) placeInput.focus();
        }
    });
});


/*-- Real-World Ski Trip & Indian Travel SMS Booking Form Submission --*/
const bookingMainForm = document.querySelector('#booking-main-form');

if (bookingMainForm) {
    bookingMainForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const placeInput = document.querySelector('#book-place');
        const phoneInput = document.querySelector('#book-phone');
        const tripTypeInput = document.querySelector('#book-type');
        const guestsInput = document.querySelector('#book-guests');
        const arrivalInput = document.querySelector('#book-arrival');
        const leavingInput = document.querySelector('#book-leaving');

        const place = placeInput ? placeInput.value.trim() : '';
        const recipientPhone = phoneInput ? phoneInput.value.trim() : '';
        const tripType = tripTypeInput ? tripTypeInput.value : 'Ski & Snowboard Alpine Expedition';
        const guests = guestsInput ? parseInt(guestsInput.value) || 1 : 1;
        const arrival = arrivalInput ? arrivalInput.value : '';
        const leaving = leavingInput ? leavingInput.value : '';

        if (!place || !recipientPhone || !arrival || !leaving) {
            alert('Please fill in Destination, 10-digit Mobile Number, Arrival Date, and Leaving Date!');
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(recipientPhone)) {
            alert('Please enter a valid 10-digit Indian Mobile Number (e.g. 9876543210)!');
            return;
        }

        // Calculate Duration
        const arr = new Date(arrival);
        const lea = new Date(leaving);
        let diffDays = Math.ceil((lea.getTime() - arr.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) diffDays = 1;
        const nights = Math.max(1, diffDays - 1);
        const durationStr = `${diffDays} Days / ${nights} Nights`;

        const user = getCurrentUser();
        const userName = user && user.name ? user.name : 'Traveler';
        const userEmail = (user && user.email) ? user.email : (recipientPhone + '@trippilot.com');
        const bookingRef = "TP-" + Math.floor(100000 + Math.random() * 900000);

        // 1. Send Booking Data to Spring Boot Backend API (triggers real SMS via Fast2SMS / Twilio)
        try {
            await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userName,
                    userPhone: recipientPhone,
                    userEmail: userEmail,
                    destination: place,
                    tripType: tripType,
                    guests: guests,
                    arrivalDate: arrival,
                    departureDate: leaving,
                    durationDays: diffDays,
                    durationNights: nights,
                    bookingReference: bookingRef
                })
            });
        } catch (err) {
            console.warn('Backend API offline or unreachable. Displaying local confirmation in SMS Message Box.', err);
        }

        // 2. Display Professional E-Ticket Confirmation Modal
        const isSkiTrip = place.toLowerCase().includes('ski') || place.toLowerCase().includes('gulmarg') || place.toLowerCase().includes('solang') || tripType.toLowerCase().includes('ski');

        const smsBubbleBody = document.querySelector('#sms-bubble-body');
        const smsRecipientDisplay = document.querySelector('#sms-recipient-display');
        const smsModal = document.querySelector('#sms-modal');

        const cleanPhone = recipientPhone.replace(/[^0-9]/g, '').slice(-10);
        if (smsRecipientDisplay) smsRecipientDisplay.innerText = cleanPhone;

        const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // WhatsApp Confirmation Message Body
        const whatsappText = 
`🌟 *TRIPPILOT - BOOKING CONFIRMED* 🌟

Dear ${userName},
✅ *Yes! Your booking has been successfully confirmed!*

📋 *Booking Details:*
• *Booking ID:* #${bookingRef}
• *Destination:* ${place}
• *Trip Package:* ${tripType}
• *Travel Dates:* ${arrival} to ${leaving}
• *Duration:* ${durationStr}
• *Guests:* ${guests} Traveler(s)
• *Status:* Confirmed & Active ✅

📞 *24x7 Helpline:* 1800-TRIP-PILOT | support@trippilot.com
TripPilot wishes you a wonderful and safe journey! ✈️🌴`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;

        if (smsBubbleBody) {
            smsBubbleBody.innerHTML = `
                <div class="sms-bubble-header">
                    <span class="sms-badge-tag" style="background:#22c55e;"><i class="fab fa-whatsapp"></i> WHATSAPP & TICKET CONFIRMED</span>
                    <span class="sms-bubble-time"><i class="far fa-clock"></i> ${currentTimeStr}</span>
                </div>
                <p>Dear <strong>${userName}</strong>,</p>
                <p style="margin-top: 0.6rem; font-size: 1.4rem; color: #16a34a; font-weight: bold;">
                    🎉 Yes! Your booking has been successfully confirmed!
                </p>
                
                <ul class="sms-details-list">
                    <li><strong>Booking ID:</strong> #${bookingRef}</li>
                    <li><strong>Destination:</strong> ${place}</li>
                    <li><strong>Trip Package:</strong> ${tripType}</li>
                    <li><strong>Dates:</strong> ${arrival} to ${leaving}</li>
                    <li><strong>Duration:</strong> ${durationStr}</li>
                    <li><strong>Guests:</strong> ${guests} Traveler(s)</li>
                    <li><strong>Mobile:</strong> +91 ${cleanPhone}</li>
                </ul>

                ${isSkiTrip ? '<p style="color:#38bdf8; font-size:1.3rem; margin: 0.8rem 0;"><i class="fas fa-skiing"></i> <em>Ski gear rental & Gondola pass included.</em></p>' : ''}
                
                <div style="margin-top: 1.2rem; text-align: center;">
                    <a href="${whatsappUrl}" target="_blank" class="btn" style="background:#25D366; color:#fff; border-color:#25D366; display:inline-flex; align-items:center; justify-content:center; gap:0.8rem; font-size:1.35rem; padding:0.9rem 1.8rem; text-decoration:none; border-radius:.5rem; box-shadow:0 4px 12px rgba(37,211,102,0.3); width:100%;">
                        <i class="fab fa-whatsapp" style="font-size:1.8rem;"></i> Open WhatsApp Confirmation
                    </a>
                </div>

                <p style="margin-top: 0.8rem; font-size:1.2rem; color:#94a3b8; text-align:center;">Wishing you a memorable journey with TripPilot! ✈️</p>
            `;
        }

        if (smsModal) {
            smsModal.classList.add('active');
        }

        bookingMainForm.reset();
        if (durationBadgeBox) durationBadgeBox.style.display = 'none';
    });
}

/*-- SMS / Booking Confirmation Modal Handlers --*/
const smsModalEl = document.querySelector('#sms-modal');
const smsCloseBtn = document.querySelector('#sms-modal-close');
const smsBackBtn = document.querySelector('#sms-modal-back');
const smsBackHomeHeaderBtn = document.querySelector('#sms-modal-back-home');
const smsHomeBtn = document.querySelector('#sms-home-btn');
const smsOkBtn = document.querySelector('#sms-ok-btn');

function closeSmsModal() {
    if (smsModalEl) smsModalEl.classList.remove('active');
}

function goToHomeAndCloseModal() {
    closeSmsModal();
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

if (smsCloseBtn) smsCloseBtn.addEventListener('click', closeSmsModal);
if (smsBackBtn) smsBackBtn.addEventListener('click', closeSmsModal);
if (smsOkBtn) smsOkBtn.addEventListener('click', closeSmsModal);
if (smsBackHomeHeaderBtn) smsBackHomeHeaderBtn.addEventListener('click', goToHomeAndCloseModal);
if (smsHomeBtn) smsHomeBtn.addEventListener('click', goToHomeAndCloseModal);

if (smsModalEl) {
    smsModalEl.addEventListener('click', (e) => {
        if (e.target === smsModalEl) closeSmsModal();
    });
}


/*-- Modal Book Button Handler --*/
if (modalBookBtn) {
    modalBookBtn.addEventListener('click', () => {
        if (galleryModal) galleryModal.classList.remove('active');

        const bookSection = document.querySelector('#book');
        if (bookSection) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = bookSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            const placeInput = document.querySelector('#book-place');
            const phoneInput = document.querySelector('#book-phone');
            const user = getCurrentUser();

            if (placeInput && currentPlaceName) {
                placeInput.value = currentPlaceName;
            }

            if (phoneInput && user && user.phone) {
                phoneInput.value = user.phone;
            }

            if (placeInput) placeInput.focus();
        }
    });
}


/*-- Search Bar Location Map --*/
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-bar');
const searchSubmitBtn = document.querySelector('#search-submit-btn');

const mapModal = document.querySelector('#map-modal');
const mapModalClose = document.querySelector('#map-modal-close');
const mapTitle = document.querySelector('#map-location-title');
const mapIframe = document.querySelector('#google-map-iframe');
const externalMapLink = document.querySelector('#external-map-link');
const mapBookBtn = document.querySelector('#map-book-btn');
let currentSearchedLocation = '';

function openLocationMap(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();
    currentSearchedLocation = cleanQuery;

    if (mapTitle) mapTitle.innerText = `📍 ${cleanQuery}`;
    
    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(cleanQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}`;

    if (mapIframe) mapIframe.src = embedUrl;
    if (externalMapLink) externalMapLink.href = googleMapsUrl;

    if (searchBtn) searchBtn.classList.remove('fa-times');
    if (searchBar) searchBar.classList.remove('active');

    if (mapModal) mapModal.classList.add('active');
}

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput ? searchInput.value : '';
        openLocationMap(query);
    });
}

if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput ? searchInput.value : '';
        openLocationMap(query);
    });
}

if (mapModalClose) {
    mapModalClose.addEventListener('click', () => {
        if (mapModal) mapModal.classList.remove('active');
    });
}

if (mapModal) {
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.remove('active');
        }
    });
}

if (mapBookBtn) {
    mapBookBtn.addEventListener('click', () => {
        if (mapModal) mapModal.classList.remove('active');

        const bookSection = document.querySelector('#book');
        if (bookSection) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = bookSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            const placeInput = document.querySelector('#book-place');
            if (placeInput && currentSearchedLocation) {
                placeInput.value = currentSearchedLocation;
                placeInput.focus();
            }
        }
    });
}
