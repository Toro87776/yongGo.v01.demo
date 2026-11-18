// YongGO 全域資料同步腳本 (共用 localStorage)
const YONGGO_STORAGE_KEY = "yonggo_dr_yong_profile_v1";

function getYongGoProfile() {
    const defaults = {
        completed: false,
        step: 0,
        userName: "Alex",
        userAccount: "alex_doglover@yonggo.com",
        userPhoto: "",
        userGender: "male",
        userZodiac: "leo",
        userBirth: "1995-08-12",
        dogName: "薇寶",
        breed: "玩具紅貴賓",
        dogChip: "900073001114672",
        dogBirth: "2026-04-15",
        dogBlood: "unknown",
        dogPersonality: "超級開朗",
        age: "4～6 個月",
        environment: "公寓／大樓",
        source: "領養的",
        vaccine: "已打 2 劑",
        traits: ["超級開朗"],
        theme: "light",
        updatedAt: null
    };
    try {
        const raw = localStorage.getItem(YONGGO_STORAGE_KEY);
        if (!raw) return defaults;
        const parsed = JSON.parse(raw);
        if (parsed.cleared) {
            return {
                ...defaults,
                ...parsed,
                cleared: true,
                userName: parsed.userName || "",
                userAccount: parsed.userAccount || "",
                userPhoto: parsed.userPhoto || "",
                userGender: parsed.userGender || "",
                userZodiac: parsed.userZodiac || "",
                userBirth: parsed.userBirth || "",
                dogName: parsed.dogName || "",
                breed: parsed.breed || "",
                dogChip: parsed.dogChip || "",
                dogBirth: parsed.dogBirth || "",
                dogBlood: parsed.dogBlood || "",
                dogPersonality: parsed.dogPersonality || "",
                traits: Array.isArray(parsed.traits) ? parsed.traits : []
            };
        }
        return {
            ...defaults,
            ...parsed,
            userName: parsed.userName || defaults.userName,
            dogName: parsed.dogName || defaults.dogName,
            breed: parsed.breed || defaults.breed,
            traits: Array.isArray(parsed.traits) && parsed.traits.length ? parsed.traits : defaults.traits
        };
    } catch (e) {
        return defaults;
    }
}

