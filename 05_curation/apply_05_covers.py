import os
from PIL import Image

def main():
    img_files = [
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_1_wide_1772549174905.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_2_wide_1772549194123.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_3_wide_1772549212196.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_4_wide_1772549231892.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_5_wide_1772549246128.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_6_wide_1772549264157.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_7_wide_1772549281984.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_8_wide_1772549304337.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_9_wide_1772549325515.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/exhibition_cover_10_wide_1772549342947.png'
    ]

    base_dir = '/Users/huang/Documents/008_vibeCoding/myCases/05_curation/'
    
    processed_imgs = []
    for fp in img_files:
        try:
            img = Image.open(fp).convert('RGB')
            target_w, target_h = 1920, 1080
            aspect_target = target_w / target_h
            aspect_img = img.width / img.height
            
            if aspect_img > aspect_target:
                new_w = int(img.height * aspect_target)
                offset = (img.width - new_w) // 2
                img_cropped = img.crop((offset, 0, offset + new_w, img.height))
            else:
                new_h = int(img.width / aspect_target)
                offset = (img.height - new_h) // 2
                img_cropped = img.crop((0, offset, img.width, offset + new_h))
            
            img_resized = img_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
            processed_imgs.append(img_resized)
        except Exception as e:
            print(f"Skipping {fp}: {e}")

    num_imgs = len(processed_imgs)
    if num_imgs == 0:
        print("No images to process.")
        return

    # Assign to 05 folders
    folders = [f for f in sorted(os.listdir(base_dir)) if f.startswith('05_0')]
    for i, folder in enumerate(folders):
        full_path = os.path.join(base_dir, folder)
        images_dir = os.path.join(full_path, 'images')
        os.makedirs(images_dir, exist_ok=True)
        target_path = os.path.join(images_dir, 'cover.png')
        
        # Cycle through available images
        selected_img = processed_imgs[i % num_imgs]
        selected_img.save(target_path, 'PNG')
        print(f'Assigned image to {target_path}')

if __name__ == '__main__':
    main()
