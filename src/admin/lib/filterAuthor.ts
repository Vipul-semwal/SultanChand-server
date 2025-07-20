type Author = {
  id: string;
  name: string;
  description: string;
  image: string;
  subText: string;
};

export function filterAuthorsByLetter(
  authors: Author[],
  letter: string
): Author[] {
  return authors.filter((author) =>
    author.name.toLowerCase().startsWith(letter.toLowerCase())
  );
};
