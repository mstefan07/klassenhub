import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  framed?: boolean;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  framed = true,
}: EmptyStateProps) {
  const content = (
    <>
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      ) : null}
    </>
  );

  if (!framed) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        {content}
      </div>
    );
  }

  return (
    <Card className="flex min-h-52 flex-col items-center justify-center p-6 text-center">
      {content}
    </Card>
  );
}
