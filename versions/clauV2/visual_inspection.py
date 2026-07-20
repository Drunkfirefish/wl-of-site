#!/usr/bin/env python3
"""
Browser Visual Inspection for Weilan Brand Matrix Website
Non-intrusive, headless mode with fixed viewport
"""

import os
import time
import subprocess
import json
from pathlib import Path

def take_screenshots():
    """Take screenshots using headless browser"""

    # Ensure screenshots directory exists
    screenshots_dir = Path("/Users/lmonster/User/development/wl-of-site/screenshots")
    screenshots_dir.mkdir(exist_ok=True)

    # Get absolute path to index.html
    html_file = Path("/Users/lmonster/User/development/wl-of-site/index.html").absolute()
    file_url = f"file://{html_file}"

    print(f"Inspecting: {file_url}")
    print(f"Screenshots will be saved to: {screenshots_dir}")

    # Edge headless command with fixed viewport and DPR=1
    edge_path = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"

    screenshots = [
        {
            "name": "homepage_hero_desktop.png",
            "description": "Hero section - desktop 1920x1080",
            "window_size": "1920,1080"
        },
        {
            "name": "homepage_fullpage_desktop.png",
            "description": "Full page scroll - desktop",
            "window_size": "1920,3000"
        },
        {
            "name": "homepage_tablet.png",
            "description": "Tablet view 768x1024",
            "window_size": "768,1024"
        },
        {
            "name": "homepage_mobile.png",
            "description": "Mobile view 375x812",
            "window_size": "375,812"
        }
    ]

    for shot in screenshots:
        output_path = screenshots_dir / shot["name"]

        cmd = [
            edge_path,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            f"--window-size={shot['window_size']}",
            "--force-device-scale-factor=1",
            "--hide-scrollbars",
            f"--screenshot={output_path}",
            file_url
        ]

        print(f"\nCapturing: {shot['description']}")
        print(f"  Size: {shot['window_size']}")

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

            if output_path.exists():
                size = output_path.stat().st_size
                print(f"  ✓ Saved: {output_path.name} ({size:,} bytes)")
            else:
                print(f"  ✗ Failed to create screenshot")
                if result.stderr:
                    print(f"  Error: {result.stderr}")

        except subprocess.TimeoutExpired:
            print(f"  ✗ Timeout capturing screenshot")
        except Exception as e:
            print(f"  ✗ Error: {e}")

        time.sleep(1)  # Brief pause between captures

    print(f"\n{'='*60}")
    print("Screenshot capture complete")
    print(f"{'='*60}\n")

    # List all captured screenshots
    captured = list(screenshots_dir.glob("*.png"))
    if captured:
        print(f"Total screenshots: {len(captured)}")
        for img in captured:
            print(f"  - {img.name}")
    else:
        print("No screenshots were captured")

    return screenshots_dir

if __name__ == "__main__":
    screenshots_dir = take_screenshots()
