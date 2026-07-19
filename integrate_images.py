#!/usr/bin/env python3
"""
Update HTML with generated product images
Automatically replaces pure gradient backgrounds with actual product images
"""

import os
from pathlib import Path

def update_html_with_images():
    """Update index.html to use generated product images"""

    html_file = Path("/Users/lmonster/User/development/wl-of-site/index.html")
    images_dir = Path("/Users/lmonster/User/development/wl-of-site/images")

    # Check which images exist
    brand_images = {
        'walch': images_dir / 'walch.png',
        'na': images_dir / 'na.png',
        'lamama': images_dir / 'lamama.png',
        'jinghua': images_dir / 'jinghua.png',
        'fangyoumei': images_dir / 'fangyoumei.png'
    }

    available_images = {brand: path for brand, path in brand_images.items() if path.exists()}

    print(f"Found {len(available_images)}/5 product images:")
    for brand, path in available_images.items():
        size = path.stat().st_size / 1024
        print(f"  ✓ {brand}: {size:.1f} KB")

    if not available_images:
        print("No images found yet. Waiting for generation to complete...")
        return False

    # Read HTML
    html_content = html_file.read_text(encoding='utf-8')

    # Update each brand showcase with image if available
    for brand, image_path in available_images.items():
        # Find the showcase div for this brand
        showcase_class = f"{brand}-showcase"

        # Add background image style
        old_pattern = f'<div class="product-showcase {showcase_class}">'
        new_pattern = f'<div class="product-showcase {showcase_class} has-image" style="background-image: url(\'images/{brand}.png\');">'

        if old_pattern in html_content:
            html_content = html_content.replace(old_pattern, new_pattern)
            print(f"  → Updated {brand} showcase with product image")

    # Write updated HTML
    html_file.write_text(html_content, encoding='utf-8')
    print(f"\n✓ HTML updated successfully")
    return True

if __name__ == "__main__":
    print("="*60)
    print("Product Image Integration")
    print("="*60 + "\n")

    success = update_html_with_images()

    if success:
        print("\n" + "="*60)
        print("Integration complete!")
        print("="*60)
    else:
        print("\nRun this script again after images are generated.")
