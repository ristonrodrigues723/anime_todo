const themes = {
    kawaii: {
        mascotPrefix: "kawaii",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌸 Momochan's kawaii To-Do List 🌸",
        stickers:["🌸", "🎀", "⭐", "🌟","🦄", "🌈", "🪄", "💖"],
        backgroundMusic:"./audio/kawaii-bgm.mp3",
        isPlaying :false,
        voiceClips:{
            greeting: "./audio/voiceclips/konnichiwa.mp3",
            taskAdded: "./audio/voiceclips/tuturu_1.mp3",
            taskCompleted: "./audio/voiceclips/congrats.mp3",
            click: "./audio/voiceclips/Voicy_SUGO-I.mp3",
        }
        // isPlaying :false

    },
    cyberpunk: {
        mascotPrefix: "cyber",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"⚡Momochan's CyberTask Command Center ⚡",
        stickers:["⚡", "🤖", "💻", "🎮", "🔧", "💾", "📡", "🕹️"],
        backgroundMusic:"./audio/cyber-bgm.mp3",
        isPlaying :false,
        voiceClips:{
            greeting: "./audio/voiceclips/konnichiwa.mp3",
            taskAdded: "./audio/voiceclips/Voicy_SUGO-I.mp3",
            taskCompleted: "./audio/voiceclips/Voicy_Gudjob.mp3",
            click: "./audio/voiceclips/Woah.mp3",
        }
        // isPlaying :false
    },
    forest: {
        mascotPrefix: "forest",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌿 Momochan's Enchanted Forest To-Do 🍃",
        stickers:["🌿", "🍃", "🌳", "🍄","🦊", "🦉", "🌺", "🪴"],
        backgroundMusic:"./audio/forest-bgm.mp3",
        isPlaying :false,
        voiceClips:{
            greeting: "./audio/voiceclips/konnichiwa.mp3",
            taskAdded: "./audio/voiceclips/Woah.mp3",
            taskCompleted: "./audio/voiceclips/Voicy_Nyanpasu.mp3",
            click: "./audio/voiceclips/tuturu_1.mp3",
        }
    },  
    dark: {
        mascotPrefix: "dark",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌙 Momochan's ✨ Shadow Realm Tasks",
        stickers:["🌙", "⭐", "🔮", "✨","🦇",  "🕯️", "🪄", "🌌"],
        backgroundMusic:"./audio/dark-bgm.mp3",
        isPlaying :false ,//state for bg music,
        voiceClips:{
            greeting: "./audio/voiceclips/konnichiwa.mp3",
            taskAdded: "./audio/voiceclips/tuturu_1.mp3",
            taskCompleted: "./audio/voiceclips/congrats.mp3",
            click: "./audio/voiceclips/click.mp3",
        }
    }  
};

class VoiceController {
    constructor() {
        this.currentVoice = new Audio();
        this.currentVoice.volume = 0.5;
        this.isMuted = localStorage.getItem('voiceMuted') === 'true';
        this.updateVoiceButton();
    }

    playVoiceClip(clipType, theme) {
        if (this.isMuted) return;
        
        const themeConfig = themes[theme.toLowerCase()];
        if (!themeConfig || !themeConfig.voiceClips || !themeConfig.voiceClips[clipType]) {
            console.error(`Voice clip not found for ${theme} - ${clipType}`);
            return;
        }
        this.currentVoice.pause();
        this.currentVoice.currentTime = 0;

        this.currentVoice.src = themeConfig.voiceClips[clipType];



        this.currentVoice.play().catch(error => {
            console.error('playback was blocked this is an error:', error);
            if (error.name === 'NotFoundError') {
                console.error('Audio file not found: ${themeConfig.voiceClips[clipType]}');


            }
        });
    }


    // toggleMute() {
    //     this.isMuted = !this.isMuted;
    //     localStorage.setItem('voiceMuted', this.isMuted);
        
    //     if (this.isMuted) {
    //         this.currentVoice.pause();
    //     }
    //     this.updateVoiceButton();
    // }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('toggleVoice');
        if (voiceBtn) {
            voiceBtn.textContent = this.isMuted ? '🔈' : '🔊';
        }
    }

}
class BackgroundMusicController{
    constructor(){
        this.bgMusic= new Audio();
        this.bgMusic.loop =  true;
        this.bgMusic.volume= 0.3;

        const savedMuteState = localStorage.getItem('isMuted')
        this.isMuted = savedMuteState === 'true';
        this.updateMusicButton();

        this.isMuted = localStorage.getItem('isMuted')==='true';
        this.setupMusicControls();
       

        // this.initializeAudio();
        if (!this.isMuted) {
            this.initializeAudio();
        }
    }

