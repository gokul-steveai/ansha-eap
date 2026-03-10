"use client";

import { useEffect, useState } from "react";
import { MOOD_STATEMENT_BANK } from "@/lib/const";
import Link from "next/link";

function getRandomStatement(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MoodStatement({
  percentage,
}: {
  percentage: number | undefined;
}) {
  const [statement, setStatement] = useState<string | null>(null);

  useEffect(() => {
    if (!percentage) return;
    const isPositive = percentage >= 50;
    const randomStatement = isPositive
      ? getRandomStatement(MOOD_STATEMENT_BANK.above)
      : getRandomStatement(MOOD_STATEMENT_BANK.below);
    setStatement(randomStatement);
  }, [percentage]);

  if (!percentage || !statement) return null;

  const isPositive = percentage >= 50;

  return (
    <div>
      <span>{statement} </span>
      {!isPositive && (
        <Link href="/resources" className="underline font-medium">
          Visit Resources
        </Link>
      )}
    </div>
  );
}
