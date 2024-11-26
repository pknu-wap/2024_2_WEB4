import cv2
import dlib

def detect_hair(image_path, output_hair_path, expand_ratio=1.2, hair_ratio=1.2):
    """
    Detects the hair region based on the face in the image and crops the hair region into a square (1:1) aspect ratio.

    Args:
        image_path (str): Path to the input image.
        output_hair_path (str): Path to save the cropped hair image.
        expand_ratio (float): Factor to expand the face bounding box for cropping.
        hair_ratio (float): Proportion of face height to extend upward for hair cropping.
    """
    # Load the image and initialize dlib's face detector
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read the image. Please check the path.")

    detector = dlib.get_frontal_face_detector()
    detections = detector(image, 1)

    if len(detections) == 0:
        raise ValueError("No face detected in the image.")

    for rect in detections:
        # Get the face bounding box coordinates
        x, y, w, h = rect.left(), rect.top(), rect.width(), rect.height()

        # Calculate the expanded face bounding box
        expand_w = int(w * expand_ratio)
        expand_h = int(h * expand_ratio)

        # Adjust x, y to account for the expansion
        x_expanded = max(x - (expand_w - w) // 2, 0)
        y_expanded = max(y - (expand_h - h) // 2, 0)
        w_expanded = min(x_expanded + expand_w, image.shape[1]) - x_expanded
        h_expanded = min(y_expanded + expand_h, image.shape[0]) - y_expanded

        # Calculate the hair cropping box (extend upward from the face)
        hair_top = max(y_expanded - int(h * hair_ratio), 0)

        # Ensure the crop is square
        crop_height = y_expanded + h_expanded - hair_top
        crop_width = w_expanded

        # Adjust the width if height is greater
        if crop_height > crop_width:
            diff = (crop_height - crop_width) // 2
            x_expanded = max(x_expanded - diff, 0)
            w_expanded = min(x_expanded + crop_height + diff, image.shape[1])
        elif crop_width > crop_height:
            diff = (crop_width - crop_height) // 2
            hair_top = max(hair_top - diff, 0)
            crop_height = min(crop_height + diff, image.shape[0])

        # Crop and save the hair image
        hair_crop = image[hair_top:hair_top + crop_height, x_expanded:x_expanded + w_expanded]
        hair_crop = cv2.resize(hair_crop, (1024, 1024))  # Resize to desired size
        cv2.imwrite(output_hair_path, hair_crop)

        return
