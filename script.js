document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const stickers = document.querySelectorAll(".sticker");
    const mascot = document.getElementById("mascot");
    let selectedSticker = "🌟";

   
    const normalMascot = "normal.png";  
    const addingTaskMascot = "ready.png";
    const removingTaskMascot = "doing.png";

    // Function to change mascot image temporarily
    function changeMascot(imgSrc, resetAfter = 1500) {
        mascot.src = imgSrc;
        setTimeout(() => {
            mascot.src = normalMascot;
        }, resetAfter);
    }

    // Add task to the list
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement("li");
            li.className = "task";
            // Added delete functionality directly in HTML
            li.innerHTML = `
                <span>${selectedSticker} ${taskText}</span>
                <button class="delete" onclick="
                    this.parentElement.style.animation = 'sparkle 0.5s ease-out';
                    setTimeout(() => {
                        this.parentElement.remove();
                        document.getElementById('mascot').src='${removingTaskMascot}';
                        setTimeout(() => document.getElementById('mascot').src='${normalMascot}', 1500);
                    }, 500);
                ">🗑️</button>
            `;
            taskList.appendChild(li);
            taskInput.value = "";
    
            // Change mascot to adding task
            changeMascot(addingTaskMascot);
        }
    });
    // Change sticker
    stickers.forEach((sticker) => {
        sticker.addEventListener("click", () => {
            selectedSticker = sticker.textContent;
            stickers.forEach((s) => s.classList.remove("active"));
            sticker.classList.add("active");
        });
    });
});
