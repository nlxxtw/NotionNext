# 博客游客付费解锁（当面付 + Cookie）

## 流程

1. Notion 文章里放 **Callout**，标题以 `【付费】` 或 `【隐藏】` 开头  
2. 博客公开页只显示付费卡，正文/网盘链接不会进 HTML  
3. 游客点「支付宝扫码解锁」→ 当面付  
4. 付完后 Cookie/localStorage 记凭证，自动展示内容  

## Notion 写法

```
Callout 标题：【付费】网盘资源 3元
Callout 内容：百度网盘链接 + 提取码
```

- 金额可写在标题里（如 `3元` / `¥3`）；不写则用**后台「博客付费解锁」默认价**（博客也会拉 `/api/blog-pay/config`）  
- 一篇文章可放多个付费 Callout，各自独立解锁  

## 后台配置（优先）

在 `D:\wwwroot\backend` 管理后台：

| 菜单 | 用途 |
|------|------|
| **人民时评精读 → AI/Notion配置** | Notion Token、数据库 ID、自动同步、revalidate |
| **人民时评精读 → 博客付费解锁** | 开关、默认价、价格区间、有效天数、提示文案 |

NotionNext 只需保留连接串：

```bash
BLOG_PAY_API_BASE=https://你的backend域名   # 不要带尾斜杠；会请求 /blog_unlock/*
BLOG_PAY_APP_ID=1000
# 以下可作离线回退；正式以后台为准
NEXT_PUBLIC_BLOG_PAY_ENABLED=true
NEXT_PUBLIC_BLOG_PAY_DEFAULT_PRICE=3
```

## Backend 接口（已加）

| 路径 | 说明 |
|------|------|
| `POST blog_unlock/config` | 公开配置（后台写入） |
| `POST blog_unlock/create` | 建单 + 当面付二维码 |
| `POST blog_unlock/status` | 查支付/解锁 |
| `POST blog_unlock/check` | 仅查是否解锁 |

请求头需要：`appId`（与你们其它 API 一致）

支付成功走现有支付宝回调 → `order_type=25` → 写入 `think_blog_unlock`

## 后台配置（你说后面一起弄）

当面付仍用现有 `ali_h5_pay` 配置，无需新商户号。  
后续可在后台加：默认价格、开关、订单列表。

## 注意

- 游客凭证存在本机；清缓存后需凭订单号补发  
- 正式上线前用 0.01～1 元测一笔  
- 确保 `BLOG_PAY_API_BASE` 从博客服务器能访问到 backend  
