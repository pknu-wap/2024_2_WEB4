import hashlib
import os
from fastapi import FastAPI, File, UploadFile
from typing import List

app = FastAPI()

UPLOAD_FOLDER = "./uploads/"

@app.post("/ganz/upload/")
async def upload_images(files: List[UploadFile] = File(...)):
    if len(files) != 2:
        return {"error": "You must upload exactly two images."}
    
    file_paths = []

    for file in files:
        file_contents = await file.read()  
        file_hash = hashlib.md5(file_contents).hexdigest() # 해시 값 사용 
        file_extension = os.path.splitext(file.filename)[1] # 확장자 
        unique_filename = f"{file_hash}{file_extension}"  
        # 파일 경로 생성 및 저장
        file_location = os.path.join(UPLOAD_FOLDER, unique_filename)  
        with open(file_location, "wb") as buffer:
            buffer.write(file_contents)  
        
        file_paths.append(file_location)

    return {"message": "Files successfully uploaded", "file_paths": file_paths}