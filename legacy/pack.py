import base64
import os
import sys

# === 核心修改：获取脚本所在的绝对路径 ===
# 不管你在哪里运行，这行代码都能找到脚本所在的文件夹
current_dir = os.path.dirname(os.path.abspath(__file__))

# 拼接绝对路径
html_file = os.path.join(current_dir, 'index.html')
video_file = os.path.join(current_dir, 'chen.webm')
img_file = os.path.join(current_dir, 'enemy.png')
output_file = os.path.join(current_dir, '赤刃明霄陈 战术模拟终端.html')

print(f"正在扫描文件夹: {current_dir}")

def get_base64(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"文件未找到: {file_path}")
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

try:
    print("-" * 30)
    # 1. 读取 HTML
    print(f"1. 读取 HTML: {html_file}")
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 2. 替换图片
    print(f"2. 打包图片: {img_file}")
    img_b64 = get_base64(img_file)
    html_content = html_content.replace('src="enemy.png"', f'src="data:image/png;base64,{img_b64}"')

    # 3. 替换视频
    print(f"3. 打包视频: {video_file}")
    video_b64 = get_base64(video_file)
    html_content = html_content.replace('src="chen.webm"', f'src="data:video/webm;base64,{video_b64}"')

    # 4. 写入新文件
    print(f"4. 生成文件: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print("-" * 30)
    print("✅ 打包成功！")
    print(f"文件位置: {output_file}")

except FileNotFoundError as e:
    print("\n❌ 错误：")
    print(str(e))
    print("请确认文件名完全一致（注意后缀名是否被隐藏）")
except Exception as e:
    print(f"\n❌ 发生未知错误：{e}")