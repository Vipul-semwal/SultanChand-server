

export function shuffleAuthors(list:Array<{
  author_id: string,
  priority: number
}>, priorityChanges:Record<string, number>
// or { [author_id: string]: number }
): Array<{
    author_id: string,
    priority: number,
}> {

  // Step 1: Clone and sort original list by priority
  const sorted = [...list].sort((a, b) => a.priority - b.priority);

  // Step 2: Separate authors that will be moved
const toMove: Array<{ author_id: string, priority: number, targetPriority: number }> = [];
  const remaining = sorted.filter(author => {
    if (priorityChanges[author.author_id] != null) {
      toMove.push({
        ...author,
        targetPriority: priorityChanges[author.author_id],
      });
      return false; // exclude from remaining
    }
    return true;
  });

  // Step 3: Insert moved authors at their new target positions
  const merged = [...remaining];
  toMove.forEach(author => {
    const index = Math.max(0, author.targetPriority - 1);
    merged.splice(index, 0, author); // insert at desired index
  });

  // Step 4: Reassign sequential priorities (1 → n)
  return merged.map((author, index) => ({
    ...author,
    priority: index + 1,
  }));
}


