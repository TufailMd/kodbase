export default function buildTree(paths) {
  const root = [];

  for (const fullPath of paths) {
    const parts = fullPath.split("/");

    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      let node = current.find(
        (item) =>
          item.name === part && item.type === (isFile ? "file" : "folder"),
      );

      if (!node) {
        node = {
          name: part,

          type: isFile ? "file" : "folder",

          path: parts.slice(0, index + 1).join("/"),

          children: [],
        };

        current.push(node);
      }

      current = node.children;
    });
  }

  return root;
}
