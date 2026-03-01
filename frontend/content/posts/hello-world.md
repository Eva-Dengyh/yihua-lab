---
title: Hello World
date: 2024-01-15
categories:
  - Getting Started
tags:
  - hexo
  - blog
---

Welcome to my blog! This is your very first post. Check the [documentation](https://nextjs.org/docs) for more info.

## Quick Start

### Creating a New Post

Create a new markdown file in `content/posts/` with front-matter:

```yaml
---
title: My Post Title
date: 2024-01-15
categories:
  - Category Name
tags:
  - tag1
  - tag2
---
```

### Markdown Features

You can use all standard markdown features:

- **Bold text** and *italic text*
- [Links](https://example.com)
- Images
- Code blocks

### Code Highlighting

Here's some JavaScript:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return { message: `Welcome to the blog, ${name}` };
}

const result = greet("World");
console.log(result.message);
```

And some Python:

```python
def fibonacci(n):
    """Generate fibonacci sequence up to n."""
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

for num in fibonacci(100):
    print(num, end=' ')
```

### Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

### Table

| Feature | Status |
|---------|--------|
| Dark Mode | Supported |
| Responsive | Yes |
| Code Highlight | Yes |
| TOC | Yes |

## What's Next?

Explore the different pages:

1. **Archives** - View all posts organized by date
2. **Categories** - Browse posts by category
3. **Tags** - Find posts by tags
