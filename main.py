from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Static files (CSS, JS, Images, Videos)
app.mount("/static", StaticFiles(directory="static"), name="static")

# HTML templates folder
templates = Jinja2Templates(directory="templates")


# Home Page
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Restoration Bible College & Seminary"
        }
    )







