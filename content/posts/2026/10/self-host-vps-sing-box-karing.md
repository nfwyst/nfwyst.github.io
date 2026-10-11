+++
title = "从零自建 VPS 节点：Debian、sing-box Reality 与 Karing 完整实战"
date = "2026-10-11T16:40:00+08:00"
tags = ["vps", "sing-box", "karing", "network", "debian"]
keywords = ["自建 VPS", "sing-box", "VLESS Reality", "Hysteria2", "Karing", "Debian 13", "CN2 GIA"]
description = "一篇从 VPS 选购、SSH 加固、安全组、BBR、sing-box Reality 到 Karing 导入和故障排查的完整实践指南。"
+++

自建 VPS 节点真正困难的部分，通常不是复制一份配置文件，而是把购买、网络、安全和客户端串成一条可以验证的链路。本文记录一次完整实践：购买一台 Debian VPS，将它加固为仅允许密钥登录的服务器，部署 sing-box 的 VLESS Reality，再把节点导入 Karing。

文中的 IP、UUID、密钥和域名全部使用占位符。请只在自己拥有或获授权的服务器上操作，并遵守所在地法律、服务商条款和网络使用规范。

## 最终架构

```text
Mac / iPhone / Android
└── Karing
    ├── VLESS + Reality → VPS TCP 443
    └── Hysteria2 + TLS → VPS UDP 443（可选）

VPS
└── Debian 13
    ├── OpenSSH：TCP 46019
    ├── sing-box：TCP 443 / UDP 443
    ├── BBR + fq
    └── 安全组 + 主机防火墙
```

Karing 是客户端，不是服务端。Karing 官方将其定义为基于 sing-box 的图形界面，并兼容 Sing-box、Clash、V2Ray/V2Fly 和 Shadowsocks 等配置。VPS 上运行的是 sing-box，手机和电脑上安装 Karing。

- Karing：https://github.com/KaringX/karing
- sing-box：https://sing-box.sagernet.org/

## 一、购买 VPS 时先看什么

用于个人节点时，CPU、内存和磁盘通常不是瓶颈。网络线路、端口速率、流量额度和 UDP 可用性更重要。

### 推荐的起步规格

```text
CPU：2 vCPU
内存：2–4 GB
系统盘：20–50 GB
系统：Debian 12/13 x64
公网地址：1 个 IPv4
流量：按实际用途选择，并确认月配额和计费方向
```

2 核 4 GB 已经可以同时运行 VLESS Reality 和 Hysteria2。将预算从 2C4G 提升到 4C8G，通常不会提高网络吞吐；优先购买线路和带宽信息更透明的产品。

### 明确区分线路名称

“大陆优化”“China Optimized”“CN2”不一定等于 CN2 GIA。购买前应要求具体 SKU、配置页或合同明确写出：

```text
CN2 GIA
CN2GIA
```

`AS4809` 是电信 CN2 常见的自治系统号，只能作为路由佐证，不能单独证明线路属于 CN2 GIA；CN2 GT 等线路也可能经过 AS4809。产品承诺应以明确的 SKU 和文字说明为准，购后再用多个地区、多个运营商的 `mtr` 或 `traceroute` 检查实际路由。

联通和移动线路还可能出现：

```text
AS9929 / AS10099
CMIN2 / AS58807
```

### `Bandwidth: 0` 不代表 0 Mbps

部分动态价格计算器同时显示：

```text
Billing Method: Traffic Based Billing
Bandwidth: 0
Traffic: Enterprise CN2 G 1T
```

这里的 `0` 通常表示流量计费模式没有选择固定 Mbps 档位，不能理解为 0 Mbps，也不能理解为无限端口。页面若未写明实际端口速率，就必须通过售前确认或购后实测。

## 二、确认真实公网 IP 和 SSH 端口

服务商控制台显示的 IP 不一定等于实例真正用于入站的地址。有些平台使用 NAT、弹性 IP 或单独的出站地址。

先通过 VNC 登录 VPS，执行：

