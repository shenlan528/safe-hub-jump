# Safe-Hub 跳转系统

这是一个基于 Vercel 的防封跳转系统，具备以下功能：
- ✅ TikTok 抓不到真实跳转地址
- ✅ 使用 Serverless API 返回跳转地址并进行签名校验
- ✅ 支持多语言自动切换（9种语言）
- ✅ 支持跳板页 JS 混淆
- ✅ 所有目标地址集中配置，便于修改

---

## 🚀 如何部署

1. 注册并登录 [Vercel](https://vercel.com/)
2. 点击 [Import Project](https://vercel.com/import) 导入此项目
3. 上传此项目文件夹的所有内容
4. 自动部署完成后，你会获得一个地址如：
   ```
   https://safe-hub-xxx.vercel.app
   ```
5. 用 Bitly 缩短主页地址，挂到 TikTok 主页链接中

---

## 🔐 如何修改跳转目标地址？

跳转地址配置在 `/api/jump.js` 文件中的 `map` 中：

```js
const map = {
  a1: "https://your-domain.workers.dev/a1",
  a2: "https://your-domain.workers.dev/a2",
  a3: "https://your-domain.workers.dev/a3"
};
```

- 添加新地址：添加新键值对，如 `"a4": "https://..."`；
- 然后新建对应跳板页 `jump4.html`（参考 jump1.html）；
- 修改 `index.html` 添加一个按钮跳转到 `/jump4.html`。

---

## 🌍 如何修改语言文本？

语言文本文件在 `public/lang.json` 中，结构如下：

```json
{
  "en": { "tip": "...", "btn1": "...", "btn2": "...", "btn3": "..." },
  "zh-CN": { ... }
}
```

- 支持语言：zh-CN、zh-TW、en、vi、es、pt、it、fr、de
- 你可以继续添加按钮文案：btn4、btn5...

---

## 🛡️ 如何修改签名校验密钥？

签名密钥写在 `/api/jump.js` 中：

```js
const SHARED_KEY = "your-secret-key";
```

**前后端必须一致**。前端会用同样的 KEY 生成签名。
建议每月定期更换，并混淆前端代码。

---

## 🎯 推荐：混淆跳板页 JS

你可以使用 [obfuscator.io](https://obfuscator.io/) 将 jump1~3.html 中的 JS 加密。

开启这些选项：
- ✅ String array
- ✅ Rotate string array
- ✅ Self defending
- ✅ Debug protection

然后替换 JS 部分。

---

## ❤️ 使用中有任何问题？

请联系你的开发助手 ChatGPT 😉
