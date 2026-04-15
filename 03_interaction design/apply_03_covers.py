import os
import random
from PIL import Image

def main():
    img_files = [
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_1_wide_1771821327128.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_2_wide_1771821343623.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_3_wide_1771821360755.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_4_wide_1771821380144.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_5_wide_v2_1771821411605.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_6_wide_v2_1771821429525.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_7_wide_v2_1771821449013.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_8_wide_v2_1771821467743.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_9_wide_v2_1771821487796.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/interaction_cover_10_wide_v2_1771821509049.png'
    ]

    base_dir = '/Users/huang/Documents/008_vibeCoding/myCases/03_interaction design/'
    
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

    # Assign uniquely to 03_001 through 03_010
    folders = [f for f in sorted(os.listdir(base_dir)) if f.startswith('03_0')]
    for i, folder in enumerate(folders):
        full_path = os.path.join(base_dir, folder)
        images_dir = os.path.join(full_path, 'images')
        os.makedirs(images_dir, exist_ok=True)
        target_path = os.path.join(images_dir, 'cover.png')
        
        if i < len(processed_imgs):
            processed_imgs[i].save(target_path, 'PNG')
            print(f'Saved to {target_path}')

if __name__ == '__main__':
    main()