```bash
ip -4 -br addr
ip route
curl -4 --connect-timeout 10 https://ifconfig.co
```

这三个结果分别代表：

- 网卡实际地址；
- 默认路由和网关；
- 外部看到的出站公网 IP。

如果控制台 IP、网卡 IP 和出口 IP 不一致，应分别测试，并在服务商后台检查弹性 IP 与 NAT 绑定关系。不要在确认入站地址前配置域名。

很多镜像会随机生成非标准 SSH 端口，例如 `46019`。连接命令为：

```bash
ssh -p 46019 root@YOUR_SERVER_IP
```

出现超时时，密码尚未参与认证。应先检查端口、安全组和 sshd，而不是反复修改密码。

## 三、通过 VNC 诊断 SSH 超时

在服务商 VNC 中检查 SSH：

```bash
systemctl status ssh --no-pager -l
journalctl -u ssh -b --no-pager -n 100
ss -lntp | grep -E 'sshd|:22|:46019'
```

正常状态应包含：

```text
Active: active (running)
Server listening on 0.0.0.0 port 46019
```

如果服务不存在：

```bash
apt update
apt install --reinstall -y openssh-server
systemctl enable --now ssh
```

如果 sshd 正常监听，而不同网络连接仍超时，应检查服务商安全组。默认安全组往往只开放 22、3389 等端口，不会自动开放自定义 SSH 端口或 443。

### 用 tcpdump 判断数据包是否到达

```bash
apt install -y tcpdump
tcpdump -ni any 'tcp port 46019'
```

从另一台电脑尝试连接：

```bash
nc -vz -G 5 YOUR_SERVER_IP 46019
```

判断方法：

- 没有任何数据包：安全组、上游 ACL、NAT 或公网路由问题；
- 只有 SYN：数据已到服务器，但本机防火墙或服务未响应；
- 有 SYN 和 SYN-ACK：服务器已响应，应继续检查客户端或认证；
- 完成握手后断开：查看 SSH 认证日志。

## 四、首次登录后的基础初始化

先修改服务商生成的初始密码：

```bash
passwd
```

更新系统并安装基础工具：

```bash
apt update
apt full-upgrade -y
apt install -y curl ca-certificates openssl jq nano ufw sudo mtr-tiny
timedatectl set-timezone Asia/Shanghai
systemctl enable --now systemd-timesyncd
```

确认系统状态：

```bash
cat /etc/os-release
uname -a
free -h
df -h
ip -br addr
```

## 五、配置 SSH 公钥

在本地 Mac 生成密钥：

```bash
ssh-keygen -t ed25519 -a 64
```

如果已经存在 `~/.ssh/id_ed25519`，不要覆盖。将公钥写入服务器：

```bash
cat ~/.ssh/id_ed25519.pub | \
ssh -p 46019 root@YOUR_SERVER_IP \
'umask 077; mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys'
```

在新终端中强制使用公钥验证：

```bash
ssh \
  -o PasswordAuthentication=no \
  -o KbdInteractiveAuthentication=no \
  -o PreferredAuthentications=publickey \
  -p 46019 \
  root@YOUR_SERVER_IP
```

只有公钥登录成功后，才能关闭密码登录。旧 SSH 和 VNC 会话应保持打开，避免错误配置后失联。

## 六、正确关闭 SSH 密码登录

Debian/cloud-init 镜像可能同时存在：

```text
/etc/ssh/sshd_config
/etc/ssh/sshd_config.d/50-cloud-init.conf
/etc/ssh/sshd_config.d/allow_root.conf
```

这些文件可能包含：

```text
PasswordAuthentication yes
PermitRootLogin yes
```

OpenSSH 对许多选项使用先读取的值，因此 `99-hardening.conf` 不一定能覆盖更早的 `50-cloud-init.conf`。应创建最先加载的配置：

```bash
printf '%s\n' \
'PubkeyAuthentication yes' \
'PasswordAuthentication no' \
'KbdInteractiveAuthentication no' \
'PermitRootLogin prohibit-password' \
> /etc/ssh/sshd_config.d/00-hardening.conf
```

