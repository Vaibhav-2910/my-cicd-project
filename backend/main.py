from fastapi import FastAPI
app = FastAPI()
@app.get("/api/message")
def get_message():
    return {"message": "CI/CD Pipeline Successful! 🚀   Backend connected succesfully"}
