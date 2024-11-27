from fastapi import FastAPI, Cookie, File, UploadFile, Response, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback
from PIL import Image
from fastapi.responses import FileResponse

from typing import List
import os
import uuid
import torch
from detect import detect_hair
import numpy as np

import sys

ai_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../AI'))
sys.path.append(ai_path)

from hair_swap import HairFast, get_parser
import cv2

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # 허용할 출처
    allow_origins=["http://localhost:12732"],  # 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

UPLOAD_FOLDER = "./uploads/"
RESULTS_FOLDER = './results/'

@app.post("/ganz/upload/")
async def upload_images(response: Response, files: List[UploadFile] = File(...), session_id: str = Cookie(None)):
    # 세션 ID가 없으면 생성하여 쿠키에 저장
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id)

    # 파일 개수가 2개 또는 3개인지 확인
    if len(files) != 2 and len(files) != 3:
        return {"error": "You must upload exactly two or three images."}
    
    # 사용자별 디렉터리 생성
    user_folder = os.path.join(UPLOAD_FOLDER, session_id)
    os.makedirs(user_folder, exist_ok=True)

    file_paths = []

    for file in files:
        # Save the uploaded file
        file_contents = await file.read()
        unique_filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
        file_location = os.path.join(user_folder, unique_filename)
        
        with open(file_location, "wb") as buffer:
            buffer.write(file_contents)
        
        detect_hair(file_location, file_location)
        file_paths.append(file_location)
        print(file_paths)

    return {"message": "Files successfully uploaded and processed.", "file_location": file_paths}

class ImagePaths(BaseModel):
    face_img: str
    shape_img: str
    color_img: str

@app.post("/ganz/inference/")
async def inference(image_paths: ImagePaths, session_id: str = Cookie('session_id')):
    if not session_id:
        return {"error": "Session ID is missing. Please upload images first."}

    # 업로드된 이미지 경로
    face_img = image_paths.face_img
    shape_img = image_paths.shape_img
    color_img = image_paths.color_img
    img_path = face_img.split('/')
    print("Face Image Path Parts:", img_path[2])

    print("image done")
    try:
        # 이미지 로드
        face_img_data = cv2.imread(os.path.abspath(face_img))
        shape_img_data = cv2.imread(os.path.abspath(shape_img))
        color_img_data = cv2.imread(os.path.abspath(color_img))

        if face_img_data is None or shape_img_data is None or color_img_data is None:
            return {"error": "One or more images could not be loaded."}
        
        results_folder = os.path.join(RESULTS_FOLDER, img_path[2])
        os.makedirs(results_folder, exist_ok=True)
        result_path = os.path.join(results_folder, "result.jpg")
        
        # AI 처리
        ai_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../AI'))
        os.chdir(ai_dir)

        hair_fast = HairFast(get_parser().parse_args([]))

        result = hair_fast.swap(face_img_data, shape_img_data, color_img_data, benchmark=False, exp_name=None)
        print("inference done")
        os.chdir(os.path.abspath(os.path.dirname(__file__)))
                
        result = result.permute(1, 2, 0).cpu().numpy()  

        result_rgb = np.clip(result * 255, 0, 255).astype(np.uint8)

        result_rgb = cv2.cvtColor(result_rgb, cv2.COLOR_BGR2RGB)

        result_pil = Image.fromarray(result_rgb)

        result_pil.save(result_path)

        return {"message": "Processing complete.", "result_path": img_path[2]}
    except Exception as e:
        traceback.print_exc()
        os.chdir(os.path.abspath(os.path.dirname(__file__)))
        return {"error": f"Error processing images: {str(e)}"}

@app.get("/ganz/download/")
async def download(result_path: str = Query(..., alias="result_path")):
    try:
        # result_path를 사용하여 이미지 경로 만들기
        image_path = os.path.join(RESULTS_FOLDER, f"{result_path}/result.jpg")
        print(image_path)
        
        if os.path.exists(image_path):
            print(image_path)
            return FileResponse(image_path, media_type="image/jpg")
        else:
            return {"error": "Image not found"}

    except Exception as e:
        return {"error": str(e)}
