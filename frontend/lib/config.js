const siteConfig = {
  // Header
  navname: "Eva's Blog",

  // Navigator items (路由定义，文本由字典文件提供)
  nav: {
    posts: "/archives",
    categories: "/category",
    tags: "/tag",
    about: "/about",
    projects: "/projects",
  },

  // Favicon
  favicon: "/favicon.ico",

  // Profile
  nickname: "Eva",
  description:
    'A lifelong learner passionate about exploring cutting-edge technologies, <br>focusing on AI engineering practice and continuous innovation.',
  avatar: "/images/avatar.jpeg",

  // Social links
  links: {
    WeChat: "https://mp.weixin.qq.com/s/vQjVkf-hg1JCVtVMFltYoA?clicktime=1772375520&enterid=1772375520&scene=126&sessionid=1772375487&subscene=91",
    RedBook: "https://www.xiaohongshu.com/user/profile/6534a8c900000000060047c5",
    Github: "https://github.com/Eva-Dengyh",
  },
  links_text_enable: false,
  links_icon_enable: true,

  // Post page
  post_meta_enable: true,
  post_author_enable: true,
  post_date_enable: true,
  post_category_enable: true,

  // Post copyright
  post_copyright_enable: false,
  post_copyright_author_enable: true,
  post_copyright_permalink_enable: true,
  post_copyright_license_enable: true,
  post_copyright_license_text:
    'Copyright (c) 2019 <a href="http://creativecommons.org/licenses/by-nc/4.0/">CC-BY-NC-4.0</a> LICENSE',
  post_copyright_slogan_enable: true,
  post_copyright_slogan_text:
    "Do you believe in <strong>DESTINY</strong>?",

  // TOC
  post_toc_enable: true,

  // Page
  page_title_enable: true,

  // Date format
  date_format: "MMMM D, YYYY",

  // Site info
  author: "Eva",
  title: "Eva's Blog",
};

export default siteConfig;
