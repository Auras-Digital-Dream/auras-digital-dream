"""Turn a raw museum scan into something a browser can carry.

Scans arrive built for printers and photogrammetry viewers: hundreds of
thousands of triangles, arbitrary units, sometimes lying on the wrong axis,
and dragging texture atlases we do not want — the statue on the site is lit
as dark stone with a gold rim, so its own photographed colour would fight the
page. This throws all of that away and keeps the silhouette.

    python scripts/make-statue.py "<source .glb/.stl>" <output-name> [faces]

The result lands in public/models/<output-name>.glb, meshopt-compressed,
normalised to exactly one unit tall and centred on its own middle so a
position of [0,0,0] frames the figure rather than its ankles.
"""
import json
import os
import struct
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



def strip_textures(path):
    """Take the placeholder texture back out of the GLB.

    The exporter insists on giving every mesh a material, and a material it
    cannot leave bare gets a one-pixel base colour image. The page overrides
    the material anyway, so the image is never seen — but three.js still
    hands it to the loader as a blob: URL, and the site's Content-Security-
    Policy refuses blob: connections. Rather than widen the policy for an
    image nobody looks at, the image goes.
    """
    with open(path, "rb") as f:
        blob = f.read()

    magic, version, _ = struct.unpack("<III", blob[:12])
    assert magic == 0x46546C67, "not a GLB"
    json_len, json_tag = struct.unpack("<II", blob[12:20])
    doc = json.loads(blob[20:20 + json_len])
    rest = blob[20 + json_len:]

    for key in ("images", "textures", "samplers"):
        doc.pop(key, None)
    for material in doc.get("materials", []):
        for slot in list(material):
            if slot.endswith("Texture"):
                material.pop(slot)
        pbr = material.get("pbrMetallicRoughness", {})
        for slot in list(pbr):
            if slot.endswith("Texture"):
                pbr.pop(slot)
    for key in ("extensionsUsed", "extensionsRequired"):
        if key in doc:
            doc[key] = [e for e in doc[key] if e != "KHR_texture_transform"]
            if not doc[key]:
                doc.pop(key)

    chunk = json.dumps(doc, separators=(",", ":")).encode("utf-8")
    chunk += b" " * (-len(chunk) % 4)
    out = struct.pack("<II", len(chunk), json_tag) + chunk + rest
    out = struct.pack("<III", magic, version, len(out) + 12) + out
    with open(path, "wb") as f:
        f.write(out)


def main():
    if len(sys.argv) not in (3, 4):
        print(__doc__)
        raise SystemExit(2)
    src, name = sys.argv[1], sys.argv[2]
    target = int(sys.argv[3]) if len(sys.argv) == 4 else TARGET_FACES

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
    # gltfpack simplifies and quantises. Its simplifier is topology aware,
    # where a plain quadric collapse on a photogrammetry mesh leaves flipped
    # triangles all over the drapery.
    #
    # Deliberately no -c/-cc: meshopt compression would halve the file, but
    # its decoder is WebAssembly, and the site's Content-Security-Policy
    # allows neither wasm-unsafe-eval nor blob: connections. Quantisation
    # alone needs no decoder, so the model loads under the policy the rest
    # of the site already keeps.
    ratio = min(1.0, target / len(m.faces))
    subprocess.run(
        ["npx", "--yes", "gltfpack", "-i", raw, "-o", out, "-si", f"{ratio:.4f}"],
        check=True, shell=os.name == "nt",
    )
    print(f"      simplified to {ratio:.0%}")
    os.remove(raw)
    strip_textures(out)
    print(f"{out}  {os.path.getsize(out) / 1e3:.0f} KB")


if __name__ == "__main__":
    main()
