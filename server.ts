import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Pre-seeded classified ads matching Jordanian OpenSooq style
let ads = [
  {
    id: "1",
    title: "هيونداي سوناتا 2020 ليميتد فل كامل فحص كامل بريدجستون شاحن لاسلكي",
    description: "هيونداي سوناتا 2020 هايبرد ليميتد، لون أسود ملوكي دهان الشركة، فتحة بانوراما، فحص كامل 7 جيد بدون ملاحظات، حواف كروم، شاشة كبيرة مع كاميرا خلفية، اضاءة ليد ترحيبية، كوشوك جديد، ترخيص سنة كاملة. السيارة لا تحتاج لأي صيانة البيع كاش.",
    price: 19800,
    category: "cars",
    subcategory: "سيارات للبيع",
    city: "عمان",
    phone: "0798991212",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    createdAt: "قبل ساعتين",
    views: 142,
    ownerName: "أبو يوسف الجبور",
    isFeatured: true
  },
  {
    id: "2",
    title: "شقة فاخرة للبيع في دابوق - ٣ نوم مع بلكونة اطلالة مميزة",
    description: "شقة سوبر ديلوكس في ارقى مناطق دابوق، الطابق الثاني، مساحة 180 متر مربع، 3 غرف نوم واحدة ماستر، صالون واسع مع بلكونة مطلة على جبال دابوق، صالة معيشة مستقلة، مطبخ راكب خشب بلوط كلاسيكي، تدفئة مركزية وغاز راكب، كراج سيارة ومخزن مستقل.",
    price: 125000,
    category: "properties",
    subcategory: "شقق للبيع",
    city: "عمان",
    phone: "0785123456",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    createdAt: "قبل 5 ساعات",
    views: 89,
    ownerName: "شركة الهديل السكنية",
    isFeatured: true
  },
  {
    id: "3",
    title: "ايفون 15 برو ماكس 256 جيجا تيتانيوم طبيعي بحالة الوكالة نسبة البطارية 96%",
    description: "آيفون 15 برو ماكس iPhone 15 Pro Max، كفالة دولية لغاية نهاية السنة، لون تيتانيوم طبيعي، سعة 256 جيجا، لم يدخل الصيانة مطلقاً، مع الكرتونة والشاحن الأصلي، شاشة حماية نانو راكبة من اليوم الأول.",
    price: 840,
    category: "mobiles",
    subcategory: "هواتف ذكية",
    city: "عمان",
    phone: "0770987654",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
    createdAt: "قبل 10 دقائق",
    views: 310,
    ownerName: "معرض الزعبي للموبايل"
  },
  {
    id: "4",
    title: "مطلوب موظف مبيعات وتجارة الكترونية لشركة ملابس واكسسوارات في شارع المدينة",
    description: "تعلن شركة تجارية كبرى عن حاجتها لموظف أو موظفة مبيعات وتسويق الكتروني، خبره لا تقل عن سنة في ادارة الحسابات ومتابعة طلبات الزبائن (انستغرام وواتساب)، اللباقة والقدرة على الاقناع، الدوام من الـ 9 صباحاً حتى الـ 5 مساءً، راتب مجزي وعمولات مغرية.",
    price: 350,
    category: "jobs",
    subcategory: "تسويق ومبيعات",
    city: "عمان",
    phone: "0790102030",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    createdAt: "أمس",
    views: 184,
    ownerName: "مجموعة جوردان ستايل"
  },
  {
    id: "5",
    title: "بلاستيشن 5 نسخة الأقراص مستعمل اسبوعين فقط مع يدين ولعبتين",
    description: "جهاز سوني PS5 النسخة الأوروبية مع قرص سي دي، مستعمل للتجربة فقط خالٍ من أي خدش أو عطل. يأتي مع يدين تحكم أصليتين، ولعبة فيفا 24 ولعبة مغامرات، الكرتونة وكافة التوصيلات الأصلية متوفرة.",
    price: 380,
    category: "games",
    subcategory: "بلايستيشن وصيانة الكونسول",
    city: "إربد",
    phone: "0788880022",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
    createdAt: "قبل يومين",
    views: 215,
    ownerName: "رامي عبيدات"
  },
  {
    id: "6",
    title: "طقم كنب تركي فاخر يتسع لـ 9 أشخاص مع طاولة وسط بحالة نظيفة جداً",
    description: "للبيع بداعي السفر كنب تركي خشب زان متين جداً، اسفنج ضغط عالي مريح للغاية، يتسع لـ 9 مقاعد (ثلاثية، ثنائية، وأربع مفردات)، لون كحلي ورمادي هادئ، الطقم نظيف تماماً وخالٍ من البقع والعيوب.",
    price: 290,
    category: "furniture",
    subcategory: "أثاث غرف جلوس",
    city: "الزرقاء",
    phone: "0790554433",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    createdAt: "قبل 6 ساعات",
    views: 63,
    ownerName: "أم هشام"
  }
];