function saveYongGoProfile(partialProfile) {
    const current = getYongGoProfile();
    const updated = {
        ...current,
        ...partialProfile,
        cleared: partialProfile && partialProfile.cleared === true ? true : false,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem(YONGGO_STORAGE_KEY, JSON.stringify(updated));
    applyProfileToDOM(updated);
    return updated;
}

function clearYongGoProfile() {
    const clearedData = {
        cleared: true,
        completed: false,
        step: 0,
        userName: "",
        userAccount: "",
        userPhoto: "",
        userGender: "",
        userZodiac: "",
        userBirth: "",
        dogName: "",
        breed: "",
        dogChip: "",
        dogBirth: "",
        dogBlood: "",
        dogPersonality: "",
        traits: [],
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem(YONGGO_STORAGE_KEY, JSON.stringify(clearedData));
    applyProfileToDOM(clearedData);
    return clearedData;
}

function applyProfileToDOM(profileData) {
    const p = profileData || getYongGoProfile();

    // 1. 首頁 (index.html) 飼主與狗狗名稱連動
    const homeOwnerDog = document.getElementById("home-owner-dog-info");
    if (homeOwnerDog) {
        homeOwnerDog.textContent = p.cleared
            ? "飼主：尚未設定"
            : `飼主：${p.userName} (狗狗: ${p.dogName})`;
    }

    // 2. 訓練中心 (training_center.html) 右上角品種標籤連動
    const breedBadge = document.getElementById("training-breed-badge");
    if (breedBadge) {
        breedBadge.textContent = p.breed ? `${p.breed}專屬` : "專屬訓練";
    }

    // 3. 個人與設定頁 (personal_setting.html) 名片與表單連動
    const cardOwnerName = document.getElementById("card-owner-name");
    if (cardOwnerName) cardOwnerName.textContent = p.userName || "未設定";

    const cardDogSummary = document.getElementById("card-dog-summary");
    if (cardDogSummary) {
        cardDogSummary.textContent = p.dogName
            ? `狗狗：${p.dogName}${p.breed ? ` (${p.breed})` : ""}`
            : "狗狗：尚未設定";
    }

    const cardAccount = document.getElementById("card-owner-account");
    if (cardAccount) {
        cardAccount.textContent = p.userAccount ? `帳號：${p.userAccount}` : "帳號：尚未登入";
    }

    const currentDogLabel = document.getElementById("current-dog-label");
    if (currentDogLabel) currentDogLabel.textContent = p.dogName ? `目前選擇：${p.dogName}` : "目前選擇：尚未設定";

    const dogTabBtnText = document.getElementById("dog-tab-btn-text");
    if (dogTabBtnText) dogTabBtnText.textContent = p.dogName || "未命名";

    const inputOwnerName = document.getElementById("input-owner-name");
    if (inputOwnerName) inputOwnerName.value = p.userName || "";

    const inputOwnerGender = document.getElementById("input-owner-gender");
    if (inputOwnerGender) inputOwnerGender.value = p.userGender || "";

    const inputOwnerZodiac = document.getElementById("input-owner-zodiac");
    if (inputOwnerZodiac) inputOwnerZodiac.value = p.userZodiac || "";

    const inputOwnerBirth = document.getElementById("input-owner-birth");
    if (inputOwnerBirth) inputOwnerBirth.value = p.userBirth || "";

    const inputDogName = document.getElementById("input-dog-name");
    if (inputDogName) inputDogName.value = p.dogName || "";

    const inputDogBreed = document.getElementById("input-dog-breed");
    if (inputDogBreed) inputDogBreed.value = p.breed || "";

    const inputDogChip = document.getElementById("input-dog-chip");
    if (inputDogChip) inputDogChip.value = p.dogChip || "";

    const inputDogBirth = document.getElementById("input-dog-birth");
    if (inputDogBirth) inputDogBirth.value = p.dogBirth || "";

    const inputDogBlood = document.getElementById("input-dog-blood");
    if (inputDogBlood) inputDogBlood.value = p.dogBlood || "";

    const inputDogTrait = document.getElementById("input-dog-trait");
    if (inputDogTrait) inputDogTrait.value = p.dogPersonality || (p.traits && p.traits[0]) || "";

    // 4. 若有 Google 登入頭像 (userPhoto)，同步更新各頁面的飼主頭像
    if (p.userPhoto) {
        document.querySelectorAll('img[alt="飼主頭像"], img[alt="飼主"], img[alt="Alex"]').forEach(img => {
            img.src = p.userPhoto;
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    applyProfileToDOM();

    // 全域按鈕點擊 UX 回饋：任何可點擊按鈕被點擊後，顏色變深並微幅放大，讓使用者清楚知道已點擊
    const style = document.createElement("style");
    style.textContent = `
        .text-xs {
            font-size: 0.9rem !important;
            line-height: 1.35rem !important;
        }
        .text-\\[11px\\] {
            font-size: 14px !important;
        }
        button, [onclick], label.cursor-pointer {
            transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
        }
        .yonggo-clicked-ux:not(.record-tag-btn) {
            transform: scale(1.06) !important;
            filter: brightness(0.88) contrast(1.05);
            box-shadow: 0 4px 10px rgba(47, 85, 55, 0.22) !important;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("click", (e) => {
        const clickable = e.target.closest("button, [onclick], label.cursor-pointer");
        if (!clickable || clickable.classList.contains("training-3d-play-btn")) return;
        // 導覽列或關閉彈窗按鈕不需殘留放大狀態，僅給予即時回饋；一般功能按鈕保留已點擊視覺狀態
        const isTransient = clickable.closest("nav") || clickable.getAttribute("onclick")?.includes("close");
        clickable.classList.add("yonggo-clicked-ux");
        if (isTransient) {
            setTimeout(() => clickable.classList.remove("yonggo-clicked-ux"), 300);
        }
    });
});
