---
title: Markdown Rendering Test
date: 2024-02-20
categories:
  - Tech
  - Getting Started
tags:
  - markdown
  - test
---

This post tests various markdown rendering features.

## Headings

### Third Level Heading

#### Fourth Level Heading

##### Fifth Level Heading

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and `inline code`. You can also use ~~strikethrough~~ text.

## Lists

### Unordered List

- Item one
- Item two
  - Nested item A
  - Nested item B
- Item three

### Ordered List

1. First step
2. Second step
3. Third step

## Code Block

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}
```

## Blockquote

> Simplicity is the ultimate sophistication.
> — Leonardo da Vinci

## Table

| Name | Type | Description |
|------|------|-------------|
| title | string | The post title |
| date | date | Publication date |
| tags | array | List of tags |
| categories | array | List of categories |

## Image

Images are displayed centered with max-width 100%.

## Links

Visit [Next.js Documentation](https://nextjs.org/docs) for more information about the framework.
