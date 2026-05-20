import subprocess
import sys


def main():
    try:
        print("正在启动 ngrok 隧道 -> http://localhost:5173")
        subprocess.run(["ngrok", "http", "5173"], check=True)
    except FileNotFoundError:
        print("错误：未找到 ngrok 命令，请确认已安装 ngrok 并添加到 PATH")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n隧道已关闭")


if __name__ == "__main__":
    main()
