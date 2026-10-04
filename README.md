# 个人主页

一份可以挂在 GitHub Pages 上的简历页。没有框架，也不需要安装依赖。改文字只动 `content.json`，推送之后页面会跟着更新。

## 改内容

打开 [`content.json`](content.json)，换成你自己的名字、学校、经历、项目和链接。文件顶部的 `"$schema"` 留着，编辑器会提示每个字段怎么填。

某一块暂时没有内容时，把对应数组改成 `[]`，或者删掉那个字段，页面上就不会出现这一块。

| 字段 | 作用 |
| --- | --- |
| `name` | 名字 |
| `role` | 身份，例如「学生 · 前端」 |
| `location` | 名字上方的一小行，通常写城市 |
| `tagline` | 名字下面的一句话，也用作网页简介 |
| `about` | 关于我，每一项是一段 |
| `education` | 教育。`school` 学校，`program` 专业，`period` 时间，`detail` 补充 |
| `experience` | 经历。`org` 组织，`role` 角色，`period` 时间，`detail` 做了什么 |
| `projects` | 项目。`url` 要写成 `https://` 开头；不写 `url` 时卡片还在，只是不能点开 |
| `skills` | 技能分组。`group` 是组名，`items` 是这一组里的技能 |
| `email` | 联系区里大字显示的邮箱 |
| `links` | GitHub、邮箱或其他链接。地址用 `https://` 或 `mailto:` |

链接不要写成 `javascript:` 或其他协议，页面会忽略。

## 本地预览

在这个文件夹里启动一个本地服务器，再用浏览器打开。不要直接双击 `index.html`，那样读不到 `content.json`。

```bash
python -m http.server 5500
```

然后打开 <http://localhost:5500>。改完 JSON 后刷新即可。

## 放到 GitHub Pages

1. 在 GitHub 新建一个**公开**仓库。仓库名用 `你的用户名.github.io` 时，地址是 `https://你的用户名.github.io`。用别的名字时，地址是 `https://你的用户名.github.io/仓库名`。
2. 把本目录里的文件推送到 `main` 分支。
3. 打开仓库的 Settings → Pages。Build and deployment 选 **Deploy from a branch**，Branch 选 `main`，文件夹选 `/ (root)`，保存。

等一两分钟，Pages 地址就可以打开。之后每次改 `content.json` 并推送，站点都会更新。

## 改颜色

配色在 [`styles.css`](styles.css) 最上面的变量里。`--bg` 是底色，`--text` 是正文，`--accent` 是铜金色。标题用 Newsreader（中文回退到思源宋体），正文用 Outfit（中文回退到思源黑体）。字体从 Google Fonts 加载；如果字体没有加载出来，会改用系统里的宋体和黑体。
