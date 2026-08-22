"""Turn a raw museum scan into something a browser can carry.

Scans arrive built for printers and photogrammetry viewers: hundreds of
thousands of triangles, arbitrary units, sometimes lying on the wrong axis,
and dragging texture atlases we do not want — the statue on the site is lit
as dark stone with a gold rim, so its own photographed colour would fight the
page. This throws all of that away and keeps the silhouette.

    python scripts/make-statue.py "<source .glb/.stl>" <output-name>

The result lands in public/models/<output-name>.glb, meshopt-compressed,
normalised to exactly one unit tall and centred on its own middle so a
position of [0,0,0] frames the figure rather than its ankles.
"""
import os
import subprocess
import sys

import numpy as np
import trimesh

TARGET_FACES = 50_000
OUT_DIR = "public/models"


def load(path):
    scene = trimesh.load(path)
    if isinstance(scene, trimesh.Scene):
        # Scanners split a single figure across several meshes so each can
        # carry its own texture atlas. Nothing here is scenery, so they all
        # belong to the same body.
        return trimesh.util.concatenate(list(scene.geometry.values()))
    return scene


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(2)
    src, name = sys.argv[1], sys.argv[2]

    m = load(src)
    print(f"in    {len(m.faces):,} faces")

    # Photogrammetry arrives as several chunks that merely touch: every seam
    # is a double row of vertices. Welding them first is what lets the
    # decimator collapse across a seam instead of tearing a hole in it, and
    # it is the difference between smooth stone and a surface full of bright
    # shards where the normals disagree with their neighbours.
    m.merge_vertices()
    m.update_faces(m.nondegenerate_faces())
    m.update_faces(m.unique_faces())
    m.remove_unreferenced_vertices()
    print(f"weld  {len(m.faces):,} faces, {len(m.vertices):,} vertices")

    # Printers stand things on Z, the web stands them on Y.
    if int(np.argmax(m.extents)) == 2:
        m.apply_transform(trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0]))
        print("      laid over from Z-up to Y-up")

    m.apply_translation(-m.bounds.mean(axis=0))
    m.apply_scale(1.0 / m.extents[1])
    print("      extents", np.round(m.extents, 3))

    # Drop the photographed colour: the site lights her itself. The smooth
    # normals go with it, computed here while the mesh is still at full
    # resolution — they survive simplification, and they are the difference
    # between stone and a surface stitched from bright shards.
    m.visual = trimesh.visual.TextureVisuals()
    m.vertex_normals

    os.makedirs(OUT_DIR, exist_ok=True)
    raw = os.path.join(OUT_DIR, f"{name}-raw.glb")
    out = os.path.join(OUT_DIR, f"{name}.glb")
    trimesh.exchange.export.export_mesh(m, raw, file_type="glb")

    # gltfpack quantises the vertex data and meshopt-compresses it, which is
    # what takes the file from most of a megabyte down to something a phone
    # would not notice. The uncompressed GLB is scaffolding and does not
    # survive.
    # gltfpack both simplifies and compresses. Its simplifier is topology
    # aware, where a plain quadric collapse on a photogrammetry mesh leaves
    # flipped triangles all over the drapery; and meshopt compression takes
    # the file down to something a phone would not notice.
    ratio = min(1.0, TARGET_FACES / len(m.faces))
    subprocess.run(
        ["npx", "--yes", "gltfpack", "-i", raw, "-o", out, "-cc", "-si", f"{ratio:.4f}"],
        check=True, shell=os.name == "nt",
    )
    print(f"      simplified to {ratio:.0%}")
    os.remove(raw)
    print(f"{out}  {os.path.getsize(out) / 1e3:.0f} KB")


if __name__ == "__main__":
    main()
