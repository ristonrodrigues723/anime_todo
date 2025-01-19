const themes = {
    kawaii: {
        mascotPrefix: "kawaii",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌸 Momochan's kawaii To-Do List 🌸",
        stickers:["🌸", "🎀", "⭐", "🌟","🦄", "🌈", "🪄", "💖"],
        backgroundMusic:"./audio/kawaii-bgm.mp3",
        // mascotVoices:{
        //     greeting:""
        // }

    },
    cyberpunk: {
        mascotPrefix: "cyber",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"⚡Momochan's CyberTask Command Center ⚡",
        stickers:["⚡", "🤖", "💻", "🎮", "🔧", "💾", "📡", "🕹️"],
        backgroundMusic:"./audio/cyber-bgm.mp3",
    },
    forest: {
        mascotPrefix: "forest",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌿 Momochan's Enchanted Forest To-Do 🍃",
        stickers:["🌿", "🍃", "🌳", "🍄","🦊", "🦉", "🌺", "🪴"],
        backgroundMusic:"./audio/forest-bgm.mp3",
    },  
    dark: {
        mascotPrefix: "dark",
        normal: "normal.png",
        ready: "ready.png",
        doing: "doing.png",
        headerText:"🌙 Momochan's ✨ Shadow Realm Tasks",
        stickers:["🌙", "⭐", "🔮", "✨","🦇",  "🕯️", "🪄", "🌌"],
        backgroundMusic:"./audio/dark-bgm.mp3"
    }  
};
class backgroundMusicController{
    constructor(){
        this.bgMusic= new Audio();
        this.bgMusic.loop =  true;
        this.bgMusic.volume= 0.3;

        this.isMuted = localStorage.getItem('isMuted')==='true';
        this.setupMusicControls();
        this.updateMusicButton();
    }


   
    setupMusicControls() {
        const musicControls = document.createElement('div');
        musicControls.className = 'music-controls';
        musicControls.innerHTML = `
            <button id="toggleMusic" class="music-btn">
                ${this.isMuted ? '🔇' : '🎵'}
            </button>
        `;
        document.querySelector('.mainapp').appendChild(musicControls);

        // Toggle button event listener
        document.getElementById('toggleMusic').onclick = () => this.toggleMute();
    }

    playThemeMusic(theme){
        const musicPath = themes[theme].backgroundMusic;
        if (this.bgMusic.src !== musicPath) {
            this.bgMusic.src = musicPath;
        }
        if (!this.isMuted) {
            this.bgMusic.play().catch(e => console.log('music autoplay blocked'));

        }

    }
    toggleMute(){
        this.isMuted =!this.isMuted;
        localStorage.setItem('isMuted',this.isMuted);

        const toggleBtn = document.getElementById('toggleMusic');
        toggleBtn.textContent = this.isMuted ? '🔇' : '🎵';

        if (this.isMuted){
            this.bgMusic.pause();
        } else{

            if (this.bgMusic.readyState>= 2) {
                this.bgMusic.play().catch(e => console.log('music playback bloaked', e));

            } else {
                this.bgMusic.addEventListener('canplaythrough', () => {
                    this.bgMusic.play().catch(e =>console.log('Music playback blocked'));
                }, { once : true});
            }
       

        }
    }

    updateMusicButton(){
        const toggleBtn=document.getElementById('toggleMusic');
        if (toggleBtn) {
            toggleBtn.textContent =this.isMuted ? '🔇' : '🎵';
            
        }
    }

}


let musicController;



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
        console.log('No saved tasks found'); // Debug line
    }
}


let selectedSticker;
let mascot;    
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
    musicController.playThemeMusic(normalizedTheme);
}


function createTaskElement(taskText, selectedSticker) {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `
        <span>${selectedSticker} ${taskText}</span>
        <button class="delete">🗑️</button>
    `;
    
    li.querySelector('.delete').addEventListener('click', function() {
        li.style.animation = 'sparkle 0.5s ease-out';
        setTimeout(() => {
            li.remove();
            changeMascot(removingTaskMascot);
            saveTasksToLocalStorage();
        }, 500);
    });
    
    return li;
}

function initializeApp() {
    mascot = document.getElementById("mascot");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");


    let savedTheme = localStorage.getItem('preferred-theme') || 'kawaii';
    savedTheme = savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1).toLowerCase();

    musicController = new backgroundMusicController();


    selectedSticker = themes[currentTheme].stickers[0];

    updateStickerPalette(currentTheme);
    loadTasksFromLocalStorage();

    console.log('Task list element:', taskList);
    console.log('Initial tasks:', document.querySelectorAll('#taskList li.task'));

    document.addEventListener('DOMContentLoaded', () => {
        musicController=new backgroundMusicController();
        initializeApp();
    })
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
    
    musicController.playThemeMusic(currentTheme)
}

document.addEventListener('DOMContentLoaded', initializeApp);