禁用明确允许 root 密码的供应商配置：

```bash
test -f /etc/ssh/sshd_config.d/allow_root.conf && \
mv /etc/ssh/sshd_config.d/allow_root.conf \
   /etc/ssh/sshd_config.d/allow_root.conf.disabled
```

禁用 cloud-init 的密码配置：

```bash
test -f /etc/ssh/sshd_config.d/50-cloud-init.conf && \
mv /etc/ssh/sshd_config.d/50-cloud-init.conf \
   /etc/ssh/sshd_config.d/50-cloud-init.conf.disabled
```

检查配置来源和最终值：

```bash
grep -RnsE '^[[:space:]]*(Include|PubkeyAuthentication|PasswordAuthentication|KbdInteractiveAuthentication|PermitRootLogin|Match)' \
  /etc/ssh/sshd_config \
  /etc/ssh/sshd_config.d 2>/dev/null

sshd -t

sshd -T | grep -E '^(port|pubkeyauthentication|passwordauthentication|kbdinteractiveauthentication|permitrootlogin)'
```

预期：

```text
port 46019
pubkeyauthentication yes
passwordauthentication no
kbdinteractiveauthentication no
permitrootlogin without-password
```

重载而不是重启 SSH：

```bash
systemctl reload ssh
```

保留当前会话，从另一终端强制只使用密码认证：

```bash
ssh \
  -o PubkeyAuthentication=no \
  -o KbdInteractiveAuthentication=no \
  -o PreferredAuthentications=password \
  -p 46019 \
  root@YOUR_SERVER_IP
```

预期返回 `Permission denied`。如果仍出现密码提示或可以登录，说明仍有更早加载的配置、`Match` 块或其他认证方式生效，应继续检查 `sshd -T` 和配置来源。

> VNC 控制台仍然可以使用 root 密码登录，这是正常的。`PasswordAuthentication no` 只关闭 SSH 网络密码登录。

## 七、配置服务商安全组

建议为当前 VPS 创建独立安全组，避免修改会被其他实例复用的默认安全组。

| 来源 | 方向 | 协议 | 端口 | 用途 |
|---|---|---|---:|---|
| 家庭公网 IP `/32` | 入站 | TCP | 46019 | SSH |
| `0.0.0.0/0` | 入站 | TCP | 443 | VLESS Reality |
| `0.0.0.0/0` | 入站 | UDP | 443 | Hysteria2 |
| `0.0.0.0/0` | 入站 | TCP | 80 | ACME HTTP 证书验证 |
| `0.0.0.0/0` | 出站 | TCP/UDP | 1–65535 | 正常出站 |

家庭电信宽带的公网 IP 可以作为 SSH 白名单。关闭其他 VPN 后，在本地 Mac 查询：

```bash
curl -4 https://ifconfig.co
```

安全组来源填写：

```text
查询结果/32
```

家庭公网 IP 可能在光猫、路由器重启或重新拨号后变化。变化后需要更新安全组。若经常更换网络，可以让 46019 暂时对公网开放，但必须关闭密码登录，仅允许公钥。

## 八、配置主机防火墙