// Endpoint: get all ads with optional filters
app.get("/api/ads", (req, res) => {
  const { category, subcategory, city, search, minPrice, maxPrice } = req.query;
  let filtered = [...ads];

  if (category) {
    filtered = filtered.filter(ad => ad.category === category);
  }
  if (subcategory) {
    filtered = filtered.filter(ad => ad.subcategory === subcategory);
  }
  if (city) {
    filtered = filtered.filter(ad => ad.city === city);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(ad => 
      ad.title.toLowerCase().includes(q) || 
      ad.description.toLowerCase().includes(q)
    );
  }
  if (minPrice) {
    filtered = filtered.filter(ad => ad.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(ad => ad.price <= Number(maxPrice));
  }

  res.json(filtered);
});

// Endpoint: post a new classified ad
app.post("/api/ads", (req, res) => {
  const { title, description, price, category, subcategory, city, phone, image, ownerName } = req.body;
  if (!title || !description || !price || !category || !city || !phone) {
    return res.status(400).json({ error: "الرجاء اكمال جميع الحقول المطلوبة!" });
  }

  const newAd = {
    id: String(ads.length + 1),
    title,
    description,
    price: Number(price),
    category,
    subcategory: subcategory || "أخرى",
    city,
    phone,
    image: image || "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800",
    createdAt: "الآن",
    views: 0,
    ownerName: ownerName || "مستخدم السوق المفتوح",
  };

  ads.unshift(newAd);
  res.status(201).json(newAd);
});

// Endpoint: GitHub Auto-Push Integration
// Takes Token from Request, commits specific app source files to a repo on user's profile
app.post("/api/github/push", async (req, res) => {
  const { token, repoName = "opensooq-jordan-clone" } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "رمز الوصول الشخصي للـ GitHub (Token) مطلوب!" });
  }

  try {
    // 1. Get user profile details
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "OpenSooq-Clone-Agent"
      }
    });

    if (!userRes.ok) {
      const errTxt = await userRes.text();
      return res.status(401).json({ success: false, message: `فشل المصادقة مع جيت هاب: ${errTxt}` });
    }

    const userData = await userRes.json();
    const owner = userData.login;

    // 2. See if repo exists, else create it
    const repoCheckRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "OpenSooq-Clone-Agent"
      }
    });

    let repoCreated = false;
    if (repoCheckRes.status === 404) {
      // Create new repo
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "OpenSooq-Clone-Agent"
        },
        body: JSON.stringify({
          name: repoName,
          description: "A gorgeous modern OpenSooq classifieds marketplace clone (RTL) for Jordan.",
          private: false,
          auto_init: true
        })
      });

      if (!createRes.ok) {
        throw new Error(`خطأ أثناء إنشاء المستودع على GitHub: ${await createRes.text()}`);
      }
      repoCreated = true;
      // Wait a moment for GitHub to setup the repo template commits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Define the list of core files to sync
    const filesToSync = [
      "package.json",
      "tsconfig.json",
      "vite.config.ts",
      "index.html",
      "metadata.json",
      "server.ts",
      "src/main.tsx",
      "src/index.css",
      "src/types.ts",
      "src/App.tsx",
      "src/components/Header.tsx",
      "src/components/Hero.tsx",
      "src/components/AdCard.tsx",
      "src/components/AdDetailsModal.tsx",
      "src/components/PostAdModal.tsx",
      "src/components/SyncPanel.tsx",
    ];

    const results = [];

    // 4. Sequentially upload each files
    for (const relativePath of filesToSync) {
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const base64Content = Buffer.from(content, "utf-8").toString("base64");

        // We check if file already exists in repository to obtain its SHA (needed for updates in GitHub API)
        const fileCheckUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${relativePath}`;
        const fileCheckRes = await fetch(fileCheckUrl, {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "OpenSooq-Clone-Agent"
          }
        });

        let sha: string | undefined;
        if (fileCheckRes.status === 200) {
          const fileData = await fileCheckRes.json();
          sha = fileData.sha;
        }

        // Committing contents
        const putRes = await fetch(fileCheckUrl, {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "OpenSooq-Clone-Agent"
          },
          body: JSON.stringify({
            message: `🤖 opensooq-clone setup: synchronizing ${relativePath}`,
            content: base64Content,
            sha: sha // If SHA is present, it updates. Otherwise, it creates.
          })
        });

        if (putRes.ok) {
          results.push({ file: relativePath, status: "synchronized" });
        } else {
          results.push({ file: relativePath, status: `failed: ${await putRes.text()}` });
        }
      } else {
        results.push({ file: relativePath, status: "not found in workspace" });
      }
    }

    res.json({
      success: true,
      repoUrl: `https://github.com/${owner}/${repoName}`,
      repoCreated,
      owner,
      results
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Internal server error occurred and logged." });
  }
});

// Serve frontend assets built in production, or hook Vite middleware in development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OpenSooq Full-Stack Server running on active port ${PORT}`);
  });
}

bootstrap();
