// ====== Constants & Config ======
const API_BASE_URL = 'https://api.aladhan.com/v1/timings';
const PRAYERS_ARABIC = {
    'Fajr': 'الفجر',
    'Sunrise': 'الشروق',
    'Dhuhr': 'الظهر',
    'Asr': 'العصر',
    'Maghrib': 'المغرب',
    'Isha': 'العشاء'
};
const PRAYERS_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Archive.org MP3s for Adhan
const ADHAN_SOURCES = {
    'alafasy': 'https://ia800305.us.archive.org/33/items/AdhanMishary/Adhan%20Mishary.mp3',
    'abdulbasit': 'https://ia903106.us.archive.org/28/items/AdhanAbdulBaset/AdhanAbdulbaset.mp3',
    'sudais': 'https://ia801309.us.archive.org/15/items/AdhanMecca_827/Adhan_makkah.mp3'
};

const MORNING_ADHIKAR = `أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. 
رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ.`;

const EVENING_ADHIKAR = `أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. 
رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا.`;

// Quran Constants
const SURAHS = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

const RECITER_SERVERS = {
    'afs': 'https://server8.mp3quran.net/afs/',
    'basit_mjwd': 'https://server7.mp3quran.net/basit_mjwd/',
    'sds': 'https://server11.mp3quran.net/sds/',
    'yasser': 'https://server11.mp3quran.net/yasser/',
    'maher': 'https://server12.mp3quran.net/maher/'
};

// ====== State ======
let currentTimings = null;
let countdownInterval = null;
let notificationGranted = false;
let notifiedPrayers = new Set();
let adhanPlayedFor = new Set();
let userLat = null;
let userLng = null;
let qiblaHeading = null;
let audioUnlocked = false;
let tasbeehCount = 0;
let mushafCurrentPage = 1;

// ====== DOM Elements ======
const themeToggle = document.getElementById('theme-toggle');
const fontIncBtn = document.getElementById('font-increase');
const fontDecBtn = document.getElementById('font-decrease');
const hijriDateEl = document.getElementById('hijri-date');
const gregorianDateEl = document.getElementById('gregorian-date');
const locNameEl = document.getElementById('location-name');
const locStatusEl = document.getElementById('location-status');
const locateBtn = document.getElementById('locate-btn');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const countdownTimerEl = document.getElementById('countdown-timer');
const notifyBtn = document.getElementById('enable-notifications');
const reminderStatusEl = document.getElementById('reminder-status');

// New DOM Elements
const muadhinSelect = document.getElementById('muadhin-select');
const testAudioBtn = document.getElementById('test-audio-btn');
const adhanPlayer = document.getElementById('adhan-player');
const compassBtn = document.getElementById('enable-compass-btn');
const compassCircle = document.getElementById('compass-circle');
const qiblaStatus = document.getElementById('qibla-status');
const adhkarSection = document.getElementById('adhkar');
const adhkarTitle = document.getElementById('adhkar-title');
const adhkarContent = document.getElementById('adhkar-content');

// Tasbeeh DOM Elements
const tasbeehCountEl = document.getElementById('tasbeeh-count');
const tasbeehBtn = document.getElementById('tasbeeh-btn');
const tasbeehResetBtn = document.getElementById('tasbeeh-reset');

// Quran DOM Elements
const quranReciter = document.getElementById('quran-reciter');
const quranSurah = document.getElementById('quran-surah');
const quranAudio = document.getElementById('quran-audio');

// Navbar DOM
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelector('.nav-links');

// Custom Audio Player DOM
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const muteBtn = document.getElementById('mute-btn');

