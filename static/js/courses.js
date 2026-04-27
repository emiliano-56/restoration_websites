const programGrid = document.getElementById("programGrid");
const sectionTitle = document.getElementById("sectionTitle");
const searchInput = document.getElementById("courseSearch");

let currentCategory = "all";
let currentPage = 1;
let totalPages = 1;
let currentSearch = "";

let searchTimeout;
let categoryPage = 1;
let categoryTotalPages = 1;

// =========================
// LOAD CATEGORIES (DYNAMIC)
// =========================
async function loadCategories(page = 1) {
    try {
        const res = await fetch(`https://restoration-websites.onrender.com/api/categories?page=${page}&limit=5`);
        const result = await res.json();

        const programList = document.getElementById("programList");

        categoryTotalPages = result.pagination.total_pages;
        categoryPage = result.pagination.page;

        // reset list
        programList.innerHTML = `
            <li class="active" data-category="all">All Programs</li>
        `;

        // ALL click
        const allItem = programList.querySelector("li");
        allItem.addEventListener("click", () => {

            document.querySelectorAll("#programList li")
                .forEach(el => el.classList.remove("active"));

            allItem.classList.add("active");

            currentCategory = "all";
            currentPage = 1;
            sectionTitle.textContent = "All Programs";

            fetchCourses(currentCategory, currentPage, currentSearch);
        });

        // categories
        result.data.forEach(cat => {

            const li = document.createElement("li");
            li.textContent = cat.charAt(0).toUpperCase() + cat.slice(1) + " Programs";
            li.dataset.category = cat;

            li.addEventListener("click", () => {

                document.querySelectorAll("#programList li")
                    .forEach(el => el.classList.remove("active"));

                li.classList.add("active");

                currentCategory = cat;
                currentPage = 1;
                sectionTitle.textContent = li.textContent;

                fetchCourses(currentCategory, currentPage, currentSearch);
            });

            programList.appendChild(li);
        });

        renderCategoryPagination();

    } catch (err) {
        console.error("Error loading categories:", err);
    }
}


function renderCategoryPagination() {

    let existing = document.getElementById("categoryPagination");
    if (existing) existing.remove();

    const programList = document.getElementById("programList");

    const div = document.createElement("div");
    div.id = "categoryPagination";
    div.style.marginTop = "15px";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";

    div.innerHTML = `
        <button id="catPrev" ${categoryPage === 1 ? "disabled" : ""}>Prev</button>
        <span>Page ${categoryPage} of ${categoryTotalPages}</span>
        <button id="catNext" ${categoryPage === categoryTotalPages ? "disabled" : ""}>Next</button>
    `;

    programList.appendChild(div);

    document.getElementById("catPrev").addEventListener("click", () => {
        if (categoryPage > 1) {
            loadCategories(categoryPage - 1);
        }
    });

    document.getElementById("catNext").addEventListener("click", () => {
        if (categoryPage < categoryTotalPages) {
            loadCategories(categoryPage + 1);
        }
    });
}

// =========================
// FETCH COURSES
// =========================
async function fetchCourses(category = "all", page = 1, search = "") {

    let url = `https://restoration-websites.onrender.com/api/courses/filter?category=${category}&page=${page}&limit=4&search=${encodeURIComponent(search)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        renderCourses(result.data || []);
        renderPagination(result.pagination || { page: 1, total_pages: 1 });

        totalPages = result.pagination?.total_pages || 1;

    } catch (error) {
        console.error("Error fetching courses:", error);
        programGrid.innerHTML = "<p>Failed to load courses.</p>";
    }
}


// =========================
// RENDER COURSES
// =========================
function renderCourses(courses) {
    programGrid.innerHTML = "";

    if (!courses || courses.length === 0) {
        programGrid.innerHTML = "<p>No courses found.</p>";
        return;
    }

    courses.forEach(course => {
        programGrid.innerHTML += `
            <div class="program-card">

                <img 
                    src="${course.image_url}" 
                    alt="${course.title}"
                    style="width:100%;border-radius:10px;margin-bottom:15px;"
                />

                <div class="icon-circle">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>

                <h3>${course.title}</h3>
                <p>${course.description}</p>

                <ul>
                    <li>${course.duration}</li>
                    <li>${course.mode}</li>
                    <li>${course.level}</li>
                </ul>

                <a href="${course.video_url}" target="_blank" style="display:block;margin-bottom:10px;">
                    Watch Intro Video →
                </a>

                <a href="/courses?id=${course.id}">
                    Learn More →
                </a>

            </div>
        `;
    });
}


// =========================
// PAGINATION UI
// =========================
function renderPagination(pagination) {

    let existing = document.getElementById("pagination");
    if (existing) existing.remove();

    const paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination";
    paginationDiv.style.marginTop = "20px";
    paginationDiv.style.display = "flex";
    paginationDiv.style.gap = "10px";
    paginationDiv.style.alignItems = "center";

    paginationDiv.innerHTML = `
        <button ${pagination.page === 1 ? "disabled" : ""} id="prevBtn">
            Prev
        </button>

        <span>Page ${pagination.page} of ${pagination.total_pages}</span>

        <button ${pagination.page === pagination.total_pages ? "disabled" : ""} id="nextBtn">
            Next
        </button>
    `;

    programGrid.appendChild(paginationDiv);

    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCourses(currentCategory, currentPage, currentSearch);
        }
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentPage < pagination.total_pages) {
            currentPage++;
            fetchCourses(currentCategory, currentPage, currentSearch);
        }
    });
}


// =========================
// SEARCH INPUT
// =========================
searchInput.addEventListener("input", function () {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        currentSearch = this.value;
        currentPage = 1;

        fetchCourses(currentCategory, currentPage, currentSearch);
    }, 300);
});


// =========================
// INITIAL LOAD
// =========================
loadCategories(1);
fetchCourses(currentCategory, currentPage, currentSearch);