from fastapi import FastAPI, Request, Query
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")


# =====================================
# SAMPLE COURSE DATABASE
# =====================================

courses = [
    {
        "id": 1,
        "title": "Certificate in Biblical Studies",
        "category": "certificate",
        "duration": "1 Year Program",
        "mode": "Online & On-campus",
        "level": "Foundational Studies",
        "description": "Build a strong foundation in the Word of God and Christian doctrines.",
        "image_url": "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        "overview": "This program introduces students to the Bible, theology, and Christian living.",
        "curriculum": [
            "Old Testament Survey",
            "New Testament Survey",
            "Introduction to Theology",
            "Christian Ethics"
        ],
        "career_paths": [
            "Church Worker",
            "Mission Assistant",
            "Bible Study Leader"
        ]
    },

    {
        "id": 2,
        "title": "Diploma in Ministry",
        "category": "diploma",
        "duration": "2 Year Program",
        "mode": "Online & On-campus",
        "level": "Ministry Focused",
        "description": "Practical training for effective ministry and church leadership.",
        "image_url": "https://images.unsplash.com/photo-1507692049790-de58290a4334",
        "overview": "Designed to equip students for hands-on ministry work in churches and ministries.",
        "curriculum": [
            "Homiletics",
            "Pastoral Care",
            "Leadership in Ministry",
            "Church Administration"
        ],
        "career_paths": [
            "Pastor Assistant",
            "Church Administrator",
            "Evangelist"
        ]
    },

    {
        "id": 3,
        "title": "Ministry Leadership Training",
        "category": "leadership",
        "duration": "1 Year Program",
        "mode": "On-campus & Online",
        "level": "Leadership Development",
        "description": "Equip leaders with spiritual and administrative skills for effective ministry.",
        "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "overview": "Focuses on leadership principles, spiritual growth, and ministry impact.",
        "curriculum": [
            "Leadership Principles",
            "Spiritual Formation",
            "Team Building",
            "Conflict Resolution"
        ],
        "career_paths": [
            "Ministry Leader",
            "Church Coordinator",
            "Team Leader"
        ]
    },

    {
        "id": 4,
        "title": "Church Planting & Missions",
        "category": "ministry",
        "duration": "2 Year Program",
        "mode": "Hybrid Learning",
        "level": "Mission Focused",
        "description": "Prepare for evangelism, missions, and church planting.",
        "image_url": "https://images.unsplash.com/photo-1509099836639-18ba1795216d",
        "overview": "Covers evangelism strategies, missions, and global outreach.",
        "curriculum": [
            "Evangelism Strategies",
            "Mission Theology",
            "Church Planting",
            "Cultural Engagement"
        ],
        "career_paths": [
            "Missionary",
            "Church Planter",
            "Evangelist"
        ]
    },

    {
        "id": 5,
        "title": "Online Certificate in Christian Leadership",
        "category": "online",
        "duration": "6 Months Program",
        "mode": "Fully Online",
        "level": "Flexible Learning",
        "description": "Designed for busy professionals seeking leadership training.",
        "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        "overview": "Flexible online learning with practical leadership insights.",
        "curriculum": [
            "Leadership Foundations",
            "Ethics in Leadership",
            "Decision Making",
            "Communication Skills"
        ],
        "career_paths": [
            "Team Leader",
            "Church Volunteer Leader",
            "Coordinator"
        ]
    },

    {
        "id": 6,
        "title": "Bachelor of Biblical Studies",
        "category": "undergraduate",
        "duration": "4 Year Program",
        "mode": "On-campus & Online",
        "level": "Degree Program",
        "description": "Comprehensive study of Scripture, theology, and ministry.",
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        "overview": "A full undergraduate program covering biblical and theological studies.",
        "curriculum": [
            "Biblical Interpretation",
            "Systematic Theology",
            "Church History",
            "Apologetics"
        ],
        "career_paths": [
            "Pastor",
            "Teacher",
            "Missionary"
        ]
    },

    {
        "id": 7,
        "title": "Master of Theology",
        "category": "graduate",
        "duration": "2 Year Program",
        "mode": "On-campus",
        "level": "Advanced Studies",
        "description": "Advanced theological training for scholars and ministry leaders.",
        "image_url": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        "overview": "Deep exploration of theology, doctrine, and research.",
        "curriculum": [
            "Advanced Theology",
            "Biblical Languages",
            "Research Methods",
            "Doctrinal Studies"
        ],
        "career_paths": [
            "Theologian",
            "Lecturer",
            "Senior Pastor"
        ]
    },

    {
        "id": 8,
        "title": "Christian Counseling Program",
        "category": "counseling",
        "duration": "1 Year Program",
        "mode": "On-campus & Online",
        "level": "Practical Ministry",
        "description": "Train to provide biblical counseling and emotional support.",
        "image_url": "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
        "overview": "Combines psychology and biblical principles for counseling.",
        "curriculum": [
            "Introduction to Counseling",
            "Biblical Psychology",
            "Family Counseling",
            "Crisis Intervention"
        ],
        "career_paths": [
            "Counselor",
            "Youth Mentor",
            "Family Advisor"
        ]
    }
]



# =====================================
# HOME PAGE
# =====================================

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Restoration Bible College & Seminary"
        }
    )


# =====================================
# COURSES PAGE
# =====================================

@app.get("/courses")
def course(request: Request, id: int = None):

    selected_course = None

    if id is not None:
        selected_course = next((c for c in courses if c["id"] == id), None)

    return templates.TemplateResponse(
        "course.html",
        {
            "request": request,
            "title": "Course Details",
            "course": selected_course
        }
    )

# =====================================
# API: GET ALL COURSES
# =====================================

@app.get("/api/courses")
def get_courses():
    return {
        "success": True,
        "data": courses
    }

@app.get("/api/categories")
def get_categories(page: int = 1, limit: int = 5):

    categories = sorted(list(set(course["category"] for course in courses)))

    total = len(categories)
    start = (page - 1) * limit
    end = start + limit

    paginated = categories[start:end]

    return {
        "success": True,
        "data": paginated,
        "pagination": {
            "page": page,
            "total_pages": (total + limit - 1) // limit
        }
    }
# =====================================
# API: FILTER COURSES
# =====================================

@app.get("/api/courses/filter")
def filter_courses(
    category: str = Query(default=None),
    page: int = Query(default=1),
    limit: int = Query(default=4),
    search: str = Query(default=None)
):
    filtered = courses

    # CATEGORY FILTER
    if category and category != "all":
        filtered = [
            course for course in filtered
            if course["category"].lower() == category.lower()
        ]

    # SEARCH FILTER (THIS WAS MISSING)
    if search and search.strip() != "":
        search = search.lower().strip()

        filtered = [
            course for course in filtered
            if search in course["title"].lower()
            or search in course["description"].lower()
            or search in course["category"].lower()
        ]

    # PAGINATION LOGIC
    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit

    paginated_data = filtered[start:end]

    return {
        "success": True,
        "data": paginated_data,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    }
    
    