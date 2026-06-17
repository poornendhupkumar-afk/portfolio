fetch("projects.json")
.then(response => response.json())
.then(projects => {

    const container =
        document.getElementById("project-container");

    projects.forEach(project => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description || "No description"}</p>

            <a href="${project.url}" target="_blank">
                View Repository
            </a>

            <p>⭐ ${project.stars}</p>
        `;

        container.appendChild(card);

    });

});
fetch("projects.json")
.then(response => response.json())
.then(projects => {

const container =
document.getElementById("project-container");

projects.forEach(project => {

container.innerHTML += `

<div class="project-card">

<h3>${project.name}</h3>

<p>${project.description || "No description"}</p>

<a href="${project.html_url}">
View Project
</a>

</div>

`;

});

});
const images =
document.querySelectorAll(".certificate-image");

const modal =
document.getElementById("modal");

const modalImg =
document.getElementById("modal-img");

images.forEach(img=>{

img.addEventListener("click",()=>{

modal.style.display="flex";

modalImg.src = img.src;

});

});

modal.addEventListener("click",()=>{

modal.style.display="none";

});