    initializeAudio(){
        const currentTheme =localStorage.getItem('preferred-theme') || 'kawaii';


        
        if (!this.isMuted) {
            this.playThemeMusic(currentTheme);
        } 
        // removed delayso it dest woait 3 s ecverythime
       
    }

   
    setupMusicControls() {
        const musicControls = document.createElement('div');
        musicControls.className = 'music-controls';
        musicControls.innerHTML = `
            <button id="toggleMusic" class="music-btn">
                ${this.isMuted ? '🔇' : '🎵'}
            </button>
            <button id="toggleVoice" class="voice-btn">
                ${voiceController.isMuted ? '🔈' : '🔊' }
            </button>
        `;
        document.querySelector('.mainapp').appendChild(musicControls);

        // Toggle button event listener
        document.getElementById('toggleMusic').onclick = () => this.toggleMute();
        document.getElementById('toggleVoice').onclick = () => voiceController.toggleMute();
    }

    playThemeMusic(theme){

        this.bgMusic.pause();

        const musicPath = themes[theme].backgroundMusic;

        if (this.isMuted) {
            return
        }

        if (this.bgMusic.src !== musicPath) {
            this.bgMusic.src = musicPath;
            this.bgMusic.load();
        }
        if (!this.isMuted) {
            // this.bgMusic.load();
            this.bgMusic.play()
                .catch(error => {
                    console.log('music autoplay blocked', error);
        });

        }

    }

    toggleMute(){
        this.isMuted =!this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);


        this.updateMusicButton();

        const toggleBtn = document.getElementById('toggleMusic');
        toggleBtn.textContent = this.isMuted ? '🔇' : '🎵';

        if (this.isMuted){
            this.bgMusic.pause();
        } else{
            const currentTheme = localStorage.getItem('preferred-theme') || 'kawaii';
            this.playThemeMusic(currentTheme);

            // if (this.bgMusic.readyState >= 2) { still not working 
            //     this.bgMusic.play()
            //         .catch(error => console.log('music playback bloaked:', error));

            // } else {
            //     this.bgMusic.addEventListener('canplaythrough', () => {
            //         this.bgMusic.play()
            //         .catch(error =>console.log('Music playback blocked:', error));
            //     }, { once : true});
            // }
       

        }
    }
// was supposed to start mute but still problems the button doesnt work as needed tried debugging stoll no avail

    updateMusicButton(){
        const toggleBtn=document.getElementById('toggleMusic');
        if (toggleBtn) {
            toggleBtn.textContent =this.isMuted ? '🔇' : '🎵';
            
        }
    }

    // setTimeout(() =>{
    //     if (!this.isMuted) {
    //         const currentTheme = localStorage.getItem('preffered-theme') || 'kawaii';
    //         this.playThemeMusic(currentTheme);
    //     }

    // }, 4000); diddnt work as intended
 
}

// timer or ther stopwatch for tasks anew featur i added but problem - msg not displaying 

let musicController;
let voiceController;


function saveTasksToLocalStorage() {
    const tasks =[];
    document.querySelectorAll('#taskList li.task').forEach(taskElement =>{
        const sticker =taskElement.querySelector('span').textContent.split('')[0];
        const text = taskElement.querySelector('span').textContent.slice(sticker.length +1);
        tasks.push({sticker, text});
    });
    console.log('Saving tasks:', tasks);
    localStorage.setItem('todo-tasks',JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks =localStorage.getItem('todo-tasks');
    if (savedTasks){
        const tasks=JSON.parse(savedTasks);
        console.log('Loading tasks:', tasks); 
        const taskList= document.getElementById('taskList');
        taskList.innerHTML='';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.sticker);
            taskList.appendChild(taskElement);
        });  


    }else {
        console.log('No saved tasks found'); 
    }
}


let selectedSticker;
let mascot;    
// mascot images loaded here the main pahe theme
let normalMascot = "images/kawaii-normal.png";
let addingTaskMascot = "images/kawaii-ready.png";
let removingTaskMascot = "images/kawaii-doing.png";
let currentTheme = 'kawaii';
let resetTimeout =null;