// Quran Reading Modal DOM
const readQuranBtn = document.getElementById('read-quran-btn');
const continueReadingBtn = document.getElementById('continue-reading-btn');
const bookmarkPageDisplay = document.getElementById('bookmark-page-display');
const quranModal = document.getElementById('quran-modal');
const closeQuranModalBtn = document.getElementById('close-quran-modal');
const quranTextContainer = document.getElementById('quran-text-container');
const quranModalTitle = document.getElementById('quran-modal-title');
const saveBookmarkBtn = document.getElementById('save-bookmark-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const prevPageBtn = document.getElementById('prev-page-btn');
const currentPageNumEl = document.getElementById('current-page-num');

// ====== Initialization ======
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFontSize();
    initAdhanSettings();
    initQuranPlayer();
    initPWA();
    initTasbeeh();

    setTimeout(() => {
        initNotifications();
        getLocationAndTimings();
    }, 300);

    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    fontIncBtn.addEventListener('click', () => adjustFontSize(1));
    fontDecBtn.addEventListener('click', () => adjustFontSize(-1));
    locateBtn.addEventListener('click', getLocationAndTimings);
    notifyBtn.addEventListener('click', requestNotificationPermission);
    testAudioBtn.addEventListener('click', toggleAudioTest);
    muadhinSelect.addEventListener('change', changeMuadhin);
    compassBtn.addEventListener('click', requestCompassPermission);

    // Quran Event Listeners
    quranReciter.addEventListener('change', updateQuranAudio);
    quranSurah.addEventListener('change', updateQuranAudio);

    // Mobile Navbar Logic
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});

// ====== PWA / Service Worker ======
function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .catch(err => console.log('SW registration failed: ', err));
        });
    }

    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');
    const mainInstallBtn = document.getElementById('main-install-btn');
    const downloadSection = document.getElementById('download-app');
    const navDownloadLink = document.getElementById('nav-download-link');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Stash the event
        deferredPrompt = e;
        // Show the install buttons and sections
        if (installBtn) installBtn.style.display = 'flex';
        if (downloadSection) downloadSection.style.display = 'block';
        if (navDownloadLink) navDownloadLink.style.display = 'block';
    });

    const installHandler = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                if (installBtn) installBtn.style.display = 'none';
                if (downloadSection) downloadSection.style.display = 'none';
                if (navDownloadLink) navDownloadLink.style.display = 'none';
            }
            deferredPrompt = null;
        }
    };

    if (installBtn) {
        installBtn.addEventListener('click', installHandler);
    }
    if (mainInstallBtn) {
        mainInstallBtn.addEventListener('click', installHandler);
    }
}

// ====== Tasbeeh Management ======
function initTasbeeh() {
    // Load from local storage
    const savedTasbeeh = localStorage.getItem('tasbeehCount');
    if (savedTasbeeh) {
        tasbeehCount = parseInt(savedTasbeeh);
        tasbeehCountEl.textContent = tasbeehCount;
    }

    if (tasbeehBtn && tasbeehResetBtn) {
        tasbeehBtn.addEventListener('click', () => {
            tasbeehCount++;
            tasbeehCountEl.textContent = tasbeehCount;
            localStorage.setItem('tasbeehCount', tasbeehCount);

            // Add a little tap animation class and remove it
            tasbeehCountEl.classList.remove('pop');
            void tasbeehCountEl.offsetWidth; // trigger reflow
            tasbeehCountEl.classList.add('pop');
        });

        tasbeehResetBtn.addEventListener('click', () => {
            tasbeehCount = 0;
            tasbeehCountEl.textContent = tasbeehCount;
            localStorage.setItem('tasbeehCount', tasbeehCount);
        });
    }
}

// ====== Quran Player Management ======
function initQuranPlayer() {
    // Populate Surahs
    SURAHS.forEach((surah, index) => {
        let option = document.createElement('option');
        option.value = index + 1; // 1 to 114
        option.textContent = `${index + 1}. سورة ${surah}`;
        quranSurah.appendChild(option);
    });

    // Load Last settings if any
    const savedReciter = localStorage.getItem('quranReciter');
    const savedSurah = localStorage.getItem('quranSurah');

    if (savedReciter && RECITER_SERVERS[savedReciter]) {
        quranReciter.value = savedReciter;
    }
    if (savedSurah) {
        quranSurah.value = savedSurah;
    }

    // Setting up custom player logic
    playPauseBtn.addEventListener('click', toggleQuranPlay);

    quranAudio.addEventListener('timeupdate', updateSeekBar);
    quranAudio.addEventListener('loadedmetadata', () => {
        seekBar.max = Math.floor(quranAudio.duration);
        durationTimeEl.textContent = formatTime(quranAudio.duration);
    });

    quranAudio.addEventListener('ended', () => {
        playPauseIcon.className = 'fas fa-play';
        seekBar.value = 0;
        currentTimeEl.textContent = "00:00";
    });

    seekBar.addEventListener('input', () => {
        quranAudio.currentTime = seekBar.value;
    });

    volumeBar.addEventListener('input', () => {
        quranAudio.volume = volumeBar.value / 100;
        updateVolumeIcon();
    });

    muteBtn.addEventListener('click', () => {
        quranAudio.muted = !quranAudio.muted;
        updateVolumeIcon();
    });

    updateQuranAudio(false); // set src but don't play
}

