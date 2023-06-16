from PIL import Image
import os

def resize_png_images(folder_path, output_path, size):
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    files = os.listdir(folder_path)
    png_files = [file for file in files if file.endswith('.png')]

    for file in png_files:
        image_path = os.path.join(folder_path, file)
        image = Image.open(image_path)
        resized_image = image.resize(size)
        output_file = os.path.join(output_path, file)
        resized_image.save(output_file)

    print("Image resizing complete.")

# Provide the folder path containing the PNG images
folder_path = './'

# Provide the output folder path to store the resized images
output_path = './'

# Provide the desired size for the resized images
size = (86, 86)

# Call the function to resize the PNG images
resize_png_images(folder_path, output_path, size)
