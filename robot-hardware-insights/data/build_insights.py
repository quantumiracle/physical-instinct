#!/usr/bin/env python3
"""Derive data/insights.json + insights.csv from ../robot-hardware-spectrum/data/robots.json.
Run: python3 -I build_insights.py   (from any directory). Read-only on the hardware data."""
import json, re, csv, os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "..", "robot-hardware-spectrum", "data", "robots.json")
rows = json.load(open(SRC, encoding="utf-8"))

CAT = {"人形": "humanoid", "轮式/移动操作": "mobile", "机械臂": "arm", "灵巧手": "hand", "数据采集": "data"}
ST = {"量产/在售": "on_sale", "在售": "on_sale", "已部署": "on_sale", "商用，按小时计费": "on_sale",
      "小批量": "pilot", "试点/小批量": "pilot", "预订": "pilot",
      "原型": "prototype", "科研": "research_other", "开源": "research_other",
      "已停产": "research_other", "不单独销售": "research_other", "": "unknown"}
CTY_EN = {"日本":"Japan","韩国":"South Korea","德国":"Germany","瑞士":"Switzerland","加拿大":"Canada","英国":"UK","意大利":"Italy","丹麦":"Denmark","法国":"France","新加坡":"Singapore","西班牙":"Spain","印度":"India","中国台湾":"Taiwan","越南":"Vietnam","荷兰":"Netherlands","波兰":"Poland","以色列":"Israel","斯洛伐克":"Slovakia","葡萄牙":"Portugal","土耳其":"Turkey","澳大利亚":"Australia","俄罗斯":"Russia","瑞典":"Sweden","比利时":"Belgium","挪威":"Norway","匈牙利":"Hungary"}

def segs(s):
    return [x.strip() for x in s.split("，") if x.strip()]

def single(seg, unit):
    """'157 cm' / '~157 cm' -> (157.0, approx). Ranges, 'N/A', '+', '>' or extra words -> None."""
    m = re.fullmatch(r"(~)?(\d+(?:\.\d+)?)\s*" + unit, seg)
    return (float(m.group(2)), bool(m.group(1))) if m else (None, False)

def parse_price(p):
    p = p.strip()
    if not p or "/小时" in p:
        return None, False, ("hourly" if p else "")
    frm = p.endswith("起")
    digits = re.sub(r"[^\d]", "", p.replace("起", ""))
    if not digits or int(digits) == 0:
        return None, False, "zero"
    return int(digits), frm, ""

# Same maker spelled two ways in the hardware data -> one display name for company counts.
CO_ALIAS = {"Neodra Dynamics (NeodraDynamics Co., Ltd., 清卓动力机器人科技（北京）有限公司)": "NeodraDynamics",
            "Shanghai RoboParty Technology Co., Ltd.": "RoboParty"}
out = []
for r in rows:
    y = r.get("y", "")
    m = re.fullmatch(r"(\d{4})(?:-(\d{2}))?(（收录）)?", y)
    year = int(m.group(1)) if m else None
    kind = ("listed" if m.group(3) else "release") if m else None
    price, frm, pnote = parse_price(r.get("p", ""))
    cat = CAT[r["cat"]]
    s = r.get("s", "")
    S = segs(s)
    h = w = bd = hd_total = hd_active = fingers = None
    h_ap = w_ap = False
    if cat in ("humanoid", "mobile"):
        for g in S:
            if h is None and g.endswith("cm"):
                h, h_ap = single(g, "cm")
            if w is None and g.endswith("kg"):
                w, w_ap = single(g, "kg")
            mm = re.fullmatch(r"全身 (\d+) DoF", g)
            if mm: bd = int(mm.group(1))
        if bd is None and not any(g.startswith("全身") for g in S):
            for g in S:  # robo2u 3-part form "138 cm，40 kg，12 DoF" = total DoF
                mm = re.fullmatch(r"(\d+) DoF", g)
                if mm: bd = int(mm.group(1))
    if cat == "hand":
        for g in S:
            mm = re.fullmatch(r"(\d+) DoF", g)
            if mm: hd_total = int(mm.group(1))
            mm = re.fullmatch(r"(\d+) 主动", g)
            if mm: hd_active = int(mm.group(1))
            mm = re.fullmatch(r"(\d+)(?: per hand)? 指", g)
            if mm: fingers = int(mm.group(1))
    grp = "CN" if r["c"] in ("CN", "CN/US") else r["c"]
    out.append({
        "src_id": r["id"], "n": r["n"], "co": r["co"], "co_norm": CO_ALIAS.get(r["co"], r["co"]), "zh": r.get("zh", ""),
        "grp": grp, "c_raw": r["c"],
        "cty": r.get("cty") or ("中国" if grp == "CN" else "美国" if grp == "US" else ""),
        "cty_en": CTY_EN.get(r.get("cty") or "", "China" if grp == "CN" else "US" if grp == "US" else ""),
        "cat": cat, "cat_zh": r["cat"],
        "year": year, "date_kind": kind, "y_raw": y,
        "status": ST.get(r.get("st", ""), "research_other"), "st_raw": r.get("st", ""),
        "price_usd": price, "price_from": frm, "price_note": pnote, "p_raw": r.get("p", ""),
        "height_cm": h, "height_approx": h_ap, "weight_kg": w, "weight_approx": w_ap,
        "dof_body": bd, "hand_dof_total": hd_total, "hand_dof_active": hd_active, "hand_fingers": fingers,
        "s_raw": s, "src": r.get("src") or r.get("u", ""),
    })

with open(os.path.join(HERE, "insights.json"), "w", encoding="utf-8") as f:  # one row per line
    f.write("[\n" + ",\n".join(json.dumps(o, ensure_ascii=False, separators=(",", ":")) for o in out) + "\n]\n")
with open(os.path.join(HERE, "insights.csv"), "w", encoding="utf-8-sig", newline="") as f:
    wr = csv.DictWriter(f, fieldnames=list(out[0].keys()))
    wr.writeheader(); wr.writerows(out)
print(len(out), "rows")
