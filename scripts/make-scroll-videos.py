#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prepare the screen recordings that play inside the device frames.

Three things happen here, and each one is the answer to something measured
rather than assumed.

WEIGHT. The two desktop recordings are 58.9 MB and 35.6 MB as they came off
the screen recorder. A page cannot autoplay that, and even the gallery's
click-to-play was handing a phone user 59 MB. A screen recording of a
website scrolling is almost entirely static frames and smooth pans, which
is the easiest thing there is to compress: at 1280 wide and CRF 28 the
first one lands at 4.3 MB, and a frame from each version put side by side
at full size is indistinguishable - the body text on the site is equally
readable in both.

THE PHONE INSIDE THE PHONE. The vertical recordings were taken on a real
handset, so they carry its status bar at the top and its navigation bar at
the bottom. Dropped into a phone frame that reads as a phone photographed
inside a phone. The trims below were measured row by row on a real frame -
where the clock and battery icons stop and the page begins - because a
first attempt at detecting them automatically cut about a third of what
was actually there and left the icons showing.

POSTERS. Every clip is paired with a still, so the frame shows the site
rather than a black rectangle before anything plays - and so reduced motion
has something to show instead of nothing.

Originals are left untouched on disk and are in git besides. Run:
  python scripts/make-scroll-videos.py
"""
import glob
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

# The frames loop, and a loop nobody reaches the end of is just weight. The
# longest recording ran 95 seconds and encoded to 9.4 MB on its own; forty
# seconds shows the whole site and costs a third of that. Clips shorter than
# the cap are untouched.
MAX_SECONDS = 40

# slug, source pattern, output name, crop from top, crop from bottom, poster second
CLIPS = [
    ("adi-ecoo-2009-sa", "877bd41c8_*.mp4", "site-desktop", 0, 0, 20),
    ("adi-ecoo-2009-sa", "89fb91d78_*.mp4", "social-story", 0, 0, 2),
    ("lupul-and-brici", "a45070a4f_*.mp4", "site-desktop", 0, 0, 18),
    ("auras-trend-vault", "b2db01172_*.mp4", "site-mobil", 30, 42, 22),
    ("magazine-online-e-commerce", "2df41b79e_*.mp4", "site-mobil", 35, 42, 25),
    ("real-estate-co", "610ce2e53_*.mp4", "site-mobil", 0, 48, 10),
    ("verde-bean", "96848f026_*.mp4", "social-mobil", 0, 0, 8),
    ("lumina-botanica", "45639281f_*.mp4", "social-mobil", 0, 0, 7),
]

# Wide enough that a desktop recording stays readable inside the frame, and
# well past what a phone clip is ever displayed at.
MAX_WIDTH = 1280


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", path],
        capture_output=True, text=True, timeout=60).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


rows = []
for slug, pattern, name, cut_top, cut_bottom, poster_at in CLIPS:
    found = glob.glob(os.path.join("public", "portfolio", slug, pattern))
    if not found:
        raise SystemExit("no source for %s / %s" % (slug, pattern))
    src = found[0]
    w, h = probe(src)

    out_dir = os.path.join("public", "portfolio", slug, "scroll")
    os.makedirs(out_dir, exist_ok=True)
    mp4 = os.path.join(out_dir, name + ".mp4")
    jpg = os.path.join(out_dir, name + ".jpg")

    # crop first, then scale, and keep both sides even for H.264
    chain = []
    if cut_top or cut_bottom:
        chain.append("crop=%d:%d:0:%d" % (w, h - cut_top - cut_bottom, cut_top))
    chain.append("scale=%d:-2" % min(MAX_WIDTH, w) if w > MAX_WIDTH else "scale=trunc(iw/2)*2:trunc(ih/2)*2")
    vf = ",".join(chain)

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-t", str(MAX_SECONDS),
         "-vf", vf, "-c:v", "libx264", "-crf", "28", "-preset", "slow",
         "-profile:v", "high", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", "-an", mp4], check=True, timeout=900)

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(poster_at), "-i", mp4,
         "-frames:v", "1", "-q:v", "4", jpg], check=True, timeout=120)

    nw, nh = probe(mp4)
    rows.append((slug, name, os.path.getsize(src) / 1048576, os.path.getsize(mp4) / 1048576,
                 "%dx%d" % (w, h), "%dx%d" % (nw, nh), os.path.getsize(jpg) / 1024))

print("  %-30s %-14s %9s %9s  %-11s %-11s %s" %
      ("PROIECT", "CLIP", "INAINTE", "DUPA", "SURSA", "REZULTAT", "POSTER"))
for slug, name, before, after, dim_in, dim_out, poster in rows:
    print("  %-30s %-14s %7.1f MB %7.1f MB  %-11s %-11s %5.0f KB" %
          (slug, name, before, after, dim_in, dim_out, poster))
total_before = sum(r[2] for r in rows)
total_after = sum(r[3] for r in rows)
print("  %-30s %-14s %7.1f MB %7.1f MB   (-%.0f%%)" %
      ("TOTAL", "", total_before, total_after, 100 * (1 - total_after / total_before)))