function updateMascotImages(theme) {
    const themeConfig = themes[theme.toLowerCase()];
    if (!themeConfig) {
        console.error(`Invalid theme: ${theme}`);
        return;  
    }
    
    normalMascot = `images/${themeConfig.mascotPrefix}-${themeConfig.normal}`;
    addingTaskMascot = `images/${themeConfig.mascotPrefix}-${themeConfig.ready}`;
    removingTaskMascot = `images/${themeConfig.mascotPrefix}-${themeConfig.doing}`;
}

function updateStickerPalette(themeName){
    const stickerContainer =document.querySelector('.sticker-container');
    if (!stickerContainer) return;
    stickerContainer.innerHTML='';

    themes[themeName].stickers.forEach(sticker=> {
        const stickerBtn= document.createElement("button");
        stickerBtn.className ='sticker';
        stickerBtn.textContent= sticker;


        if (stickerContainer.querySelectorAll('.sticker.active').length===0 &&
            sticker=== themes[themeName].stickers[0]) {
                stickerBtn.classList.add('active');
                selectedSticker =sticker;

            }
        stickerBtn.addEventListener('click',()=>{
            selectedSticker=sticker;
            document.querySelectorAll('.sticker').forEach(s => s.classList.remove('active'));
            stickerBtn.classList.add('active');
        });
        stickerContainer.appendChild(stickerBtn);

    });
}

function changeMascot(imgSrc, resetAfter = 30000) {
    if (!mascot) return;


    if (resetTimeout){
        clearTimeout(resetTimeout);
    }

    mascot.src = imgSrc;

    resetTimeout= setTimeout(() => {
        mascot.src = normalMascot;
        resetTimeout=null;
    }, resetAfter);
}

function switchTheme(themeName) {
    const normalizedTheme = themeName.toLowerCase();

    if (!themes[normalizedTheme]) {
        console.error(`Theme '${themeName}' not found. Available themes are: ${Object.keys(themes).join(', ')}`);
        return;
    }

    const allThemeClasses = Object.keys(themes).map(theme => `theme-${theme}`);
    document.body.classList.remove(...allThemeClasses);
    document.body.classList.add(`theme-${normalizedTheme}`);
    
    updateMascotImages(normalizedTheme);

    if (mascot && !resetTimeout) {
        mascot.src = normalMascot;
    }

    const header = document.querySelector('h1');
    if (header) {
        header.textContent = themes[normalizedTheme].headerText;
    }

    updateStickerPalette(normalizedTheme);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme.toLowerCase() === normalizedTheme) {
            btn.classList.add('active');
        }
    });

    currentTheme = normalizedTheme;
    localStorage.setItem('preferred-theme', normalizedTheme);

    if (musicController) {
        musicController.playThemeMusic(normalizedTheme);
    }
    // setTimeout(() =>{
    //     voiceController.playVoiceClip('greeting', normalizedTheme);
    // }) doing this so there no greeting on every theme change
}
class TaskTimer {
    constructor() {
        this.timers = new Map();
        this.notifications = new Map();
    }

    createTimerElement() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';
        timerContainer.innerHTML = `
            <input type="number" class="timer-input" min="1" max="180" placeholder="mins">
            <button class="timer-btn start">⏱️</button>
            <button class="timer-btn pause hidden">⏸️</button>
            <button class="timer-btn reset hidden">🔄</button>
            <span class="time-display">00:00</span>
        `;
        return timerContainer;
    }

    attachTimer(taskElement) {
        const timerContainer = this.createTimerElement();
        const timeInput = timerContainer.querySelector('.timer-input');
        const startBtn = timerContainer.querySelector('.start');
        const pauseBtn = timerContainer.querySelector('.pause');
        const resetBtn = timerContainer.querySelector('.reset');
        const display = timerContainer.querySelector('.time-display');

        let timeLeft = 0;
        let timerId = null;
        let isPaused = false;

        const updateDisplay = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        const startTimer = () => {
            if (!timeLeft && timeInput.value) {
                timeLeft = parseInt(timeInput.value) * 60;
            }

            if (timeLeft <= 0) return;

            timeInput.classList.add('hidden');
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            resetBtn.classList.remove('hidden');

            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerId);
                    this.timeUp(taskElement);
                }
            }, 1000);
        };

        const pauseTimer = () => {
            clearInterval(timerId);
            isPaused = true;
            pauseBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
        };

        const resetTimer = () => {
            clearInterval(timerId);
            timeLeft = 0;
            display.textContent = '00:00';
            timeInput.value = '';
            timeInput.classList.remove('hidden');
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            resetBtn.classList.add('hidden');
        };

        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        taskElement.insertBefore(timerContainer, taskElement.querySelector('.delete'));
    }

    timeUp(taskElement) {
        const currentTheme = localStorage.getItem('preferred-theme') || 'kawaii';
        voiceController.playVoiceClip('taskCompleted', currentTheme);

        if (Notification.permission === 'granted') {
            const taskText = taskElement.querySelector('span').textContent;
            new Notification('Momochans sure the times finished', {
                body: `tuturu times up for the task: ${taskText}`,
                icon: normalMascot
            });
        }

        taskElement.style.animation = 'pulse 0.5s ease-in-out 3';
        setTimeout(() => {
            taskElement.style.animation = '';
        }, 1500);
    }
}

