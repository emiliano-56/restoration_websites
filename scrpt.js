
const programGrid = document.getElementById("programGrid");
const programItems = document.querySelectorAll("#programList li");
const sectionTitle = document.getElementById("sectionTitle");
const searchInput = document.getElementById("courseSearch");

let currentCategory = "all";
let currentPage = 1;
let totalPages = 1;
let currentSearch = "";

let searchTimeout;


// =========================
// FETCH COURSES
// =========================
async function fetchCourses(category = "all", page = 1, search = "") {

    let url = `http://127.0.0.1:8000/api/courses/filter?category=${category}&page=${page}&limit=4&search=${encodeURIComponent(search)}`;

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

                <!-- IMAGE -->
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

                <!-- VIDEO LINK -->
                <a href="${course.video_url}" target="_blank" style="display:block;margin-bottom:10px;">
                    Watch Intro Video →
                </a>

                <!-- ✅ FIXED DETAIL PAGE LINK -->
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

    paginationDiv.innerHTML += `
        <button ${pagination.page === 1 ? "disabled" : ""} id="prevBtn">
            Prev
        </button>
    `;

    paginationDiv.innerHTML += `
        <span>Page ${pagination.page} of ${pagination.total_pages}</span>
    `;

    paginationDiv.innerHTML += `
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
// FILTER CLICK
// =========================
programItems.forEach(item => {
    item.addEventListener("click", () => {

        programItems.forEach(li => li.classList.remove("active"));
        item.classList.add("active");

        currentCategory = item.dataset.category;
        currentPage = 1;

        sectionTitle.textContent = item.textContent;

        fetchCourses(currentCategory, currentPage, currentSearch);
    });
});


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
fetchCourses(currentCategory, currentPage, currentSearch);

