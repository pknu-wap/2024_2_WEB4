from fastapi import FastAPI, Cookie, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import os
import uuid

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

UPLOAD_FOLDER = "./uploads/"

@app.post("/ganz/upload/")
async def upload_images(response: Response, files: List[UploadFile] = File(...), session_id: str = Cookie(None)):
    # 세션 ID가 없으면 생성하여 쿠키에 저장
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id)

    if len(files) != 2:
        return {"error": "You must upload exactly two images."}
    
    # 사용자별 디렉터리 생성
    user_folder = os.path.join(UPLOAD_FOLDER, session_id)
    os.makedirs(user_folder, exist_ok=True)

    file_paths = []

    for file in files:
        file_contents = await file.read()
        unique_filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
        file_location = os.path.join(user_folder, unique_filename)
        with open(file_location, "wb") as buffer:
            buffer.write(file_contents)
        
        file_paths.append(file_location)

    return {"message": "Files successfully uploaded"}
