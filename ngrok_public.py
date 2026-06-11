import subprocess
import sys
import os
import shutil


def find_ngrok():
    """查找 ngrok 可执行文件"""
    # 先在 PATH 里找
    ngrok_path = shutil.which("ngrok")
    if ngrok_path:
        return ngrok_path

    # Windows 常见下载位置
    if sys.platform == "win32":
        candidates = [
            os.path.expanduser("~/Downloads/ngrok.exe"),
            os.path.expanduser("~/Desktop/ngrok.exe"),
            "C:\\ngrok\\ngrok.exe",
        ]
        for c in candidates:
            if os.path.exists(c):
                return c

    # macOS/Linux
    candidates = [
        os.path.expanduser("~/Downloads/ngrok"),
        "/usr/local/bin/ngrok",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c

    return None


def check_authtoken(ngrok_path):
    """检查 ngrok 是否已配置 authtoken"""
    try:
        result = subprocess.run(
            [ngrok_path, "config", "check"],
            capture_output=True, text=True, timeout=10
        )
        return result.returncode == 0
    except Exception:
        return False


def main():
    ngrok = find_ngrok()

    if not ngrok:
        print("=" * 50)
        print("未找到 ngrok 命令")
        print("=" * 50)
        print()
        print("请按以下步骤安装 ngrok：")
        print()
        print("  1. 访问 https://ngrok.com 注册免费账号")
        print("  2. 下载 ngrok 客户端（Windows 选 .exe）")
        print("  3. 解压到某个目录，例如 C:\\ngrok\\")
        print("  4. 运行认证命令（仅首次）：")
        print("     ngrok config add-authtoken <你的token>")
        print()
        print("  或者直接把 ngrok.exe 放到项目根目录，")
        print("  脚本会自动找到它。")
        print()
        print("=" * 50)
        sys.exit(1)

    if not check_authtoken(ngrok):
        print("=" * 50)
        print("ngrok 尚未配置 authtoken")
        print("=" * 50)
        print()
        print("请运行以下命令（仅首次）：")
        print(f"  {ngrok} config add-authtoken <你的token>")
        print()
        print("token 在 https://dashboard.ngrok.com/get-started/your-authtoken 查看")
        print("=" * 50)
        sys.exit(1)

    print(f"ngrok: {ngrok}")
    print("正在启动 ngrok 隧道 -> http://localhost:5173")
    print("成功后复制 https://xxxxx.ngrok-free.app 发给其他人即可访问")
    print("按 Ctrl+C 关闭隧道")
    print()

    try:
        subprocess.run([ngrok, "http", "5173"], check=True)
    except KeyboardInterrupt:
        print("\n隧道已关闭")
    except Exception as e:
        print(f"\n运行出错：{e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
