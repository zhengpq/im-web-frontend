const getImageType = (base64Data: string) => {
  const mimeType = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return mimeType && mimeType.length > 1 ? mimeType[1] : null;
};

const isBase64 = (data: string) => {
  const regex =
    /^(data:\w+\/[a-zA-Z+\-.]+;base64,)?(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/;
  return regex.test(data);
};

export const base64ToBlob = (base64Data: string) => {
  if (!isBase64(base64Data)) {
    console.log('数据不是 base64 格式');
    return null;
  }
  // 获取图片类型
  const imageType = getImageType(base64Data);

  // 移除 data URL 的前缀
  const imageData = base64Data.split(';base64,').pop();
  if (!imageData || !imageType) return null;
  // 将 Base64 编码的字符串转换为字节数组
  const byteArray = atob(imageData)
    .split('')
    .map((char) => char.charCodeAt(0));

  // 创建 Blob 对象
  const blob = new Blob([new Uint8Array(byteArray)], { type: imageType });
  return {
    blob,
    imageType,
  };
};