function createTaskElement(taskText, selectedSticker) {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `
        <span>${selectedSticker} ${taskText}</span>
        <button class="delete">🗑️</button>
    `;

    const taskTimer = new TaskTimer();
    taskTimer.attachTimer(li);

    li.querySelector('.delete').addEventListener('click', function() {
        const currentTheme = localStorage.getItem('preferred-theme') || 'kawaii';
        li.style.animation = 'sparkle 0.5s ease-out';
        setTimeout(() => {
            li.remove();
            changeMascot(removingTaskMascot);
            voiceController.playVoiceClip('taskCompleted', currentTheme);
            saveTasksToLocalStorage();
        }, 500);
    });

    return li;
}

// code here used below so its a mistake
//     const li = document.createElement("li");
//     li.className = "task";
//     li.innerHTML = `
//         <span>${selectedSticker} ${taskText}</span>
//         <button class="delete">🗑️</button>
//     `;
    
//     li.querySelector('.delete').addEventListener('click', function() {
//         li.style.animation = 'sparkle 0.5s ease-out';
//         setTimeout(() => {
//             li.remove();
//             changeMascot(removingTaskMascot);
//             changeMascot(removingTaskMascot);
//             voiceController.playVoiceClip('taskCompleted',currentTheme);
//             saveTasksToLocalStorage();
//         }, 500);
//     });
    
//     return li;
// }

function initializeApp() {
    mascot = document.getElementById("mascot");
    voiceController = new VoiceController();
    // voiceController.playVoiceClip('click', currentTheme);
   

    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    


    let savedTheme = localStorage.getItem('preferred-theme') || 'kawaii';
    savedTheme = savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1).toLowerCase();

    musicController = new BackgroundMusicController();

    setTimeout(()=>{
        voiceController.playVoiceClip('greeting', currentTheme);

    }, 1000);

    selectedSticker = themes[currentTheme].stickers[0];

    updateStickerPalette(currentTheme);
    loadTasksFromLocalStorage();

    console.log('Task list element:', taskList);
    console.log('Initial tasks:', document.querySelectorAll('#taskList li.task'));



    document.querySelectorAll('.sticker').forEach(sticker => {
        sticker.addEventListener('click', () => {
            selectedSticker = sticker.textContent;
            document.querySelectorAll('.sticker').forEach(s => s.classList.remove('active'));
            sticker.classList.add('active');
        });
    });
    
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText, selectedSticker);
            taskList.appendChild(taskElement);
            taskInput.value = "";
            changeMascot(addingTaskMascot);
            voiceController.playVoiceClip('taskAdded',currentTheme);
            console.log('Adding task:', taskText, 'with sticker:', selectedSticker);
            saveTasksToLocalStorage();
        }
    });
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                const taskElement = createTaskElement(taskText, selectedSticker);
                taskList.appendChild(taskElement);
                taskInput.value = "";
                changeMascot(addingTaskMascot);
                saveTasksToLocalStorage();
            }
        }
    });
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const theme =btn.dataset.theme;
        if (!theme){
            console.error('theme btn miss atribute:',btn);
            return;
        }
        btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
    });
    
   

    switchTheme(savedTheme);
    
    
}

document.addEventListener('DOMContentLoaded', initializeApp);