服务商安全组生效后，再启用 UFW 作为第二层防护：

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 46019/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable
ufw status verbose
```

必须先放行实际 SSH 端口再启用 UFW。

## 九、启用 BBR

BBR 用于改善 TCP 拥塞控制，主要影响 VLESS Reality 的 TCP 流量。它无法突破服务商限速，也不会替代好线路。

在某些网页 VNC 中，`vi` 会把 ANSI 控制码显示成 `^[[...`。不要用全屏编辑器，直接使用两个单行命令：

```bash
echo 'net.core.default_qdisc=fq' > /etc/sysctl.d/99-bbr.conf
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.d/99-bbr.conf
```

验证文件：

```bash
cat -n /etc/sysctl.d/99-bbr.conf
```

应为：

```text
1  net.core.default_qdisc=fq
2  net.ipv4.tcp_congestion_control=bbr
```

加载并应用：

```bash
modprobe tcp_bbr
modprobe sch_fq
sysctl -p /etc/sysctl.d/99-bbr.conf
```

验证：

```bash
sysctl net.core.default_qdisc
sysctl net.ipv4.tcp_congestion_control
sysctl net.ipv4.tcp_available_congestion_control
```

## 十、安装 sing-box

下载官方脚本，检查后执行：

```bash
curl -fsSL https://sing-box.app/deb-install.sh \
  -o /tmp/sing-box-install.sh

head -n 20 /tmp/sing-box-install.sh
bash /tmp/sing-box-install.sh
```

确认版本：

```bash
sing-box version
systemctl stop sing-box
```

## 十一、生成 Reality 参数

```bash
sing-box generate uuid
sing-box generate reality-keypair
openssl rand -hex 8
```

分别保存：

```text
UUID
Reality PrivateKey
Reality PublicKey
Short ID
```

安全边界：

- PrivateKey 只放在服务器和加密密码管理器；
- PublicKey 放在客户端；
- UUID、Short ID 和完整分享链接都应视为凭据；
- 不要把完整链接、二维码或 PrivateKey 上传到 GitHub、群聊和公开截图。

可以为每台设备生成独立 UUID，设备丢失时只撤销该设备。

## 十二、部署 VLESS Reality

检查目标站点支持 TLS：

```bash
curl -I --max-time 10 https://www.microsoft.com
```

编辑：

```bash
nano /etc/sing-box/config.json
```

配置模板：

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "vless",
      "tag": "vless-reality-in",
      "listen": "0.0.0.0",
      "listen_port": 443,
      "users": [
        {
          "name": "macbook",
          "uuid": "YOUR_UUID",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "www.microsoft.com",
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "www.microsoft.com",
            "server_port": 443
          },
          "private_key": "YOUR_REALITY_PRIVATE_KEY",
          "short_id": [
            "YOUR_SHORT_ID"
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ]
}
```

检查并启动：

```bash
jq empty /etc/sing-box/config.json
sing-box check -c /etc/sing-box/config.json
systemctl enable sing-box
systemctl restart sing-box
systemctl status sing-box --no-pager -l
ss -lntp | grep ':443'
journalctl -u sing-box -b --no-pager -n 200
```

成功日志应包含：

```text
tcp server started at 0.0.0.0:443
sing-box started
```

如果服务正常但外部 443 超时，优先检查服务商安全组，而不是修改 Reality 参数。

## 十三、导入 Karing

VLESS URI 模板：

```text
vless://YOUR_UUID@YOUR_SERVER_IP:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=www.microsoft.com&fp=chrome&pbk=YOUR_REALITY_PUBLIC_KEY&sid=YOUR_SHORT_ID&type=tcp#VPS-Reality
```

字段说明：

- `pbk` 必须使用 PublicKey，不能使用 PrivateKey；
- `sid` 必须与服务端 Short ID 完全相同；
- `sni` 必须与服务端 `server_name`、`handshake.server` 一致；
- `#VPS-Reality` 只是 Karing 中显示的节点名称，不参与认证。

在 Karing 中选择“从剪贴板导入”，连接后访问：

```text
https://ifconfig.co
```

显示 VPS 出口 IP，说明代理链路成功。

## 十四、Karing 超时的排查顺序

### 第一步：测试 TCP 443

Mac：

```bash
nc -vz -G 5 YOUR_SERVER_IP 443
```

如果超时，问题在端口监听、安全组或防火墙，链接参数尚未参与。

### 第二步：检查服务

```bash
sing-box check -c /etc/sing-box/config.json
systemctl status sing-box --no-pager -l
ss -lntp | grep ':443'
```

### 第三步：检查防火墙

```bash
ufw status verbose
nft list ruleset | grep -nE 'drop|reject|443'
```

### 第四步：抓包

```bash
tcpdump -ni any 'tcp port 443'
```

连接 Karing 后：

- 没有数据包：安全组、NAT 或公网 IP 错误；
- 有 SYN 但无响应：主机防火墙或监听问题；
- TCP 建连后失败：检查 UUID、PublicKey、Short ID、SNI 和 flow；
- 日志出现认证错误：逐项对照客户端与服务端参数。

## 十五、可选：增加 Hysteria2

Reality 正常后，可以在高丢包或高抖动网络中增加 Hysteria2。需要一个解析到 VPS 的域名。

添加 DNS A 记录：

```text
node.example.com → YOUR_SERVER_IP
```

安装 certbot 并申请证书：

```bash
apt install -y certbot
certbot certonly \
  --standalone \
  -d node.example.com \
  --agree-tos \
  -m YOUR_EMAIL \
  --non-interactive
```

生成密码：

```bash
openssl rand -hex 24
```

在 `inbounds` 数组中增加：

```json
{
  "type": "hysteria2",
  "tag": "hysteria2-in",
  "listen": "0.0.0.0",
  "listen_port": 443,
  "users": [
    {
      "password": "YOUR_HYSTERIA2_PASSWORD"
    }
  ],
  "tls": {
    "enabled": true,
    "server_name": "node.example.com",
    "certificate_path": "/etc/letsencrypt/live/node.example.com/fullchain.pem",
    "key_path": "/etc/letsencrypt/live/node.example.com/privkey.pem"
  }
}
```

VLESS Reality 使用 TCP 443，Hysteria2 使用 UDP 443，端口号相同但传输协议不同，不冲突。

Hysteria2 URI：

```text
hysteria2://YOUR_HYSTERIA2_PASSWORD@node.example.com:443/?sni=node.example.com#VPS-HY2
```

## 十六、性能验收

不能只根据产品页判断网络质量。部署完成后应在实际使用的宽带、移动网络和异地网络中测试。

临时安装 iperf3：

```bash
apt install -y iperf3
iperf3 -s -p 5201
```

Mac：

```bash
brew install iperf3
iperf3 -c YOUR_SERVER_IP -p 5201 -R
iperf3 -c YOUR_SERVER_IP -p 5201
iperf3 -c YOUR_SERVER_IP -p 5201 -u -b 50M
```

测试结束后关闭服务并删除临时安全组规则：

```bash
pkill iperf3
```

还应完成：

1. 电信、联通、移动网络分别测试；
2. 工作日、周末和网络高峰时段分别测试；
3. 对比 TCP 上下行吞吐、UDP 丢包率和抖动；
4. 连续运行 30 分钟；
5. 观察 Karing 连接、丢包和切换恢复；
6. 检查流量统计是否为上下行双向计费。

## 十七、日常维护

每周或每月更新：

```bash
apt update
apt full-upgrade -y
```

检查服务：

```bash
systemctl status sing-box --no-pager
journalctl -u sing-box --since today --no-pager
ss -lntup | grep ':443'
```

备份以下内容到加密密码管理器：

```text
服务器入站 IP 和端口
SSH 公钥信息
UUID
Reality PrivateKey / PublicKey
Short ID
Hysteria2 密码
域名和证书信息
```

服务器上的配置权限应为：

```bash
chown root:root /etc/sing-box/config.json
chmod 600 /etc/sing-box/config.json
```

如果完整分享链接泄露，更换 UUID 和 Short ID；如果 PrivateKey 泄露，重新生成整个 Reality KeyPair，并更新所有客户端。

## 结语

自建 VPS 节点的正确流程不是“安装脚本运行成功就结束”，而是逐层验证：

```text
购买参数
→ 真实 IP 与 SSH
→ 密钥登录和安全组
→ BBR 与系统初始化
→ sing-box 配置检查
→ 443 端口可达
→ Karing 参数一致
→ 多网络与多时段实测
→ 密钥轮换与日常维护
```

只要按照这个顺序排查，超时问题就能被明确定位到客户端参数、服务监听、主机防火墙、安全组或服务商网络中的某一层，而不必反复重装系统或盲目更换配置。
