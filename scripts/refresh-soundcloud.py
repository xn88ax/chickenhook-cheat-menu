#!/usr/bin/env python3
"""Refresh SOUNDCLOUD_TRACKS in src/data/soundcloud.ts from SoundCloud API."""
import json
import re
from pathlib import Path

CLIENT_ID = "Pb72ranhoyt6gw7hM7TkzUItXlMWSNSo"
USER_URL = "https://soundcloud.com/xn88ax"

def fetch(url: str):
    import urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))

def resolve_user():
    data = fetch(f"https://api-v2.soundcloud.com/resolve?url={USER_URL}&client_id={CLIENT_ID}")
    return data["id"], data["track_count"]

def fetch_all_tracks(user_id: int):
    tracks = []
    next_href = f"https://api-v2.soundcloud.com/users/{user_id}/tracks?client_id={CLIENT_ID}&limit=200"
    page = 0
    while next_href and page < 10:
        print(f"Fetching page {page + 1}: {next_href[:120]}...")
        data = fetch(next_href)
        collection = data.get("collection", [])
        if not collection:
            break
        tracks.extend(collection)
        next_href = data.get("next_href")
        if next_href and "client_id" not in next_href:
            sep = "&" if "?" in next_href else "?"
            next_href = f"{next_href}{sep}client_id={CLIENT_ID}"
        page += 1
    return tracks

def pick_stream(track: dict):
    media = track.get("media", {}).get("transcodings", [])
    # Prefer legacy progressive MP3 (same format the player expects)
    for t in media:
        fmt = t.get("format", {})
        if fmt.get("protocol") == "progressive" and t.get("preset", "").startswith("mp3"):
            return t["url"]
    # Fallback to any progressive stream
    for t in media:
        fmt = t.get("format", {})
        if fmt.get("protocol") == "progressive":
            return t["url"]
    return None

def escape_ts_string(s: str) -> str:
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return s

def main():
    user_id, track_count = resolve_user()
    print(f"Resolved user id={user_id}, track_count={track_count}")
    tracks = fetch_all_tracks(user_id)
    print(f"Fetched {len(tracks)} tracks")

    rows = []
    for t in tracks:
        if not t.get("streamable") or t.get("public") is False:
            continue
        stream = pick_stream(t)
        if not stream:
            continue
        title = t.get("title", "")
        track_id = t["id"]
        duration_ms = t.get("duration", 0) or t.get("full_duration", 0)
        duration_sec = int(round(duration_ms / 1000))
        rows.append({
            "title": title,
            "trackId": track_id,
            "stream": stream,
            "duration": duration_sec,
        })

    print(f"Streamable progressive MP3 tracks: {len(rows)}")

    out = Path("src/data/soundcloud.ts")
    lines = [
        "export type SoundcloudTrack = {",
        "  title: string;",
        "  trackId: number;",
        "  /** endpoint API SoundCloud — podpisany adres MP3 pobierany w trakcie odtwarzania */",
        "  stream: string;",
        "  /** sekundy */",
        "  duration: number;",
        "};",
        "",
        f"// Publiczne, streamowalne utwory z soundcloud.com/xn88ax (refreshed {len(rows)} tracks)",
        "export const SOUNDCLOUD_TRACKS: SoundcloudTrack[] = [",
    ]
    for r in rows:
        lines.append(
            f'  {{ title: "{escape_ts_string(r["title"])}", trackId: {r["trackId"]}, stream: "{r["stream"]}", duration: {r["duration"]} }},'
        )
    lines.append("];")

    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {out}")

if __name__ == "__main__":
    main()