function toggleQuranPlay() {
    if (quranAudio.paused) {
        quranAudio.play();
        playPauseIcon.className = 'fas fa-pause';
    } else {
        quranAudio.pause();
        playPauseIcon.className = 'fas fa-play';
    }
}

function updateSeekBar() {
    seekBar.value = Math.floor(quranAudio.currentTime);
    currentTimeEl.textContent = formatTime(quranAudio.currentTime);

    // Fallback for duration if loadedmetadata didn't fire properly
    if (!isNaN(quranAudio.duration)) {
        seekBar.max = Math.floor(quranAudio.duration);
        durationTimeEl.textContent = formatTime(quranAudio.duration);
    }
}

function updateVolumeIcon() {
    if (quranAudio.muted || quranAudio.volume === 0) {
        muteBtn.className = 'fas fa-volume-mute';
    } else if (quranAudio.volume < 0.5) {
        muteBtn.className = 'fas fa-volume-down';
    } else {
        muteBtn.className = 'fas fa-volume-up';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateQuranAudio(autoPlay = true) {
    const reciterKey = quranReciter.value;
    let surahNum = quranSurah.value;

    localStorage.setItem('quranReciter', reciterKey);
    localStorage.setItem('quranSurah', surahNum);

    // Format Surah to 3 digits (e.g., "001", "045", "114")
    surahNum = surahNum.toString().padStart(3, '0');

    const serverUrl = RECITER_SERVERS[reciterKey];
    if (serverUrl) {
        quranAudio.src = `${serverUrl}${surahNum}.mp3`;

        playPauseIcon.className = 'fas fa-play';
        seekBar.value = 0;
        currentTimeEl.textContent = "00:00";
        durationTimeEl.textContent = "00:00";

        // Ensure autoPlay is actually an event or explicit boolean
        if (autoPlay === true || (autoPlay instanceof Event)) {
            quranAudio.play().then(() => {
                playPauseIcon.className = 'fas fa-pause';
            }).catch(e => console.log("Autoplay prevented pending user interaction."));
        }
    }
}

// ====== Quran Reading (Mushaf) Management ======
readQuranBtn.addEventListener('click', () => openMushaf(1));
closeQuranModalBtn.addEventListener('click', () => {
    quranModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Continue Reading from bookmark
if (continueReadingBtn) {
    const savedPage = localStorage.getItem('mushafBookmark');
    if (savedPage) {
        continueReadingBtn.style.display = 'flex';
        bookmarkPageDisplay.textContent = savedPage;
    }
    continueReadingBtn.addEventListener('click', () => {
        const page = parseInt(localStorage.getItem('mushafBookmark') || '1');
        openMushaf(page);
    });
}

// Pagination
if (nextPageBtn) nextPageBtn.addEventListener('click', () => {
    if (mushafCurrentPage < 604) {
        mushafCurrentPage++;
        loadMushafPage(mushafCurrentPage);
    }
});
if (prevPageBtn) prevPageBtn.addEventListener('click', () => {
    if (mushafCurrentPage > 1) {
        mushafCurrentPage--;
        loadMushafPage(mushafCurrentPage);
    }
});

// Save Bookmark
if (saveBookmarkBtn) saveBookmarkBtn.addEventListener('click', () => {
    localStorage.setItem('mushafBookmark', mushafCurrentPage);
    saveBookmarkBtn.querySelector('i').className = 'fas fa-bookmark';
    // Update continue reading button on main page
    if (continueReadingBtn) {
        continueReadingBtn.style.display = 'flex';
        bookmarkPageDisplay.textContent = mushafCurrentPage;
    }
    // Feedback animation
    saveBookmarkBtn.style.color = 'var(--gold)';
    setTimeout(() => { saveBookmarkBtn.style.color = ''; }, 1500);
});

function openMushaf(page) {
    mushafCurrentPage = page;
    quranModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    loadMushafPage(page);
}

async function loadMushafPage(pageNum) {
    quranTextContainer.innerHTML = '<div class="loader-text">جاري تحميل الصفحة... <i class="fas fa-spinner fa-spin"></i></div>';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    currentPageNumEl.textContent = pageNum.toString().replace(/\d/g, d => arabicDigits[d]);

    // Update bookmark icon state
    const savedBookmark = localStorage.getItem('mushafBookmark');
    if (saveBookmarkBtn) {
        saveBookmarkBtn.querySelector('i').className = (savedBookmark == pageNum) ? 'fas fa-bookmark' : 'far fa-bookmark';
    }

    // Disable/Enable pagination buttons
    if (prevPageBtn) prevPageBtn.disabled = (pageNum <= 1);
    if (nextPageBtn) nextPageBtn.disabled = (pageNum >= 604);

    try {
        const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`);
        const data = await res.json();

        if (data.code === 200) {
            const ayahs = data.data.ayahs;
            let html = '';
            let currentSurahNum = null;
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            let surahNames = [];

            ayahs.forEach(ayah => {
                // Check if this is a new Surah on this page
                if (ayah.surah.number !== currentSurahNum) {
                    currentSurahNum = ayah.surah.number;
                    surahNames.push(ayah.surah.name);
                    // Add surah header separator
                    html += `<div class="mushaf-surah-header">${ayah.surah.name}</div>`;
                    // Add Bismillah for all surahs except At-Tawbah (9) and Al-Fatiha has it in text already for page 1
                    if (ayah.surah.number !== 9 && ayah.surah.number !== 1) {
                        html += '<div class="mushaf-bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
                    }
                }

                const ayahNumAr = ayah.numberInSurah.toString().replace(/\d/g, d => arabicNumbers[d]);
                html += `<span class="ayah-text">${ayah.text}</span> <span class="ayah-number">﴿${ayahNumAr}﴾</span> `;
            });

            quranTextContainer.innerHTML = html;
            quranModalTitle.textContent = surahNames.join(' / ');

            // Scroll text container to top
            quranTextContainer.scrollTop = 0;
        } else {
            throw new Error('API error');
        }
    } catch (e) {
        quranTextContainer.innerHTML = '<div class="loader-text" style="color: #e74c3c;"><i class="fas fa-exclamation-triangle"></i> حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت.</div>';
    }
}

// ====== Font Size Management ======
function initFontSize() {
    let savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        document.documentElement.style.fontSize = savedSize + 'px';
    } else {
        localStorage.setItem('fontSize', '16');
    }
}

function adjustFontSize(change) {
    let currentSize = parseInt(localStorage.getItem('fontSize') || '16');
    let newSize = currentSize + change;
    // Bound limits: 12px to 24px
    if (newSize >= 12 && newSize <= 24) {
        document.documentElement.style.fontSize = newSize + 'px';
        localStorage.setItem('fontSize', newSize);
    }
}

// ====== Theme Management ======
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    } else {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ====== Audio & Adhan ======
function initAdhanSettings() {
    const savedMuadhin = localStorage.getItem('muadhin');
    if (savedMuadhin && ADHAN_SOURCES[savedMuadhin]) {
        muadhinSelect.value = savedMuadhin;
    }
    adhanPlayer.src = ADHAN_SOURCES[muadhinSelect.value];
}

function changeMuadhin() {
    localStorage.setItem('muadhin', muadhinSelect.value);
    adhanPlayer.src = ADHAN_SOURCES[muadhinSelect.value];

    // If audio was unlocked, we can auto-test snippet
    if (audioUnlocked) {
        playAdhan();
        setTimeout(stopAdhan, 3000); // Play just 3 seconds to preview
    }
}

function toggleAudioTest() {
    if (adhanPlayer.paused) {
        audioUnlocked = true; // Unlock for future auto-play
        adhanPlayer.src = ADHAN_SOURCES[muadhinSelect.value];
        adhanPlayer.load(); // Force load

        testAudioBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        testAudioBtn.style.background = '#e74c3c';

        adhanPlayer.play().then(() => {
            testAudioBtn.innerHTML = '<i class="fas fa-stop"></i> إيقاف التجربة';
        }).catch(e => {
            console.log("Audio play failed: ", e);
            testAudioBtn.innerHTML = '<i class="fas fa-play"></i> فشل التشغيل';
            testAudioBtn.style.background = 'var(--accent-color)';
            alert("عذراً، يرجى التاكد من اتصالك بالإنترنت. الملف الصوتي قد يستغرق وقتاً للتحميل.");
        });
    } else {
        stopAdhan();
        testAudioBtn.innerHTML = '<i class="fas fa-play"></i> تجربة الأذان';
        testAudioBtn.style.background = 'var(--accent-color)';
    }
}

function playAdhan() {
    adhanPlayer.currentTime = 0;
    adhanPlayer.play().catch(e => {
        console.error("Audio playback failed. User interaction needed:", e);
        audioUnlocked = false; // Need interaction
    });
}

function stopAdhan() {
    adhanPlayer.pause();
    adhanPlayer.currentTime = 0;
}

adhanPlayer.onended = () => {
    testAudioBtn.innerHTML = '<i class="fas fa-play"></i> تجربة الأذان';
    testAudioBtn.style.background = 'var(--accent-color)';
};

// ====== Geolocation & APIs ======
function getLocationAndTimings() {
    locStatusEl.textContent = "جاري البحث عن الموقع...";
    locNameEl.textContent = "تحديد الموقع...";

    const btnIcon = locateBtn.querySelector('i');
    btnIcon.classList.add('fa-spin');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                fetchPrayerTimes(userLat, userLng);
                reverseGeocode(userLat, userLng);
                btnIcon.classList.remove('fa-spin');

                // Calculate Qibla angle now that we have coords
                calculateQibla(userLat, userLng);
                initCompass();
            },
            (error) => {
                handleLocationError(error);
                locNameEl.textContent = "القاهرة (موقع افتراضي)";
                userLat = 30.0444; userLng = 31.2357; // Cairo coords
                fetchPrayerTimesByCity('Cairo', 'Egypt');
                calculateQibla(userLat, userLng); // still init qibla to cairo so it has a value
                btnIcon.classList.remove('fa-spin');
            }
        );
    } else {
        locStatusEl.textContent = "متصفحك لا يدعم تحديد الموقع.";
        btnIcon.classList.remove('fa-spin');
    }
}

function handleLocationError(error) {
    if (error.code === error.PERMISSION_DENIED) locStatusEl.textContent = "تم رفض إذن الوصول للموقع.";
    else if (error.code === error.POSITION_UNAVAILABLE) locStatusEl.textContent = "معلومات الموقع غير متوفرة.";
    else if (error.code === error.TIMEOUT) locStatusEl.textContent = "انتهى وقت طلب الاستعلام.";
    else locStatusEl.textContent = "حدث خطأ في تحديد الموقع.";
}

async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`);
        const data = await response.json();
        let city = data.city || data.locality || "موقعك الحالي";
        let country = data.countryName || "";
        locNameEl.textContent = `${city}${country ? '، ' + country : ''}`;
        locStatusEl.textContent = "تم تحديد الموقع بنجاح";
    } catch (e) {
        locNameEl.textContent = "موقعك الحالي";
        locStatusEl.textContent = "تم الحصول على الإحداثيات";
    }
}

async function fetchPrayerTimes(lat, lng) {
    const today = new Date();
    const timestamp = Math.floor(today.getTime() / 1000);
    try {
        const response = await fetch(`${API_BASE_URL}/${timestamp}?latitude=${lat}&longitude=${lng}&method=5`);
        const data = await response.json();
        if (data.code === 200) processTimings(data.data);
    } catch (error) { console.error(error); }
}

async function fetchPrayerTimesByCity(city, country) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
        const data = await response.json();
        if (data.code === 200) processTimings(data.data);
    } catch (error) { console.error(error); }
}

function processTimings(data) {
    const gregorian = data.date.gregorian;
    const hijri = data.date.hijri;

    // Format Dates
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    gregorianDateEl.textContent = new Date().toLocaleDateString('ar-EG', dateOptions);
    hijriDateEl.textContent = `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year}`;

    currentTimings = data.timings;
    PRAYERS_ORDER.forEach(prayer => {
        const timeEl = document.getElementById(`time-${prayer}`);
        if (timeEl && currentTimings[prayer]) {
            timeEl.textContent = formatTime12h(currentTimings[prayer]);
        }
    });

    startCountdown();
}

function formatTime12h(time24) {
    const cleanTime = time24.split(' ')[0];
    const [hour, min] = cleanTime.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'م' : 'ص';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${min} ${ampm}`;
}

// ====== Countdown, Dynamic Styling, Adhkar ======
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (!currentTimings) return;

    const now = new Date();

    let nextPrayer = null;
    let nextPrayerTime = null;
    let currentActivePrayer = 'Isha'; // default if none found
    let minDiff = Infinity;

    for (let i = 0; i < PRAYERS_ORDER.length; i++) {
        const prayer = PRAYERS_ORDER[i];
        const prevPrayer = i > 0 ? PRAYERS_ORDER[i - 1] : 'Isha';

        const cleanTime = currentTimings[prayer].split(' ')[0];
        const [hour, minute] = cleanTime.split(':');
        const prayerDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hour), parseInt(minute), 0);

        const diff = prayerDateObj - now;

        // If prayer is in the past, it could be the current active one
        if (diff <= 0) {
            currentActivePrayer = prayer;
        }

        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayer = prayer;
            nextPrayerTime = prayerDateObj;
        }
    }

    // If all prayers passed, next is Fajr tomorrow
    if (!nextPrayer) {
        nextPrayer = 'Fajr';
        const cleanTime = currentTimings['Fajr'].split(' ')[0];
        const [hour, minute] = cleanTime.split(':');
        nextPrayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, parseInt(hour), parseInt(minute), 0);
        minDiff = nextPrayerTime - now;
        currentActivePrayer = 'Isha';
    }

    // Features updates
    highlightActivePrayerCard(nextPrayer);
    updateAdhkar(currentActivePrayer);

    nextPrayerNameEl.textContent = PRAYERS_ARABIC[nextPrayer];

    // Format Countdown
    const hours = Math.floor((minDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((minDiff % (1000 * 60)) / 1000);

    countdownTimerEl.textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    checkAndSendNotificationAndAudio(nextPrayer, minDiff);
}

function highlightActivePrayerCard(nextPrayer) {
    document.querySelectorAll('.prayer-card').forEach(card => card.classList.remove('active'));
    const nextCard = document.getElementById(`card-${nextPrayer}`);
    if (nextCard) nextCard.classList.add('active');
}



function updateAdhkar(currentPrayer) {
    adhkarSection.style.display = 'block';
    if (currentPrayer === 'Fajr' || currentPrayer === 'Sunrise' || currentPrayer === 'Isha' && (new Date().getHours() < 4)) {
        // Morning
        adhkarTitle.textContent = "أذكار الصباح";
        adhkarContent.innerHTML = `<p>${MORNING_ADHIKAR}</p>`;
    } else if (currentPrayer === 'Asr' || currentPrayer === 'Maghrib' || currentPrayer === 'Isha') {
        // Evening
        adhkarTitle.textContent = "أذكار المساء";
        adhkarContent.innerHTML = `<p>${EVENING_ADHIKAR}</p>`;
    } else {
        // Dhuhr -> Show general dhikr
        adhkarTitle.textContent = "ذكر عام";
        adhkarContent.innerHTML = `<p>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ.</p><p>أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.</p>`;
    }
}

// ====== Notifications & Audio Adhan ======
function initNotifications() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
        notificationGranted = true;
        notifyBtn.innerHTML = '<i class="fas fa-bell"></i> التنبيهات مفعلة';
        notifyBtn.style.background = 'var(--accent-hover)';
        notifyBtn.style.borderColor = 'transparent';
    }
}

function requestNotificationPermission() {
    if (!("Notification" in window)) { alert("متصفحك لا يدعم الإشعارات."); return; }
    if (Notification.permission === 'granted') { alert("الإشعارات مفعلة بالفعل."); return; }

    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            notificationGranted = true;
            notifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> تم التفعيل';
            notifyBtn.style.background = 'var(--accent-hover)';
            new Notification('🕌 الإشعارات مفعلة', { body: 'سيصلك تنبيه الصلاة.', dir: 'rtl', lang: 'ar' });
        } else {
            notifyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> تم الرفض';
        }
    });
}

function checkAndSendNotificationAndAudio(prayerName, timeDiffMs) {
    if (prayerName === 'Sunrise') return;

    const triggerTimeMs = 10 * 60 * 1000; // 10 mins
    const dateStr = new Date().toLocaleDateString();

    // 1. Remind 10 mins before (Notification only)
    // Window: between 10:00 and 9:30 remaining (30s window for reliability)
    if (timeDiffMs <= triggerTimeMs && timeDiffMs > (triggerTimeMs - 30000)) {
        const prayerKey = `${prayerName}-10min-${dateStr}`;
        if (!notifiedPrayers.has(prayerKey)) {
            notifiedPrayers.add(prayerKey);
            if (notificationGranted) sendPrayerNotification(prayerName);
        }
    }

    // 2. Exact Prayer Time (Audio + Notification)
    // Window: 30 seconds before to exactly 0 (30s window for reliability)
    if (timeDiffMs <= 30000 && timeDiffMs >= 0) {
        const prayerKeyExact = `${prayerName}-exact-${dateStr}`;
        if (!notifiedPrayers.has(prayerKeyExact)) {
            notifiedPrayers.add(prayerKeyExact);
            if (notificationGranted) sendExactPrayerNotification(prayerName);

            // Play Audio Adhan
            if (!adhanPlayedFor.has(prayerKeyExact)) {
                adhanPlayedFor.add(prayerKeyExact);
                if (audioUnlocked) playAdhan();
            }
        }
    }
}

function sendPrayerNotification(prayerName) {
    const arabicName = PRAYERS_ARABIC[prayerName] || prayerName;
    new Notification(`بقي 10 دقائق على صلاة ${arabicName}`, { body: 'تجهز للصلاة واذكر الله.', dir: 'rtl', lang: 'ar' });
}

function sendExactPrayerNotification(prayerName) {
    const arabicName = PRAYERS_ARABIC[prayerName] || prayerName;
    new Notification(`🕌 حان الآن موعد صلاة ${arabicName}`, { body: 'الله أكبر، حي على الصلاة.', dir: 'rtl', lang: 'ar' });
}

// ====== Qibla Compass Logic ======
function calculateQibla(lat, lng) {
    const MakkahLat = 21.422487;
    const MakkahLng = 39.826206;

    const phiK = MakkahLat * Math.PI / 180.0;
    const lambdaK = MakkahLng * Math.PI / 180.0;
    const phi = lat * Math.PI / 180.0;
    const lambda = lng * Math.PI / 180.0;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

    let qibla = Math.atan2(y, x) * 180.0 / Math.PI;
    qiblaHeading = (qibla + 360.0) % 360.0;
}

function initCompass() {
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        // Show button for iOS 13+ which requires explicit permission
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            compassBtn.style.display = 'block';
            qiblaStatus.textContent = "اضغط تفعيل لتمكين البوصلة.";
        } else {
            // Android and older iOS bounds it directly without permission request
            startCompassListener();
        }
    } else {
        // Desktop: show static Qibla direction
        if (qiblaHeading !== null) {
            compassCircle.style.transform = `rotate(${qiblaHeading}deg)`;
            const icon = compassCircle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-kaaba';
                icon.style.color = 'var(--gold)';
            }
            qiblaStatus.textContent = `اتجاه القبلة: ${Math.round(qiblaHeading)}° من الشمال. قم بتوجيه جهازك نحو هذا الاتجاه.`;
            compassBtn.style.display = 'none';
        } else {
            qiblaStatus.textContent = "لم يتم تحديد الموقع بعد. اضغط تحديث الموقع أولاً.";
        }
    }
}

function requestCompassPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    compassBtn.style.display = 'none';
                    startCompassListener();
                } else {
                    qiblaStatus.textContent = "تم رفض إذن البوصلة.";
                }
            })
            .catch(console.error);
    }
}

function startCompassListener() {
    qiblaStatus.textContent = "تم تفعيل البوصلة، قم بتدوير جهازك.";
    window.addEventListener('deviceorientationabsolute', handleOrientation);
    // Fallback for some browsers
    window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
    let alpha = event.alpha;

    // For iOS absolute heading
    if (event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
    } else if (alpha !== null) {
        // Android absolute heading conversion
        alpha = 360 - alpha;
    }

    if (alpha !== null && qiblaHeading !== null) {
        // Calculate needle rotation. 
        // We want the arrow to point to Qibla relative to North
        let rotation = qiblaHeading - alpha;
        compassCircle.style.transform = `rotate(${rotation}deg)`;

        // Highlight arrow if facing Qibla exactly (within 10 degrees)
        const diff = Math.abs((rotation + 360) % 360);
        const icon = compassCircle.querySelector('i');

        if (diff < 15 || diff > 345) {
            compassCircle.style.color = "var(--accent-color)";
            icon.style.filter = "drop-shadow(0 0 15px var(--gold))";
            icon.className = "fas fa-kaaba";
            icon.style.color = "var(--gold)";
        } else {
            compassCircle.style.color = "var(--accent-color)";
            icon.style.filter = "none";
            icon.className = "fas fa-long-arrow-alt-up";
            icon.style.color = "";
        }
    }
}
