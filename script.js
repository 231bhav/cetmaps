//search
function searchFunction() {
    console.log("js working");
    
    let input = document.getElementById("searchBox").value.toLowerCase();
    let items = document.querySelectorAll(".eventList li ul li, #Common .eventList li");//class target

    // prev remove highlights
    items.forEach(item => item.classList.remove("highlight"));

    // search and scroll
    for (let i = 0; i < items.length; i++) {
        let text = items[i].firstChild.textContent.toLowerCase();

        if (text.includes(input) && input !== "") {
            items[i].classList.add("highlight");
            items[i].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            break;
        }
    }
}

// form
const form = document.getElementById("eventForm");

let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = -1;

//login
function login() {
    const password = prompt("Enter admin password:");

    if (password === "ad") {
        alert("welcome");
        form.style.display = "block";
    } else {
        alert("Wrong pass");
    }
}

function checkAdmin() {
    const password = prompt("Enter admin password:");

    if (password === "ad") {
        return true;
    } else {
        alert("Access denied");
        return false;
    }
}

// display
function displayEvents() {
    // remove old events
    document.querySelectorAll(".eventItem").forEach(e => e.remove());

    events.forEach((e, index) => {
        const section = document.getElementById(e.department);
        if (!section) return;

        // get ONLY classroom nodes (no floors)
        let rooms = Array.from(section.querySelectorAll("li"))
            .filter(li => !li.querySelector("ul"));

        rooms.forEach(roomItem => {
            const roomName = roomItem.textContent.split("👉")[0].trim();

            if (roomName.toLowerCase() === e.room.toLowerCase()) {

                const eventDiv = document.createElement("div");
                eventDiv.classList.add("eventItem");

                eventDiv.innerHTML = `
                    👉 ${e.name} (${e.date})
                    <button onclick="editEvent(${index})">✏️</button>
                    <button onclick="deleteEvent(${index})">❌</button>
                `;

                roomItem.appendChild(eventDiv);
            }
        });
    });
}

// add
form.onsubmit = function(e) {
    e.preventDefault();

    const newEvent = {
        name: document.getElementById("eventName").value.trim(),
        department: document.getElementById("department").value,
        room: document.getElementById("roomCode").value.trim(),
        date: document.getElementById("date").value,
        floor: document.getElementById("department").value === "Common" ? null : document.getElementById("floor").value   
    };

    if (editIndex === -1) {
        events.push(newEvent);
    } else {
        events[editIndex] = newEvent;
        editIndex = -1;
    }

    localStorage.setItem("events", JSON.stringify(events));
    form.reset();
    displayEvents();
};

//del
function deleteEvent(index) {
    if (!checkAdmin()) return;

    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
}

// edit
function editEvent(index) {
    if (!checkAdmin()) return;

    const e = events[index];

    document.getElementById("eventName").value = e.name;
    document.getElementById("department").value = e.department;
    document.getElementById("roomCode").value = e.room;
    document.getElementById("date").value = e.date;
    document.getElementById("floor").value = e.floor;

    form.style.display = "block";
    editIndex = index;
}

//load
displayEvents();