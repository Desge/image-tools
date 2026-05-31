// ═══════════════════════════════════════════
// 翻译类型定义 — 所有 UI 文本的结构
// ═══════════════════════════════════════════

export interface Translations {
  // 通用
  common: {
    siteName: string;
    tagline: string;
    privacyBadge: string;
    noUploadBadge: string;
    freeBadge: string;
    batchBadge: string;
    upload: string;
    download: string;
    processing: string;
    original: string;
    result: string;
    change: string;
    clear: string;
    apply: string;
    copy: string;
    copied: string;
    close: string;
    downloadBtn: string;
    originalLabel: string;
    resultLabel: string;
    changeImage: string;
    clearAll: string;
    applyBtn: string;
    copyBtn: string;
    seoTitleSuffix: string;
    seoDescription: string;
  };

  // 导航
  nav: {
    home: string;
    compress: string;
    resize: string;
    convert: string;
    allTools: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
  };

  // 首页
  home: {
    title: string;
    subtitle: string;
    privacyLine1: string;
    privacyLine2: string;
    privacyLine3: string;
    popularConversions: string;
    footerText: string;
    categoryEdit: string;
    categoryConvert: string;
    categoryCompress: string;
    categoryGenerate: string;
    categoryUtility: string;
  };

  // 工具页通用
  toolPage: {
    relatedTools: string;
    allImageTools: string;
    faqTitle: string;
    dropHere: string;
    dropHint: string;
    uploadDifferent: string;
    comingSoon: string;
    comingSoonDesc: string;
    formatInput: string;
    formatOutput: string;
    quality: string;
    maxWidth: string;
    compressBtn: string;
    smaller: string;
  };

  // 各工具特定文本
  tools: {
    compress: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      formatLabel: string;
      qualityLabel: string;
      maxWidthLabel: string;
      maxWidthPlaceholder: string;
      compressBtn: string;
      compressing: string;
      smallerLabel: string;
      originalLabel: string;
      resultLabel: string;
      uploadDifferent: string;
      downloadBtn: string;
      batchThumbnail: string;
    };
    resize: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      width: string;
      height: string;
      lockAspect: string;
      resizeBtn: string;
      resized: string;
      widthLabel: string;
      heightLabel: string;
      lockAspectTitle: string;
      resizedLabel: string;
      formatLabel: string;
      changeImage: string;
    };
    crop: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      cropBtn: string;
      free: string;
      formatLabel: string;
      changeImage: string;
    };
    rotate: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      rotate90: string;
      rotate180: string;
      rotate270: string;
      flipH: string;
      flipV: string;
      formatLabel: string;
      changeImage: string;
    };
    watermark: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      watermarkText: string;
      watermarkPlaceholder: string;
      fontSize: string;
      fontSizeLabel: string;
      opacity: string;
      opacityLabel: string;
      position: string;
      positionLabel: string;
      tile: string;
      tileLabel: string;
      applyBtn: string;
      processing: string;
      downloadAll: string;
      downloadBtn: string;
      imagesLoaded: string;
      clearAll: string;
      changeImage: string;
    };
    colorPalette: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      downloadPalette: string;
      copyHex: string;
      changeImage: string;
    };
    faviconGenerator: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      generateAll: string;
      htmlCode: string;
      htmlCodeLabel: string;
      downloadAll: string;
      changeImage: string;
      dropHint: string;
    };
    screenshotBeautify: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      padding: string;
      cornerRadius: string;
      shadow: string;
      background: string;
      beautifyBtn: string;
      changeImage: string;
    };
    base64: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      copyDataUri: string;
      viewSnippets: string;
      overhead: string;
      overheadLabel: string;
      htmlLabel: string;
      cssLabel: string;
      changeImage: string;
    };
    instagramGrid: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      splitBtn: string;
      postOrder: string;
      downloadAll: string;
      downloadTile: string;
      changeImage: string;
      dropHint: string;
      layout3x3: string;
      layout3x2: string;
      layout3x1: string;
      layout2x2: string;
      layout2x1: string;
    };
    removeExif: {
      title: string;
      description: string;
      longDescription: string;
      keywords: string[];
      removeBtn: string;
      removeBtnMultiple: string;
      processing: string;
      howItWorks: string;
      howItWorksTitle: string;
      howItWorksDesc: string;
      stripped: string;
      strippedLabel: string;
      noExifData: string;
      noExifLabel: string;
      downloadBtn: string;
      clearAll: string;
      changeImage: string;
    };
  };

  // 格式转换
  converter: {
    title: string;
    description: string;
    convertBtn: string;
    aboutTitle: string;
    relatedConversions: string;
    allFormats: string;
  };

  // FAQ
  faq: {
    free: { q: string; a: string };
    upload: { q: string; a: string };
    formats: { q: string; a: string };
    batch: { q: string; a: string };
  };
}
