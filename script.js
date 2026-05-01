let data = JSON.parse(localStorage.getItem("study")) || { subjects: [] };
let current = null;

// Salvar
function save() {
    localStorage.setItem("study", JSON.stringify(data));
    render();
}

// Criar matéria
function createSubject() {
    let name = prompt("Nome da matéria:");
    if (!name) return;

    data.subjects.push({ id: Date.now(), name, topics: [] });
    save();
}

// Mostrar matéria
function openSubject(id) {
    current = data.subjects.find(s => s.id === id);
    render();
}

// Criar tópico
function addTopic() {
    let name = prompt("Nome do tópico:");
    if (!name) return;

    current.topics.push({ id: Date.now(), name, files: [] });
    save();
}

// Upload PDF
function upload(topicId) {
    document.getElementById("fileInput").onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = () => {
            let topic = current.topics.find(t => t.id === topicId);
            topic.files.push({
                name: file.name,
                data: reader.result
            });
            save();
        };

        reader.readAsDataURL(file);
    };

    document.getElementById("fileInput").click();
}

// Abrir PDF
function openPDF(file) {
    let win = window.open();
    win.document.write(`<iframe src="${file.data}" width="100%" height="100%"></iframe>`);
}

// Renderizar
function render() {
    let list = document.getElementById("subject-list");
    list.innerHTML = "";

    data.subjects.forEach(s => {
        let li = document.createElement("li");
        li.textContent = s.name;
        li.onclick = () => openSubject(s.id);
        list.appendChild(li);
    });

    let topicsDiv = document.getElementById("topics");

    if (!current) {
        topicsDiv.innerHTML = "<p>Crie uma matéria</p>";
        return;
    }

    document.getElementById("title").innerText = current.name;

    topicsDiv.innerHTML = `<button onclick="addTopic()">+ Tópico</button>`;

    current.topics.forEach(t => {
        let div = document.createElement("div");
        div.className = "topic";

        div.innerHTML = `
            <h3>${t.name}</h3>
            <button onclick="upload(${t.id})">Adicionar PDF</button>
        `;

        t.files.forEach(f => {
            let p = document.createElement("p");
            p.textContent = f.name;
            p.onclick = () => openPDF(f);
            div.appendChild(p);
        });

        topicsDiv.appendChild(div);
    });
}

render();
