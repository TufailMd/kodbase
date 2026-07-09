const buildTree = (paths) => {
    const root = [];

    paths.forEach((path) => {
        const parts = path.split("/");

        let current = root;

        parts.forEach((part, index) => {

            let existing = current.find(
                (item) => item.name === part
            );

            if (!existing) {

                existing = {
                    name: part,
                    type:
                        index === parts.length - 1
                            ? "file"
                            : "folder",
                    children: [],
                    path: parts
                        .slice(0, index + 1)
                        .join("/"),
                };

                current.push(existing);
            }

            current = existing.children;
        });
    });

    return root;
};

export default buildTree;