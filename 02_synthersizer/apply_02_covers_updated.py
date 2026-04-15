import os
from PIL import Image

def main():
    img_files = [
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_1_1771776181402.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_2_1771776201550.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_3_wide_v2_1771822976777.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_4_wide_v2_1771822999923.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_5_wide_v2_1771823016051.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_6_wide_v2_1771823038219.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_8_wide_new_1771822909563.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_9_wide_new_1771822926320.png',
        '/Users/huang/.gemini/antigravity/brain/22b0ea46-f92b-4027-9cba-61555ab559af/synth_cover_10_wide_new_1771822945088.png'
    ]

    base_dir = '/Users/huang/Documents/008_vibeCoding/myCases/02_synthersizer/'
    
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

    # Assign to 02_001 through 02_010 and 002
    folders = [f for f in sorted(os.listdir(base_dir)) if f.startswith('02_0') or f == '002']
    for i, folder in enumerate(folders):
        full_path = os.path.join(base_dir, folder)
        images_dir = os.path.join(full_path, 'images')
        os.makedirs(images_dir, exist_ok=True)
        target_path = os.path.join(images_dir, 'cover.png')
        
        # We have 9 unique images for 11 folders, so we'll cycle the last two or just use available
        idx = i % len(processed_imgs)
        processed_imgs[idx].save(target_path, 'PNG')
        print(f'Saved to {target_path}')

if __name__ == '__main__':
    main()
