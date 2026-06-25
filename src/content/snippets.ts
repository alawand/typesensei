export type Language = 'python' | 'java' | 'c';

export interface Snippet {
  id: string;
  language: Language;
  title: string;
  source: string;
}

/** Starter pack. EVERY character (including indentation) is typed verbatim. */
export const SNIPPETS: Snippet[] = [
  {
    id: 'py-fib',
    language: 'python',
    title: 'Fibonacci sequence',
    source: `def fib(n: int) -> list[int]:
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]`,
  },
  {
    id: 'java-counter',
    language: 'java',
    title: 'Thread-safe counter',
    source: `public class Counter {
    private int count = 0;

    public synchronized int increment() {
        return ++count;
    }
}`,
  },
  {
    id: 'c-squares',
    language: 'c',
    title: 'Print squares',
    source: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        printf("%d\\n", i * i);
    }
    return 0;
}`,
  },
];
